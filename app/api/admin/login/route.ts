import { NextResponse } from 'next/server';

export async function POST(req: Request): Promise<NextResponse> {
  const formData = await req.formData();
  const password = String(formData.get('password') ?? '');
  const secret = process.env.ADMIN_SECRET;

  if (!secret || password !== secret) {
    return NextResponse.redirect(new URL('/admin/login?error=1', req.url), 303);
  }

  const res = NextResponse.redirect(new URL('/admin', req.url), 303);
  res.cookies.set('admin_session', secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
  return res;
}
