import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { saveRequest } from '@/lib/kv';
import { sendOwnerNotification } from '@/lib/email';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '1 h'),
  prefix: 'ratelimit:contact',
});

export async function POST(req: Request): Promise<NextResponse> {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'anonymous';
  const { success } = await ratelimit.limit(ip);
  if (!success) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const name = String(body.name ?? '').trim().slice(0, 200);
  const email = String(body.email ?? '').trim().slice(0, 200);
  const usecase = String(body.usecase ?? '').trim().slice(0, 2000);

  if (!name || !email || !usecase) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
  }

  const request = {
    id: randomUUID(),
    name,
    email,
    usecase,
    status: 'pending' as const,
    createdAt: new Date().toISOString(),
  };

  try {
    await saveRequest(request);
  } catch (err) {
    console.error('Failed to save access request:', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: 'Failed to save request' }, { status: 500 });
  }

  try {
    await sendOwnerNotification(request);
  } catch (err) {
    // Data saved — don't fail the response if email send fails
    console.error('Owner notification failed:', err instanceof Error ? err.message : err);
  }

  return NextResponse.json({ ok: true });
}
