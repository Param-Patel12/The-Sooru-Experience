declare const process: { env: Record<string, string | undefined> }

type EnquiryPayload = {
  name?: unknown
  email?: unknown
  phone?: unknown
  guests?: unknown
  message?: unknown
  website?: unknown
}

type CleanEnquiry = {
  name: string
  email: string
  phone: string
  guests: number
  message: string
}

const MAX_BODY_BYTES = 10_000
const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW_SECONDS = 60 * 60
const RATE_LIMIT_SCRIPT = [
  "local count = redis.call('INCR', KEYS[1])",
  "if count == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end",
  'return count',
].join('\n')

function json(body: Record<string, unknown>, status = 200): Response {
  return Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}

function cleanField(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return ''
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, maxLength)
}

function validatePayload(payload: EnquiryPayload): { value?: CleanEnquiry; fields?: Record<string, string> } {
  const name = cleanField(payload.name, 100)
  const email = cleanField(payload.email, 254)
  const phone = cleanField(payload.phone, 30)
  const message = cleanField(payload.message, 2000)
  const guestValue = typeof payload.guests === 'string' ? payload.guests.trim() : ''
  const guests = /^\d{1,2}$/.test(guestValue) ? Number(guestValue) : 0
  const fields: Record<string, string> = {}

  if (name.length < 2) fields.name = 'Enter your full name.'
  if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)) fields.email = 'Enter a valid email address.'
  if (phone && !/^[+()\d\s.-]+$/.test(phone)) fields.phone = 'Enter a valid phone number.'
  if (guests < 1 || guests > 30) fields.guests = 'Enter a number of guests between 1 and 30.'
  if (message.length < 5) fields.message = 'Add a little more detail to your message.'

  if (Object.keys(fields).length > 0) return { fields }
  return { value: { name, email, phone, guests, message } }
}

async function hmacHex(secret: string, value: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value))
  return Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

async function checkRateLimit(ip: string, redisUrl: string, redisToken: string, hashSecret: string): Promise<boolean> {
  const ipDigest = await hmacHex(hashSecret, ip)
  const response = await fetch(redisUrl.replace(/\/+$/, ''), {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + redisToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([
      'EVAL',
      RATE_LIMIT_SCRIPT,
      '1',
      'sooru:enquiry:rate:' + ipDigest,
      String(RATE_LIMIT_WINDOW_SECONDS),
    ]),
    signal: AbortSignal.timeout(5000),
  })
  if (!response.ok) throw new Error('Rate limit service failed')
  const result = await response.json() as { result?: unknown; error?: string }
  if (result.error || typeof result.result !== 'number') throw new Error('Rate limit service returned an invalid result')
  return result.result <= RATE_LIMIT_MAX
}

export async function POST(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return json({ ok: false, error: 'METHOD_NOT_ALLOWED' }, 405)
  }

  const origin = request.headers.get('origin')
  if (origin && origin !== new URL(request.url).origin) {
    return json({ ok: false, error: 'INVALID_ORIGIN' }, 403)
  }

  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) {
    return json({ ok: false, error: 'JSON_REQUIRED' }, 415)
  }
  const contentLength = Number(request.headers.get('content-length') ?? 0)
  if (contentLength > MAX_BODY_BYTES) return json({ ok: false, error: 'PAYLOAD_TOO_LARGE' }, 413)

  let payload: EnquiryPayload
  try {
    const rawBody = await request.text()
    if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
      return json({ ok: false, error: 'PAYLOAD_TOO_LARGE' }, 413)
    }
    payload = JSON.parse(rawBody) as EnquiryPayload
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) throw new Error('Invalid payload')
  } catch {
    return json({ ok: false, error: 'INVALID_REQUEST' }, 400)
  }

  if (typeof payload.website === 'string' && payload.website.trim().length > 0) {
    return json({ ok: false, error: 'INVALID_SUBMISSION' }, 400)
  }

  const validation = validatePayload(payload)
  if (!validation.value) {
    return json({ ok: false, error: 'VALIDATION_ERROR', fields: validation.fields }, 422)
  }

  const {
    RESEND_API_KEY,
    ENQUIRY_TO_EMAIL,
    ENQUIRY_FROM_EMAIL,
    UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN,
    RATE_LIMIT_HMAC_SECRET,
  } = process.env

  if (!RESEND_API_KEY || !ENQUIRY_TO_EMAIL || !ENQUIRY_FROM_EMAIL) {
    return json({ ok: false, error: 'EMAIL_NOT_CONFIGURED' }, 503)
  }
  if (!UPSTASH_REDIS_REST_URL || !UPSTASH_REDIS_REST_TOKEN || !RATE_LIMIT_HMAC_SECRET || RATE_LIMIT_HMAC_SECRET.length < 32) {
    return json({ ok: false, error: 'SETUP_REQUIRED' }, 503)
  }

  const ip = request.headers.get('x-real-ip')
    ?? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  if (!ip) return json({ ok: false, error: 'SERVICE_UNAVAILABLE' }, 503)

  try {
    const allowed = await checkRateLimit(ip, UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN, RATE_LIMIT_HMAC_SECRET)
    if (!allowed) return json({ ok: false, error: 'RATE_LIMITED' }, 429)
  } catch {
    return json({ ok: false, error: 'SERVICE_UNAVAILABLE' }, 503)
  }

  const enquiry = validation.value
  const emailResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + RESEND_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: ENQUIRY_FROM_EMAIL,
      to: [ENQUIRY_TO_EMAIL],
      reply_to: enquiry.email,
      subject: 'New enquiry | The Sooru Experience',
      text: [
        'A new enquiry was submitted on The Sooru Experience website.',
        '',
        'Name: ' + enquiry.name,
        'Email: ' + enquiry.email,
        'Phone: ' + (enquiry.phone || 'Not provided'),
        'Number of guests: ' + enquiry.guests,
        '',
        'Message:',
        enquiry.message,
      ].join('\n'),
    }),
    signal: AbortSignal.timeout(10000),
  }).catch(() => null)

  if (!emailResponse?.ok) {
    return json({ ok: false, error: 'EMAIL_DELIVERY_FAILED' }, 502)
  }

  const providerResult = await emailResponse.json().catch(() => null) as { id?: unknown } | null
  if (typeof providerResult?.id !== 'string' || providerResult.id.length === 0) {
    return json({ ok: false, error: 'EMAIL_DELIVERY_FAILED' }, 502)
  }

  return json({ ok: true, delivered: true })
}
