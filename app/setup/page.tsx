import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Setup Guide — Incident Post-Mortem Bot',
  description: 'Install the /postmortem Slack bot in 15 minutes. Step-by-step: Slack App, Groq API key, GitHub token, Vercel deploy.',
};

const PREREQS = [
  'Slack workspace where you are an admin',
  'GitHub account with a fine-grained PAT',
  'Vercel account (free Hobby tier)',
  'Groq account for the LLM (free)',
];

const ENV_VARS = [
  { name: 'SLACK_BOT_TOKEN', required: true, desc: 'Bot User OAuth Token from api.slack.com/apps → OAuth & Permissions' },
  { name: 'SLACK_SIGNING_SECRET', required: true, desc: 'From Basic Information in your Slack app settings' },
  { name: 'GROQ_API_KEY', required: true, desc: 'From console.groq.com — free tier: 14,400 requests/day' },
  { name: 'GITHUB_TOKEN', required: true, desc: 'Fine-grained PAT with Contents: Read scope' },
  { name: 'GITHUB_REPOS', required: true, desc: 'Comma-separated list, e.g. org/repo1,org/repo2' },
  { name: 'PAGERDUTY_API_KEY', required: false, desc: 'Omit to skip PD; free plan at pagerduty.com (≤5 responders)' },
];

const STEPS = [
  {
    num: '01',
    title: 'Create the Slack App',
    steps: [
      'Go to api.slack.com/apps → Create New App → "From scratch"',
      'Name it "Postmortem Bot" and select your workspace',
      'Navigate to Slash Commands → Create New Command',
      'Command: /postmortem · Request URL: https://postmortem.buildingai.in/api/slack/command · Short description: Generate post-mortem draft from channel history',
      'Go to OAuth & Permissions → Scopes → Bot Token Scopes → add channels:history, chat:write, commands',
      'Click Install App to Workspace → copy the Bot User OAuth Token → SLACK_BOT_TOKEN',
      'Go to Basic Information → Signing Secret → copy it → SLACK_SIGNING_SECRET',
    ],
    note: 'For local dev: use an ngrok URL in the slash command settings, then update to the production URL after deploying.',
  },
  {
    num: '02',
    title: 'Get a Groq API Key (free)',
    steps: [
      'Sign up at console.groq.com (no credit card)',
      'Dashboard → API Keys → Create API Key',
      'Copy the key → GROQ_API_KEY',
    ],
    note: 'Free tier gives 14,400 requests/day and 6,000 tokens/minute — well within budget for a post-mortem tool.',
  },
  {
    num: '03',
    title: 'Create a GitHub Token',
    steps: [
      'github.com → Settings → Developer settings → Personal access tokens → Fine-grained tokens',
      'Generate new token → Resource owner: your org or user',
      'Repository access → Select repositories → choose your incident-related repos',
      'Permissions → Repository permissions → Contents: Read-only',
      'Generate token → copy it → GITHUB_TOKEN',
      'Set GITHUB_REPOS=owner/repo1,owner/repo2 (comma-separated, no spaces)',
    ],
    note: null,
  },
  {
    num: '04',
    title: 'PagerDuty (optional)',
    steps: [
      'Sign up at pagerduty.com (free plan available for ≤5 responders)',
      'User icon → My Profile → API Access → Create API User Token',
      'Copy the token → PAGERDUTY_API_KEY',
      'If you skip this, the bot runs on Slack + GitHub data only — no errors, no configuration needed.',
    ],
    note: null,
  },
  {
    num: '05',
    title: 'Deploy to Vercel',
    steps: [
      'Fork or clone github.com/avaneeshyadav/buildingai-postmortem',
      'vercel.com → Add New → Project → import the repo → Deploy',
      'Settings → Environment Variables → add all vars from the table below',
      'Settings → Domains → add postmortem.buildingai.in (or your own subdomain)',
      'Trigger a redeployment — Vercel picks up env vars only on redeploy',
      'Update the Slack slash command URL to https://postmortem.buildingai.in/api/slack/command',
    ],
    note: 'Vercel\'s Hobby tier is free and includes the waitUntil async execution this bot relies on.',
  },
];

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="mt-3 bg-[#131929] border border-[#1E2D45] rounded-lg p-4 overflow-x-auto">
      <code className="font-mono text-xs text-[#E8EDF5] leading-relaxed">{children}</code>
    </pre>
  );
}

export default function SetupPage() {
  return (
    <div className="min-h-screen bg-[#0B0F1A] text-[#E8EDF5] font-sans">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-[#1E2D45]">
        <a href="/" className="font-mono text-sm font-bold tracking-tight flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FF4D4D] animate-pulse" />
          postmortem
        </a>
        <div className="flex items-center gap-6">
          <a href="https://buildingai.in/tools" className="text-sm text-[#7A8CA8] hover:text-[#E8EDF5] transition-colors hidden sm:block">
            ← buildingai.in
          </a>
          <a
            href="mailto:hello@buildingai.in?subject=Postmortem Bot - Early Access"
            className="bg-[#FF4D4D] hover:opacity-90 transition-opacity text-white text-sm font-semibold px-4 py-2 rounded-lg"
          >
            Request Access
          </a>
        </div>
      </nav>

      {/* Header */}
      <div className="max-w-4xl mx-auto px-6 md:px-12 pt-16 pb-10">
        <p className="font-mono text-xs font-bold tracking-[0.12em] uppercase text-[#FF4D4D] mb-4 flex items-center gap-2">
          <span className="w-6 h-px bg-[#FF4D4D]" />
          Setup Guide
        </p>
        <h1 className="font-mono text-3xl md:text-4xl font-bold leading-tight tracking-tight mb-4">
          From zero to{' '}
          <code className="text-[#FF4D4D] bg-[#1A2540] px-2 py-1 rounded border border-[#1E2D45] text-2xl md:text-3xl">
            /postmortem
          </code>{' '}
          in 15 minutes.
        </h1>
        <p className="text-[#7A8CA8] text-base leading-relaxed max-w-2xl">
          This guide walks you through creating the Slack app, getting API keys, and deploying to Vercel. All services used have free tiers — no credit card needed to get started.
        </p>
      </div>

      {/* Prerequisites */}
      <section className="border-t border-[#1E2D45]">
        <div className="max-w-4xl mx-auto px-6 md:px-12 py-8">
          <p className="font-mono text-[10px] font-bold tracking-[0.14em] uppercase text-[#FF4D4D] mb-4">Prerequisites</p>
          <div className="flex flex-wrap gap-3">
            {PREREQS.map((p) => (
              <span key={p} className="flex items-center gap-1.5 font-mono text-xs text-[#7A8CA8] bg-[#131929] border border-[#1E2D45] px-3 py-1.5 rounded-full">
                <span className="text-[#4ADE80]">✓</span> {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      {STEPS.map((step) => (
        <section key={step.num} className="border-t border-[#1E2D45]">
          <div className="max-w-4xl mx-auto px-6 md:px-12 py-12">
            <div className="flex items-start gap-6">
              <p className="font-mono text-5xl font-bold text-[#FF4D4D]/15 leading-none flex-shrink-0 hidden sm:block">{step.num}</p>
              <div className="flex-1">
                <h2 className="font-mono text-xl font-bold tracking-tight mb-6">{step.title}</h2>
                <ol className="space-y-3">
                  {step.steps.map((s, i) => (
                    <li key={i} className="flex gap-3 text-sm text-[#7A8CA8] leading-relaxed">
                      <span className="font-mono text-[#FF4D4D] flex-shrink-0 mt-0.5">{i + 1}.</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ol>
                {step.note && (
                  <p className="mt-4 font-mono text-xs text-[#4A5E7A] bg-[#131929] border border-[#1E2D45] rounded-lg px-4 py-3">
                    // {step.note}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Local dev */}
      <section className="border-t border-[#1E2D45]">
        <div className="max-w-4xl mx-auto px-6 md:px-12 py-12">
          <div className="flex items-start gap-6">
            <p className="font-mono text-5xl font-bold text-[#FF4D4D]/15 leading-none flex-shrink-0 hidden sm:block">06</p>
            <div className="flex-1">
              <h2 className="font-mono text-xl font-bold tracking-tight mb-6">Local Development (optional)</h2>
              <CodeBlock>{`# 1. Install dependencies
npm install

# 2. Copy env template and fill in values
cp .env.example .env.local

# 3. Start dev server
npm run dev

# 4. Expose localhost with ngrok (ngrok.com)
ngrok http 3000
# → update your Slack slash command URL to the ngrok HTTPS URL`}</CodeBlock>
            </div>
          </div>
        </div>
      </section>

      {/* Env vars table */}
      <section className="border-t border-[#1E2D45]">
        <div className="max-w-4xl mx-auto px-6 md:px-12 py-12">
          <p className="font-mono text-[10px] font-bold tracking-[0.14em] uppercase text-[#FF4D4D] mb-6">Environment Variables</p>
          <div className="overflow-x-auto rounded-xl border border-[#1E2D45]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#131929] border-b border-[#1E2D45]">
                  <th className="text-left px-4 py-3 font-mono text-xs text-[#7A8CA8] font-medium">Variable</th>
                  <th className="text-left px-4 py-3 font-mono text-xs text-[#7A8CA8] font-medium hidden sm:table-cell">Required</th>
                  <th className="text-left px-4 py-3 font-mono text-xs text-[#7A8CA8] font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2D45]">
                {ENV_VARS.map((v, i) => (
                  <tr key={v.name} className={i % 2 === 1 ? 'bg-[#0F1826]' : 'bg-[#0B0F1A]'}>
                    <td className="px-4 py-3 font-mono text-xs text-[#FF4D4D] whitespace-nowrap">{v.name}</td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={`font-mono text-[10px] font-bold uppercase tracking-wider ${v.required ? 'text-[#E8EDF5]' : 'text-[#4A5E7A]'}`}>
                        {v.required ? 'yes' : 'no'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#7A8CA8] leading-relaxed">{v.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="border-t border-[#1E2D45]">
        <div className="max-w-4xl mx-auto px-6 md:px-12 py-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="font-semibold mb-1">Ready to install?</p>
            <p className="text-sm text-[#7A8CA8]">Request early access and we&apos;ll walk you through setup.</p>
          </div>
          <a
            href="mailto:hello@buildingai.in?subject=Postmortem Bot - Early Access"
            className="bg-[#FF4D4D] hover:opacity-90 transition-opacity text-white font-semibold px-6 py-3 rounded-lg whitespace-nowrap flex-shrink-0"
          >
            Request Early Access →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1E2D45] px-6 md:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#4A5E7A]">
        <p className="font-mono">
          A tool by{' '}
          <a href="https://buildingai.in" className="text-[#FF4D4D] hover:underline">buildingai.in</a>
          {' '}· Next.js + Groq + Slack API
        </p>
        <div className="flex items-center gap-5">
          <a href="/" className="hover:text-[#7A8CA8] transition-colors">Home</a>
          <a href="https://github.com/avaneeshyadav/buildingai-postmortem" target="_blank" rel="noopener noreferrer" className="hover:text-[#7A8CA8] transition-colors">GitHub</a>
          <a href="mailto:hello@buildingai.in" className="hover:text-[#7A8CA8] transition-colors">Contact</a>
        </div>
      </footer>
    </div>
  );
}
