import crypto from 'crypto';

export const SESSION_COOKIE = 'admin_session';
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function getSecret(): string {
  const s = process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD;
  if (!s) throw new Error('SESSION_SECRET or ADMIN_PASSWORD env var is not set');
  return s;
}

export function signSession(): string {
  const payload = Buffer.from(JSON.stringify({ ts: Date.now() })).toString('base64url');
  const sig = crypto.createHmac('sha256', getSecret()).update(payload).digest('hex');
  return `${payload}.${sig}`;
}

export function verifySession(value: string): boolean {
  try {
    const dotIdx = value.lastIndexOf('.');
    if (dotIdx === -1) return false;
    const payload = value.slice(0, dotIdx);
    const sig = value.slice(dotIdx + 1);
    const expected = crypto.createHmac('sha256', getSecret()).update(payload).digest('hex');
    if (sig.length !== expected.length) return false;
    if (!crypto.timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expected, 'hex'))) return false;
    const { ts } = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return Date.now() - ts < SESSION_MAX_AGE_MS;
  } catch {
    return false;
  }
}
