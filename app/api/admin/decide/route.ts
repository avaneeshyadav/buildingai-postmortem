import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { updateRequest } from '@/lib/kv';

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
  const action = String(formData.get('action') ?? '');

  if (!requestId || (action !== 'approve' && action !== 'reject')) {
    return NextResponse.redirect(new URL('/admin', req.url), 303);
  }

  const status = action === 'approve' ? 'approved' : 'rejected';

  try {
    await updateRequest(requestId, { status });
  } catch (err) {
    console.error('Failed to update request status:', err instanceof Error ? err.message : err);
  }

  return NextResponse.redirect(new URL('/admin', req.url), 303);
}
