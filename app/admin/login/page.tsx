export default async function AdminLogin({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <p className="font-mono text-xs font-bold tracking-[0.12em] uppercase text-[#FF4D4D] mb-6 flex items-center gap-2">
          <span className="w-6 h-px bg-[#FF4D4D]" />
          postmortem admin
        </p>
        <form method="POST" action="/api/admin/login" className="flex flex-col gap-3">
          <input
            type="password"
            name="password"
            placeholder="Admin password"
            autoFocus
            required
            className="bg-[#131929] border border-[#1E2D45] focus:border-[#FF4D4D] outline-none text-sm text-[#E8EDF5] placeholder-[#4A5E7A] px-4 py-3 rounded-lg transition-colors"
          />
          <button
            type="submit"
            className="bg-[#FF4D4D] hover:opacity-90 transition-opacity text-white font-semibold text-sm px-5 py-3 rounded-lg"
          >
            Sign in
          </button>
          {error && (
            <p className="font-mono text-xs text-[#FF4D4D]">// Incorrect password.</p>
          )}
        </form>
      </div>
    </div>
  );
}
