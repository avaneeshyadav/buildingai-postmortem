import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getRequest } from '@/lib/kv';
import { sendWelcomeEmail, sendRejectionEmail } from '@/lib/email';

async function isAuthorized(): Promise<boolean> {
  const session = (await cookies()).get('admin_session')?.value;
  return !!process.env.ADMIN_SECRET && session === process.env.ADMIN_SECRET;
}

export async function POST(req: Request): Promise<NextResponse> {
  if (!(await isAuthorized())) {
    return NextResponse.redirect(new URL('/admin/login', req.url), 303);
  }

  const formData = await req.formData();
  const requestId = String(formData.get('requestId') ?? '');
  const type = String(formData.get('type') ?? '');

  if (!requestId || (type !== 'welcome' && type !== 'rejection')) {
    return NextResponse.redirect(new URL('/admin?emailError=invalid', req.url), 303);
  }

  const accessReq = await getRequest(requestId);
  if (!accessReq) {
    return NextResponse.redirect(new URL('/admin?emailError=notfound', req.url), 303);
  }

  try {
    if (type === 'welcome') {
      await sendWelcomeEmail(accessReq);
    } else {
      await sendRejectionEmail(accessReq);
    }
    return NextResponse.redirect(new URL(`/admin?emailSent=${requestId}`, req.url), 303);
  } catch (err) {
    console.error('Failed to send email:', err instanceof Error ? err.message : err);
    return NextResponse.redirect(new URL('/admin?emailError=sendfailed', req.url), 303);
  }
}
