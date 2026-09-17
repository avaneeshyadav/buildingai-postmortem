import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { listRequests, type AccessRequest } from '@/lib/kv';

async function isAuthorized(): Promise<boolean> {
  const session = (await cookies()).get('admin_session')?.value;
  return !!process.env.ADMIN_SECRET && session === process.env.ADMIN_SECRET;
}

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function StatusBadge({ status }: { status: AccessRequest['status'] }) {
  if (status === 'pending') return <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#FEBC2E] bg-[#FEBC2E]/10 px-2 py-0.5 rounded">Pending</span>;
  if (status === 'approved') return <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#4ADE80] bg-[#4ADE80]/10 px-2 py-0.5 rounded">Approved</span>;
  return <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#7A8CA8] bg-[#7A8CA8]/10 px-2 py-0.5 rounded">Rejected</span>;
}

function RequestCard({ req, sentId }: { req: AccessRequest; sentId: string }) {
  const justSent = sentId === req.id;

  return (
    <div className="bg-[#131929] border border-[#1E2D45] rounded-xl p-5 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-sm text-[#E8EDF5]">{req.name}</p>
          <p className="text-xs text-[#7A8CA8]">{req.email}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <StatusBadge status={req.status} />
          <span className="text-xs text-[#4A5E7A]">{timeAgo(req.createdAt)}</span>
        </div>
      </div>

      <p className="text-sm text-[#7A8CA8] leading-relaxed whitespace-pre-wrap border-l-2 border-[#1E2D45] pl-3">
        {req.usecase}
      </p>

      {req.status === 'pending' && (
        <div className="flex flex-wrap gap-2 pt-1">
          <form action="/api/admin/decide" method="POST">
            <input type="hidden" name="requestId" value={req.id} />
            <input type="hidden" name="action" value="approve" />
            <button
              type="submit"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#052E16] text-[#4ADE80] border border-[#14532D] hover:bg-[#14532D] transition-colors"
            >
              ✓ Approve
            </button>
          </form>
          <form action="/api/admin/decide" method="POST">
            <input type="hidden" name="requestId" value={req.id} />
            <input type="hidden" name="action" value="reject" />
            <button
              type="submit"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#1A0A0A] text-[#FF4D4D] border border-[#3D1515] hover:bg-[#3D1515] transition-colors"
            >
              ✗ Reject
            </button>
          </form>
        </div>
      )}

      {req.status === 'approved' && (
        justSent ? (
          <p className="font-mono text-xs text-[#4ADE80]">✓ Welcome email sent to {req.email}</p>
        ) : (
          <form action="/api/admin/send-email" method="POST">
            <input type="hidden" name="requestId" value={req.id} />
            <input type="hidden" name="type" value="welcome" />
            <button
              type="submit"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#052E16] text-[#4ADE80] border border-[#14532D] hover:bg-[#14532D] transition-colors"
            >
              ✉ Send welcome email
            </button>
          </form>
        )
      )}

      {req.status === 'rejected' && (
        justSent ? (
          <p className="font-mono text-xs text-[#7A8CA8]">✓ Rejection email sent to {req.email}</p>
        ) : (
          <form action="/api/admin/send-email" method="POST">
            <input type="hidden" name="requestId" value={req.id} />
            <input type="hidden" name="type" value="rejection" />
            <button
              type="submit"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#131929] text-[#7A8CA8] border border-[#1E2D45] hover:border-[#4A5E7A] transition-colors"
            >
              ✉ Send rejection email
            </button>
          </form>
        )
      )}
    </div>
  );
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ emailSent?: string; emailError?: string }>;
}) {
  if (!(await isAuthorized())) redirect('/admin/login');

  const { emailSent = '', emailError = '' } = await searchParams;

  let requests: AccessRequest[] = [];
  let loadError = '';

  try {
    requests = await listRequests();
  } catch (err) {
    loadError = err instanceof Error ? err.message : 'Failed to load requests';
  }

  const pending = requests.filter((r) => r.status === 'pending');
  const approved = requests.filter((r) => r.status === 'approved');
  const rejected = requests.filter((r) => r.status === 'rejected');

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-[#E8EDF5] font-sans">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-[#1E2D45]">
        <span className="font-mono text-sm font-bold tracking-tight flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FF4D4D]" />
          postmortem <span className="text-[#4A5E7A]">/ admin</span>
        </span>
        <a href="/" className="text-xs text-[#7A8CA8] hover:text-[#E8EDF5] transition-colors">
          ← Back to site
        </a>
      </nav>

      <div className="max-w-3xl mx-auto px-6 md:px-12 py-10 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Pending', count: pending.length, color: '#FEBC2E' },
            { label: 'Approved', count: approved.length, color: '#4ADE80' },
            { label: 'Rejected', count: rejected.length, color: '#7A8CA8' },
          ].map((s) => (
            <div key={s.label} className="bg-[#131929] border border-[#1E2D45] rounded-xl p-4 text-center">
              <p className="font-mono text-2xl font-bold" style={{ color: s.color }}>{s.count}</p>
              <p className="font-mono text-[10px] uppercase tracking-wider text-[#4A5E7A] mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {emailError && (
          <div className="bg-[#1A0A0A] border border-[#3D1515] rounded-xl p-4">
            <p className="font-mono text-xs text-[#FF4D4D]">
              // Email failed:{' '}
              {emailError === 'sendfailed' ? 'Resend returned an error — check RESEND_API_KEY and domain verification.' : emailError}
            </p>
          </div>
        )}

        {loadError && (
          <div className="bg-[#1A0A0A] border border-[#3D1515] rounded-xl p-4">
            <p className="font-mono text-xs text-[#FF4D4D]">// Error: {loadError}</p>
            <p className="font-mono text-xs text-[#7A8CA8] mt-1">// Check that UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are set.</p>
          </div>
        )}

        {/* Pending */}
        {pending.length > 0 && (
          <section>
            <p className="font-mono text-[10px] font-bold tracking-[0.14em] uppercase text-[#FEBC2E] mb-4">
              ● Pending — {pending.length}
            </p>
            <div className="space-y-4">
              {pending.map((r) => <RequestCard key={r.id} req={r} sentId={emailSent} />)}
            </div>
          </section>
        )}

        {/* Approved */}
        {approved.length > 0 && (
          <section>
            <p className="font-mono text-[10px] font-bold tracking-[0.14em] uppercase text-[#4ADE80] mb-4">
              ✓ Approved — {approved.length}
            </p>
            <div className="space-y-4">
              {approved.map((r) => <RequestCard key={r.id} req={r} sentId={emailSent} />)}
            </div>
          </section>
        )}

        {/* Rejected */}
        {rejected.length > 0 && (
          <section>
            <p className="font-mono text-[10px] font-bold tracking-[0.14em] uppercase text-[#7A8CA8] mb-4">
              ✗ Rejected — {rejected.length}
            </p>
            <div className="space-y-4">
              {rejected.map((r) => <RequestCard key={r.id} req={r} sentId={emailSent} />)}
            </div>
          </section>
        )}

        {!loadError && requests.length === 0 && (
          <div className="text-center py-20">
            <p className="font-mono text-sm text-[#4A5E7A]">// No requests yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
