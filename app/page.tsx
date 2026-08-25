export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-8">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-semibold text-gray-900">Incident Post-Mortem Bot</h1>
        <p className="mt-3 text-gray-600">
          This app runs as a Slack bot. Use the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-sm">/postmortem</code>{' '}
          slash command in your incident channel to generate a post-mortem draft.
        </p>
        <p className="mt-4 text-sm text-gray-400">
          Optionally pass a time window:{' '}
          <code className="font-mono">/postmortem 6h</code> (default: 24h)
        </p>
      </div>
    </main>
  );
}
