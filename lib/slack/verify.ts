import { createHmac, timingSafeEqual } from 'crypto';

const SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET;
const MAX_AGE_SECONDS = 60 * 5;

export async function verifySlackSignature(req: Request): Promise<{ valid: boolean; body: string }> {
  // Fail closed: if the signing secret is not configured, reject all requests
  if (!SLACK_SIGNING_SECRET) {
    console.error('SLACK_SIGNING_SECRET is not configured — rejecting request');
    return { valid: false, body: '' };
  }

  const timestamp = req.headers.get('x-slack-request-timestamp');
  const signature = req.headers.get('x-slack-signature');

  if (!timestamp || !signature) {
    return { valid: false, body: '' };
  }

  // Reject non-integer timestamps before any arithmetic — parseInt('abc') returns
  // NaN and NaN > MAX_AGE_SECONDS is false, silently disabling replay protection.
  const tsNum = Number(timestamp);
  if (!Number.isInteger(tsNum) || tsNum <= 0) {
    return { valid: false, body: '' };
  }

  // Reject requests older than 5 minutes (replay attack protection)
  const requestAge = Math.floor(Date.now() / 1000) - tsNum;
  if (requestAge > MAX_AGE_SECONDS || requestAge < -MAX_AGE_SECONDS) {
    return { valid: false, body: '' };
  }

  const body = await req.text();
  const basestring = `v0:${timestamp}:${body}`;
  const hmac = createHmac('sha256', SLACK_SIGNING_SECRET);
  hmac.update(basestring);
  const computed = `v0=${hmac.digest('hex')}`;

  const computedBuf = Buffer.from(computed, 'utf8');
  const signatureBuf = Buffer.from(signature, 'utf8');

  if (computedBuf.length !== signatureBuf.length) {
    return { valid: false, body };
  }

  const valid = timingSafeEqual(computedBuf, signatureBuf);
  return { valid, body };
}
