import WaitlistForm from './components/WaitlistForm';

const INTEGRATIONS = [
  { name: 'Slack', icon: '💬' },
  { name: 'PagerDuty', icon: '🚨' },
  { name: 'GitHub', icon: '⚙️' },
  { name: 'Jira', icon: '📋', soon: true },
  { name: 'Confluence', icon: '📄', soon: true },
];

const STEPS = [
  {
    num: '01',
    title: 'Connect',
    icon: '🔗',
    body: 'Link your Slack workspace, PagerDuty account, and GitHub repos in minutes. Read-only OAuth — we never write to your systems.',
    detail: 'Setup takes ~15 min',
  },
  {
    num: '02',
    title: 'Automate',
    icon: '⚡',
    body: 'Run /postmortem in any incident channel. The bot pulls the Slack thread, PagerDuty timeline, and GitHub deploys — then drafts the RCA in ~60 seconds.',
    detail: '60 second generation',
  },
  {
    num: '03',
    title: 'Export',
    icon: '📤',
    body: 'Review the structured draft in Slack, edit inline, then export to Confluence, Notion, or markdown. Nothing auto-publishes without your sign-off.',
    detail: 'You approve before publish',
  },
];

const FAQ = [
  {
    q: 'Does the bot read all my Slack messages?',
    a: 'No. It reads only the channel where you run /postmortem, only for the time window you specify (default 6 hours). It never reads DMs or private channels.',
  },
  {
    q: 'Is my incident data stored?',
    a: 'No. Each run is stateless. Slack messages, PagerDuty logs, and GitHub commits are fetched in the moment, passed to the AI, and discarded. Nothing is written to a database.',
  },
  {
    q: 'Do I need a paid Slack plan?',
    a: 'No. The bot works on Slack\'s free plan using channels:history and chat:write scopes — both available on all tiers.',
  },
  {
    q: 'Is PagerDuty or GitHub required?',
    a: 'Both are optional. The bot works from Slack history alone. Add PagerDuty and GitHub later by setting two environment variables — no changes to the Slack app needed.',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F1F5F9] font-sans">

      {/* ── Navigation ── */}
      <nav className="sticky top-0 z-50 border-b border-[#1E293B] bg-[#0F172A]/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
          <span className="font-mono text-base font-bold tracking-tight flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/50" />
            BuildingAI
          </span>
          <div className="flex items-center gap-6">
            <a href="#security" className="text-sm text-[#94A3B8] hover:text-[#F1F5F9] transition-colors hidden sm:block">
              Security
            </a>
            <a
              href="https://github.com/avaneeshyadav/buildingai-postmortem"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#94A3B8] hover:text-[#F1F5F9] transition-colors hidden sm:block"
            >
              Docs
            </a>
            <a
              href="/admin"
              className="text-sm font-medium text-[#F1F5F9] border border-[#334155] hover:border-indigo-500/50 px-4 py-1.5 rounded-lg transition-colors hidden sm:block"
            >
              Sign In
            </a>
            <a
              href="#cta"
              className="bg-indigo-600 hover:bg-indigo-500 transition-colors text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-lg shadow-indigo-500/20"
            >
              Get Early Access
            </a>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 pt-20 pb-20 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono font-semibold px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            AI-Powered · Free Early Access
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-[1.12] tracking-tight mb-6">
            Write incident post-mortems{' '}
            <span className="text-indigo-400">in seconds,</span>{' '}
            not hours.
          </h1>
          <p className="text-[#94A3B8] text-lg leading-relaxed mb-8 max-w-lg">
            Run{' '}
            <code className="font-mono text-sm bg-[#1E293B] text-indigo-300 px-2 py-0.5 rounded border border-[#334155]">
              /postmortem
            </code>{' '}
            in your Slack incident channel. BuildingAI pulls your Slack thread, PagerDuty timeline, and GitHub deploys — then drafts a structured RCA before the retro starts.
          </p>
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <a
              href="#cta"
              className="bg-indigo-600 hover:bg-indigo-500 transition-colors text-white font-semibold px-6 py-3 rounded-lg shadow-lg shadow-indigo-500/25"
            >
              Get My First Draft Free
            </a>
            <a
              href="https://github.com/avaneeshyadav/buildingai-postmortem"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#94A3B8] hover:text-[#F1F5F9] transition-colors text-sm font-medium flex items-center gap-1.5"
            >
              View Docs →
            </a>
          </div>
          <p className="text-xs text-[#475569] font-mono">
            // Used by on-call teams who write post-mortems the same night, not the same sprint.
          </p>
        </div>

        {/* Code editor mockup */}
        <div className="rounded-xl border border-[#1E293B] bg-[#0D1117] overflow-hidden shadow-2xl shadow-black/50 text-sm">
          {/* Editor titlebar */}
          <div className="bg-[#161B22] border-b border-[#1E293B] px-4 py-3 flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
              <span className="w-3 h-3 rounded-full bg-[#28C840]" />
            </div>
            <span className="flex-1 text-center font-mono text-xs text-[#6B7280]">incident-postmortem.md</span>
            <span className="font-mono text-xs text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">AI Draft</span>
          </div>

          {/* Line numbers + code */}
          <div className="flex overflow-auto">
            <div className="select-none px-3 py-4 text-right font-mono text-xs text-[#30363D] leading-6 border-r border-[#1E293B] min-w-[2.5rem]">
              {Array.from({ length: 24 }, (_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            <pre className="px-4 py-4 font-mono text-xs leading-6 overflow-x-auto flex-1">
              <span className="text-[#58A6FF]"># Incident Post-Mortem</span>{'\n'}
              {'\n'}
              <span className="text-[#8B949E]">**Date**</span><span className="text-[#F1F5F9]">: 2024-09-17 03:42 UTC</span>{'\n'}
              <span className="text-[#8B949E]">**Severity**</span><span className="text-[#F1F5F9]">: </span><span className="text-red-400">P1</span><span className="text-[#F1F5F9]">  |  **Duration**: 47 min</span>{'\n'}
              {'\n'}
              <span className="text-[#58A6FF]">## Summary</span>{'\n'}
              <span className="text-[#F1F5F9]">API gateway returned 503s at 03:14 UTC,</span>{'\n'}
              <span className="text-[#F1F5F9]">affecting checkout for ~18 min (94% error rate).</span>{'\n'}
              {'\n'}
              <span className="text-[#58A6FF]">## Timeline</span>{'\n'}
              <span className="text-[#F1F5F9]">- </span><span className="text-[#79C0FF]">03:09</span><span className="text-[#F1F5F9]"> Deploy: api-gateway v2.4.1</span>{'\n'}
              <span className="text-[#F1F5F9]">- </span><span className="text-[#79C0FF]">03:14</span><span className="text-[#F1F5F9]"> PagerDuty P1: checkout 94% error</span>{'\n'}
              <span className="text-[#F1F5F9]">- </span><span className="text-[#79C0FF]">03:32</span><span className="text-[#F1F5F9]"> Rollback complete</span>{'\n'}
              {'\n'}
              <span className="text-[#58A6FF]">## Root Cause Candidates</span>{'\n'}
              <span className="text-indigo-400">[hypothesis]</span><span className="text-[#F1F5F9]"> Rate-limit config in</span>{'\n'}
              <span className="text-[#F1F5F9]">v2.4.1 too aggressive for prod traffic</span>{'\n'}
              {'\n'}
              <span className="text-[#58A6FF]">## Action Items</span>{'\n'}
              <span className="text-[#F1F5F9]">- [ ] Add rollback test to CI pipeline</span>{'\n'}
              <span className="text-[#F1F5F9]">- [ ] Set pool alert threshold at 80%</span>{'\n'}
              {'\n'}
              <span className="text-[#6B7280] italic">*Draft — review before sharing externally.*</span>
            </pre>
          </div>

          <div className="bg-[#161B22] border-t border-[#1E293B] px-4 py-2 flex items-center justify-between">
            <span className="font-mono text-xs text-[#4ADE80]">✓ Generated in 54s from 47 events</span>
            <span className="font-mono text-xs text-[#6B7280]">Slack · PagerDuty · GitHub</span>
          </div>
        </div>
      </section>

      {/* ── Trust Bar ── */}
      <section className="border-y border-[#1E293B] bg-[#0D1117]/60">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-6">
          <p className="text-center text-xs text-[#475569] font-mono mb-5 uppercase tracking-widest">
            Integrates seamlessly with your tech stack
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {INTEGRATIONS.map((int) => (
              <div key={int.name} className="flex items-center gap-2 text-[#64748B] hover:text-[#94A3B8] transition-colors">
                <span className="text-lg grayscale opacity-60">{int.icon}</span>
                <span className="font-semibold text-sm tracking-tight">{int.name}</span>
                {int.soon && (
                  <span className="font-mono text-[9px] uppercase tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded-full leading-none">
                    soon
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Security Banner ── */}
      <section id="security" className="border-b border-[#1E293B]">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-16">
          <div className="bg-gradient-to-r from-indigo-950/60 to-[#0F172A] border border-indigo-500/20 rounded-2xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3">
                  Enterprise-Grade Security
                </p>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
                  Connecting Slack and GitHub is a big ask.{' '}
                  <span className="text-indigo-400">Here is exactly what we do with your data.</span>
                </h2>
                <p className="text-[#94A3B8] text-sm leading-relaxed">
                  We know the first question a security-conscious engineer asks is what happens to their incident data. The answer is simple: nothing persists.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {[
                  {
                    icon: '📭',
                    title: 'Stateless processing',
                    body: 'Data fetched per-run, used to generate the draft, then discarded. Zero writes to any database.',
                  },
                  {
                    icon: '👁️',
                    title: 'Read-only permissions',
                    body: 'OAuth scopes are read-only. The bot can never post, delete, or modify anything without your explicit action.',
                  },
                  {
                    icon: '🔐',
                    title: 'HMAC-verified requests',
                    body: 'Every Slack event is verified against your signing secret. Unverified requests are rejected at the edge.',
                  },
                  {
                    icon: '🏠',
                    title: 'Your infrastructure',
                    body: 'You deploy to your own Vercel account with your own tokens. We never have access to your credentials.',
                  },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3 bg-[#0F172A]/60 border border-[#1E293B] rounded-xl px-4 py-3">
                    <span className="text-lg flex-shrink-0 mt-0.5">{item.icon}</span>
                    <div>
                      <p className="font-semibold text-sm text-[#F1F5F9] mb-0.5">{item.title}</p>
                      <p className="text-xs text-[#64748B] leading-relaxed">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-indigo-500/10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <a
                href="https://github.com/avaneeshyadav/buildingai-postmortem"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors font-medium underline underline-offset-2"
              >
                Audit the full source code on GitHub →
              </a>
              <span className="hidden sm:block text-[#334155]">·</span>
              <span className="font-mono text-xs text-[#475569]">// Open source · No hidden dependencies</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Three-Step Process ── */}
      <section className="border-b border-[#1E293B]">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-16">
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3">How it works</p>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-12">
            Three steps from incident to signed-off RCA.
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map((step, idx) => (
              <div key={step.num} className="relative bg-[#1E293B] border border-[#334155] rounded-2xl p-7 flex flex-col gap-4">
                {idx < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-10 -right-3 w-6 h-px bg-indigo-500/30 z-10" />
                )}
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/15 border border-indigo-500/20 flex items-center justify-center text-xl">
                    {step.icon}
                  </div>
                  <span className="font-mono text-4xl font-bold text-[#1E293B] select-none">{step.num}</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2 text-[#F1F5F9]">{step.title}</h3>
                  <p className="text-sm text-[#94A3B8] leading-relaxed">{step.body}</p>
                </div>
                <div className="mt-auto">
                  <span className="inline-flex items-center gap-1.5 font-mono text-xs text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full">
                    <span className="w-1 h-1 rounded-full bg-indigo-400" />
                    {step.detail}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Data sources */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: '💬', name: 'Slack', desc: 'Channel history + alerts' },
              { icon: '🚨', name: 'PagerDuty', desc: 'Incident log (optional)' },
              { icon: '⚙️', name: 'GitHub', desc: 'Commits & deploys' },
              { icon: '🤖', name: 'AI Draft', desc: 'You review and edit' },
            ].map((s) => (
              <div key={s.name} className="bg-[#1E293B] border border-[#334155] rounded-xl px-4 py-3 flex items-center gap-3">
                <span className="text-xl">{s.icon}</span>
                <div>
                  <p className="font-semibold text-sm text-[#F1F5F9]">{s.name}</p>
                  <p className="text-xs text-[#64748B]">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="border-b border-[#1E293B]">
        <div className="max-w-3xl mx-auto px-6 md:px-12 py-16">
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3">FAQ</p>
          <h2 className="text-2xl font-bold tracking-tight mb-10">Common questions</h2>
          <div className="divide-y divide-[#1E293B]">
            {FAQ.map((item) => (
              <details key={item.q} className="group py-5">
                <summary className="flex cursor-pointer [&::-webkit-details-marker]:hidden list-none items-center justify-between font-semibold text-sm text-[#F1F5F9] gap-4">
                  {item.q}
                  <span className="flex-shrink-0 text-indigo-400 text-xl leading-none transition-transform duration-200 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 pr-8 text-sm leading-relaxed text-[#94A3B8]">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Footer ── */}
      <section id="cta" className="bg-[#0D1117]">
        <div className="max-w-2xl mx-auto px-6 md:px-12 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono font-semibold px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            Free Early Access · Limited Spots
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Automate Your First<br />
            <span className="text-indigo-400">Post-Mortem Today.</span>
          </h2>
          <p className="text-[#94A3B8] text-base mb-10 max-w-lg mx-auto">
            Tell us about your team. We&apos;ll send step-by-step setup instructions and get you generating RCA drafts in under an hour.
          </p>
          <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6 md:p-8 text-left">
            <WaitlistForm />
          </div>
          <p className="mt-6 text-xs text-[#475569] font-mono">
            // No spam · We reply within 24h · Setup takes ~15 minutes
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[#1E293B] px-6 md:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#475569]">
        <div className="flex items-center gap-2 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
          BuildingAI ·{' '}
          <a href="https://buildingai.in" className="text-indigo-400 hover:underline">buildingai.in</a>
        </div>
        <div className="flex items-center gap-5">
          <a href="#security" className="hover:text-[#94A3B8] transition-colors">Security</a>
          <a href="https://github.com/avaneeshyadav/buildingai-postmortem" target="_blank" rel="noopener noreferrer" className="hover:text-[#94A3B8] transition-colors">GitHub</a>
          <a href="#cta" className="hover:text-[#94A3B8] transition-colors">Contact</a>
        </div>
      </footer>
    </div>
  );
}
