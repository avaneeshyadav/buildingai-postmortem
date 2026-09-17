import WaitlistForm from './components/WaitlistForm';

const FAQ = [
  {
    q: 'Does the bot read all my Slack messages?',
    a: 'No. It reads only the channel where you run /postmortem, and only for the time window you specify — default is the last 6 hours. It never reads DMs, private channels you haven\'t connected, or any other workspace data.',
  },
  {
    q: 'Do I need a paid Slack plan?',
    a: 'No. The bot works on Slack\'s free plan. The slash command requires the channels:history and chat:write OAuth scopes, which are available on all Slack plans including free.',
  },
  {
    q: 'Is it really free?',
    a: 'Free during early access. The bot uses Groq\'s free LLM tier (14,400 requests/day), your existing Slack workspace, and a free-tier GitHub token. No credit card. No hidden billing.',
  },
  {
    q: 'How long does setup take?',
    a: 'About 15 minutes: create a Slack app, add two OAuth scopes, paste your Vercel URL into the slash command settings, and add four environment variables. We send step-by-step instructions when you request access.',
  },
  {
    q: 'Is my incident data stored anywhere?',
    a: 'No. Each /postmortem run is stateless. Slack messages and GitHub commits are fetched in the moment, passed to the LLM to build the draft, and then discarded. Nothing is written to a database.',
  },
  {
    q: 'What if we don\'t use PagerDuty or GitHub?',
    a: 'Both are optional. If you skip them, the bot works from Slack history alone. PagerDuty and GitHub can be added later by setting the relevant environment variables — no changes to the Slack app needed.',
  },
];

const USE_CASES = [
  {
    tag: '// 3am incidents',
    title: 'On-call teams',
    body: 'Your engineers are already exhausted from the incident. The last thing they need at 7am is a documentation sprint. /postmortem gets the draft out while the context is still fresh.',
  },
  {
    tag: '// lean teams',
    title: 'Startups without a dedicated SRE',
    body: 'No platform team? No problem. One slash command produces a structured, shareable post-mortem your stakeholders can read in five minutes — no template hunting, no blank page.',
  },
  {
    tag: '// GitHub + PagerDuty',
    title: 'Multi-service architectures',
    body: 'Track commits and deploys across multiple repos in a single merged timeline. See exactly which deploy correlated with the incident — without manually cross-referencing three tools.',
  },
  {
    tag: '// systematic improvement',
    title: 'Engineering managers running retros',
    body: 'Consistent, on-time post-mortems give your retros better data. When every incident is documented, you stop fixing symptoms and start seeing systemic patterns.',
  },
];

const TRUST_SIGNALS = [
  { icon: '✓', label: 'No data stored' },
  { icon: '◇', label: 'Open source' },
  { icon: '✓', label: 'Free to start' },
  { icon: '🔐', label: 'HMAC-verified requests' },
  { icon: '✓', label: 'Runs on your Slack' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0B0F1A] text-[#E8EDF5] font-sans">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-[#1E2D45]">
        <span className="font-mono text-sm font-bold tracking-tight flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FF4D4D] animate-pulse" />
          postmortem
        </span>
        <div className="flex items-center gap-6">
          <a href="https://buildingai.in/tools" className="text-sm text-[#7A8CA8] hover:text-[#E8EDF5] transition-colors hidden sm:block">
            ← buildingai.in
          </a>
          <a href="/setup" className="text-sm text-[#7A8CA8] hover:text-[#E8EDF5] transition-colors hidden md:block">
            Setup guide
          </a>
          <a
            href="#waitlist"
            className="bg-[#FF4D4D] hover:opacity-90 transition-opacity text-white text-sm font-semibold px-4 py-2 rounded-lg"
          >
            Request Access
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 pt-20 pb-16 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <p className="font-mono text-xs font-bold tracking-[0.12em] uppercase text-[#FF4D4D] mb-5 flex items-center gap-2">
            <span className="w-6 h-px bg-[#FF4D4D]" />
            Incident Post-Mortem Generator
          </p>
          <h1 className="font-mono text-4xl md:text-5xl font-bold leading-[1.15] tracking-tight mb-6">
            From incident to<br />
            <span className="text-[#FF4D4D]">written post-mortem</span><br />
            in 60 seconds.
          </h1>
          <p className="text-[#7A8CA8] text-lg leading-relaxed mb-8 max-w-md">
            Run{' '}
            <code className="font-mono text-sm bg-[#1A2540] text-[#FF4D4D] px-2 py-0.5 rounded border border-[#1E2D45]">
              /postmortem
            </code>{' '}
            in your Slack incident channel. We pull the timeline from Slack, PagerDuty, and GitHub — then draft the RCA so your team can focus on the fix, not the paperwork.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#waitlist"
              className="bg-[#FF4D4D] hover:opacity-88 transition-opacity text-white font-semibold px-6 py-3 rounded-lg"
            >
              Request Early Access
            </a>
            <a
              href="https://github.com/avaneeshyadav/buildingai-postmortem"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#7A8CA8] hover:text-[#E8EDF5] transition-colors text-sm font-medium"
            >
              View on GitHub →
            </a>
          </div>
          <p className="mt-5 font-mono text-xs text-[#4A5E7A]">
            // Free to start &nbsp;·&nbsp; No credit card &nbsp;·&nbsp; Runs on your Slack
          </p>
        </div>

        {/* Faux Slack message */}
        <div className="bg-[#1A1D21] border border-[#2D3142] rounded-xl overflow-hidden shadow-2xl text-sm">
          <div className="bg-[#2D2D2D] px-4 py-2.5 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
            <span className="w-3 h-3 rounded-full bg-[#28C840]" />
            <span className="ml-2 font-mono text-xs text-[#7A8CA8]"># incident-aug-25</span>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-md bg-[#FF4D4D] flex items-center justify-center text-white font-bold font-mono text-xs flex-shrink-0">
                PM
              </div>
              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-bold text-[#36C5F0]">Postmortem Bot</span>
                  <span className="text-[9px] font-bold bg-[#36C5F0] text-white px-1.5 py-0.5 rounded tracking-wide">APP</span>
                  <span className="text-xs text-[#4A5E7A]">3:42 AM</span>
                </div>
                <p className="text-[#E8EDF5] mb-2">Draft ready. 47 events across 3 sources.</p>
                <div className="bg-[#0B0F1A] border border-[#1E2D45] border-l-4 border-l-[#FF4D4D] rounded-r-lg p-3 space-y-2.5">
                  <p className="font-bold text-[#E8EDF5]">Incident Post-Mortem Draft</p>
                  <div>
                    <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#FF4D4D] mb-1">Summary</p>
                    <p className="text-xs text-[#7A8CA8] leading-relaxed">API gateway returned 503s at 03:14 UTC, affecting checkout for ~18 min.</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#FF4D4D] mb-1">Timeline</p>
                    <p className="text-xs text-[#7A8CA8]">• 03:09 — Deploy: api-gateway v2.4.1</p>
                    <p className="text-xs text-[#7A8CA8]">• 03:14 — PagerDuty P1: checkout errors 94%</p>
                    <p className="text-xs text-[#7A8CA8]">• 03:32 — Rollback complete, baseline restored</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#FF4D4D] mb-1">Root Cause Candidates</p>
                    <p className="text-xs text-[#7A8CA8]">• Hypothesis: rate-limit config in v2.4.1 too aggressive for prod traffic</p>
                  </div>
                  <p className="text-xs text-[#4A5E7A] italic">Draft — review before sharing externally.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust signals bar */}
      <section className="border-t border-[#1E2D45] bg-[#0D1220]">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-3 flex flex-wrap items-center justify-center md:justify-between gap-x-8 gap-y-2">
          {TRUST_SIGNALS.map((s) => (
            <span key={s.label} className="flex items-center gap-1.5 font-mono text-xs text-[#7A8CA8]">
              <span className="text-[#4ADE80]">{s.icon}</span>
              {s.label}
            </span>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-[#1E2D45]">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-16">
          <p className="font-mono text-[10px] font-bold tracking-[0.14em] uppercase text-[#FF4D4D] mb-3">How it works</p>
          <h2 className="font-mono text-2xl md:text-3xl font-bold tracking-tight mb-10">Three steps. One slash command.</h2>
          <div className="grid md:grid-cols-3 gap-px bg-[#1E2D45] rounded-xl overflow-hidden">
            {[
              { num: '01', title: 'Run the command', body: 'Type /postmortem (or /postmortem 6h) in your incident Slack channel.', code: '/postmortem 6h' },
              { num: '02', title: 'We collect the data', body: 'Slack history, PagerDuty incident log, and GitHub commits & deploys — merged into one timeline.' },
              { num: '03', title: 'Review the draft', body: 'A structured RCA appears in ~60 seconds. You edit and approve — nothing auto-publishes.' },
            ].map((s) => (
              <div key={s.num} className="bg-[#131929] p-8">
                <p className="font-mono text-5xl font-bold text-[#FF4D4D]/15 leading-none mb-4">{s.num}</p>
                <p className="font-semibold text-base mb-2">{s.title}</p>
                <p className="text-sm text-[#7A8CA8] leading-relaxed">{s.body}</p>
                {s.code && (
                  <code className="inline-block mt-3 font-mono text-xs bg-[#1A2540] text-[#FF4D4D] px-2 py-1 rounded border border-[#1E2D45]">
                    {s.code}
                  </code>
                )}
              </div>
            ))}
          </div>

          {/* Sources */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-px bg-[#1E2D45] rounded-xl overflow-hidden">
            {[
              { icon: '💬', name: 'Slack', desc: 'Channel history + alerts' },
              { icon: '🚨', name: 'PagerDuty', desc: 'Incident log (optional)' },
              { icon: '⚙️', name: 'GitHub', desc: 'Commits & deploys' },
              { icon: '🤖', name: 'AI Draft', desc: 'LLM writes, you edit' },
            ].map((s) => (
              <div key={s.name} className="bg-[#131929] px-5 py-4 flex items-center gap-3">
                <span className="text-xl">{s.icon}</span>
                <div>
                  <p className="font-semibold text-sm">{s.name}</p>
                  <p className="text-xs text-[#7A8CA8]">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="border-t border-[#1E2D45]">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-16">
          <p className="font-mono text-[10px] font-bold tracking-[0.14em] uppercase text-[#FF4D4D] mb-3">Use cases</p>
          <h2 className="font-mono text-2xl md:text-3xl font-bold tracking-tight mb-10">Built for teams who move fast and break things.</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {USE_CASES.map((c) => (
              <div key={c.title} className="border-l-2 border-[#FF4D4D]/25 pl-5">
                <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#FF4D4D] mb-1.5">{c.tag}</p>
                <p className="font-semibold text-sm mb-1.5">{c.title}</p>
                <p className="text-sm text-[#7A8CA8] leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-[#1E2D45]">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-16">
          <p className="font-mono text-[10px] font-bold tracking-[0.14em] uppercase text-[#FF4D4D] mb-3">Common questions</p>
          <h2 className="font-mono text-2xl md:text-3xl font-bold tracking-tight mb-8">Everything you need to know before you install.</h2>
          <div className="divide-y divide-[#1E2D45] border-t border-[#1E2D45]">
            {FAQ.map((item) => (
              <details key={item.q} className="group py-5">
                <summary className="flex cursor-pointer [&::-webkit-details-marker]:hidden list-none items-center justify-between font-semibold text-sm text-[#E8EDF5] gap-4">
                  {item.q}
                  <span className="flex-shrink-0 text-[#FF4D4D] text-xl leading-none transition-transform duration-200 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 pr-8 text-sm leading-relaxed text-[#7A8CA8]">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="waitlist" className="border-t border-[#1E2D45]">
        <div className="max-w-lg mx-auto px-6 md:px-12 py-16 flex flex-col items-center text-center gap-8">
          <div>
            <h2 className="font-mono text-2xl md:text-3xl font-bold tracking-tight mb-2">
              Stop losing post-mortems to <span className="text-[#FF4D4D]">the backlog.</span>
            </h2>
            <p className="text-[#7A8CA8] text-sm">Free for small teams. Tell us about your setup and we&apos;ll get you onboarded.</p>
          </div>
          <div className="w-full">
            <WaitlistForm />
          </div>
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
          <a href="/setup" className="hover:text-[#7A8CA8] transition-colors">Setup</a>
          <a href="https://github.com/avaneeshyadav/buildingai-postmortem" target="_blank" rel="noopener noreferrer" className="hover:text-[#7A8CA8] transition-colors">GitHub</a>
          <a href="https://buildingai.in" className="hover:text-[#7A8CA8] transition-colors">buildingai.in</a>
          <a href="#waitlist" className="hover:text-[#7A8CA8] transition-colors">Contact</a>
        </div>
      </footer>
    </div>
  );
}
