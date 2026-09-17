import { Resend } from 'resend';
import type { AccessRequest } from '@/lib/kv';

let client: Resend | null = null;

function getResend(): Resend {
  if (!client) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) throw new Error('RESEND_API_KEY is not configured');
    client = new Resend(apiKey);
  }
  return client;
}

const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL ?? 'buildingai.in@gmail.com';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://postmortem.buildingai.in';

const FROM = 'Postmortem Bot <noreply@buildingai.in>';

export async function sendOwnerNotification(req: {
  id: string;
  name: string;
  email: string;
  usecase: string;
}): Promise<void> {
  await getResend().emails.send({
    from: FROM,
    to: NOTIFY_EMAIL,
    replyTo: req.email,
    subject: `New access request from ${req.name}`,
    html: `
      <div style="font-family:monospace;background:#0B0F1A;color:#E8EDF5;max-width:600px;padding:32px;border-radius:8px">
        <div style="color:#FF4D4D;font-size:11px;font-weight:bold;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:16px">
          New Access Request
        </div>
        <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
          <tr><td style="color:#7A8CA8;padding:4px 0;width:80px">Name</td><td style="color:#E8EDF5">${escHtml(req.name)}</td></tr>
          <tr><td style="color:#7A8CA8;padding:4px 0">Email</td><td><a href="mailto:${escHtml(req.email)}" style="color:#FF4D4D">${escHtml(req.email)}</a></td></tr>
        </table>
        <div style="color:#7A8CA8;font-size:11px;margin-bottom:8px">Use case</div>
        <div style="background:#131929;border:1px solid #1E2D45;border-left:3px solid #FF4D4D;padding:12px 16px;color:#E8EDF5;white-space:pre-wrap;font-size:13px;line-height:1.6">${escHtml(req.usecase)}</div>
        <div style="margin-top:24px">
          <a href="${APP_URL}/admin" style="background:#FF4D4D;color:white;padding:10px 20px;text-decoration:none;border-radius:6px;font-weight:bold;font-size:13px">
            Open Admin Dashboard →
          </a>
        </div>
      </div>
    `,
  });
}

export async function sendWelcomeEmail(req: AccessRequest): Promise<void> {
  await getResend().emails.send({
    from: FROM,
    to: req.email,
    replyTo: NOTIFY_EMAIL,
    subject: "You're approved — here's how to set up the Postmortem Bot",
    html: `
      <div style="font-family:monospace;background:#0B0F1A;color:#E8EDF5;max-width:600px;padding:32px;border-radius:8px">
        <div style="color:#4ADE80;font-size:11px;font-weight:bold;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:16px">
          ✓ Access Approved
        </div>
        <p style="color:#E8EDF5;font-size:14px;line-height:1.6;margin-bottom:20px">
          Hi ${escHtml(req.name)},
        </p>
        <p style="color:#E8EDF5;font-size:14px;line-height:1.6;margin-bottom:20px">
          Great news — you're approved to set up the Postmortem Bot!
        </p>
        <p style="color:#7A8CA8;font-size:13px;line-height:1.6;margin-bottom:24px">
          Follow the setup guide to get your Slack bot running in about 15 minutes. If you hit any issues, just reply to this email — I'm happy to walk you through it.
        </p>
        <a href="${APP_URL}/setup" style="display:inline-block;background:#4ADE80;color:#0B0F1A;padding:10px 20px;text-decoration:none;border-radius:6px;font-weight:bold;font-size:13px;margin-bottom:24px">
          View Setup Guide →
        </a>
        <p style="color:#4A5E7A;font-size:12px;line-height:1.6;margin-top:24px;border-top:1px solid #1E2D45;padding-top:16px">
          — Avaneesh<br/>buildingai.in
        </p>
      </div>
    `,
  });
}

export async function sendRejectionEmail(req: AccessRequest): Promise<void> {
  await getResend().emails.send({
    from: FROM,
    to: req.email,
    replyTo: NOTIFY_EMAIL,
    subject: 'Re: Postmortem Bot access request',
    html: `
      <div style="font-family:monospace;background:#0B0F1A;color:#E8EDF5;max-width:600px;padding:32px;border-radius:8px">
        <div style="color:#7A8CA8;font-size:11px;font-weight:bold;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:16px">
          Access Request
        </div>
        <p style="color:#E8EDF5;font-size:14px;line-height:1.6;margin-bottom:20px">
          Hi ${escHtml(req.name)},
        </p>
        <p style="color:#E8EDF5;font-size:14px;line-height:1.6;margin-bottom:20px">
          Thanks for your interest in the Postmortem Bot. We're not onboarding new users at this time, but I'll keep your details on file and reach out when capacity opens up.
        </p>
        <p style="color:#7A8CA8;font-size:13px;line-height:1.6;margin-bottom:24px">
          Feel free to reply if you have any questions.
        </p>
        <p style="color:#4A5E7A;font-size:12px;line-height:1.6;margin-top:24px;border-top:1px solid #1E2D45;padding-top:16px">
          — Avaneesh<br/>buildingai.in
        </p>
      </div>
    `,
  });
}

function escHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
