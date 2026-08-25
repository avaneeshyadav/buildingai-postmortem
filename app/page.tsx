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
          <a
            href="mailto:hello@buildingai.in?subject=Postmortem Bot - Early Access"
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
            Run{" "}
            <code className="font-mono text-sm bg-[#1A2540] text-[#FF4D4D] px-2 py-0.5 rounded border border-[#1E2D45]">
              /postmortem
            </code>{" "}
            in your Slack incident channel. We pull the timeline from Slack, PagerDuty, and GitHub — then draft the RCA so your team can focus on the fix, not the paperwork.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="mailto:hello@buildingai.in?subject=Postmortem Bot - Early Access"
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

      {/* How it works */}
      <section className="border-t border-[#1E2D45]">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-16">
          <p className="font-mono text-[10px] font-bold tracking-[0.14em] uppercase text-[#FF4D4D] mb-3">How it works</p>
          <h2 className="font-mono text-2xl md:text-3xl font-bold tracking-tight mb-10">Three steps. One slash command.</h2>
          <div className="grid md:grid-cols-3 gap-px bg-[#1E2D45] rounded-xl overflow-hidden">
            {[
              { num: "01", title: "Run the command", body: "Type /postmortem (or /postmortem 6h) in your incident Slack channel.", code: "/postmortem 6h" },
              { num: "02", title: "We collect the data", body: "Slack history, PagerDuty incident log, and GitHub commits & deploys — merged into one timeline." },
              { num: "03", title: "Review the draft", body: "A structured RCA appears in ~60 seconds. You edit and approve — nothing auto-publishes." },
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
              { icon: "💬", name: "Slack", desc: "Channel history + alerts" },
              { icon: "🚨", name: "PagerDuty", desc: "Incident log (optional)" },
              { icon: "⚙️", name: "GitHub", desc: "Commits & deploys" },
              { icon: "🤖", name: "AI Draft", desc: "LLM writes, you edit" },
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

      {/* CTA */}
      <section className="border-t border-[#1E2D45]">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h2 className="font-mono text-2xl md:text-3xl font-bold tracking-tight mb-2">
              Stop losing post-mortems to <span className="text-[#FF4D4D]">the backlog.</span>
            </h2>
            <p className="text-[#7A8CA8] text-sm">Free for small teams. Runs on your existing Slack workspace.</p>
          </div>
          <div className="flex flex-col items-start gap-3 flex-shrink-0">
            <a
              href="mailto:hello@buildingai.in?subject=Postmortem Bot - Early Access"
              className="bg-[#FF4D4D] hover:opacity-90 transition-opacity text-white font-semibold px-6 py-3 rounded-lg whitespace-nowrap"
            >
              Request Early Access
            </a>
            <span className="font-mono text-xs font-bold text-[#4ADE80] bg-[#052E16] border border-[#14532D] px-3 py-1 rounded-full">
              ✓ Free for small teams
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1E2D45] px-6 md:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#4A5E7A]">
        <p className="font-mono">
          A tool by{" "}
          <a href="https://buildingai.in" className="text-[#FF4D4D] hover:underline">buildingai.in</a>
          {" "}· Next.js + Groq + Slack API
        </p>
        <div className="flex items-center gap-5">
          <a href="https://github.com/avaneeshyadav/buildingai-postmortem" target="_blank" rel="noopener noreferrer" className="hover:text-[#7A8CA8] transition-colors">GitHub</a>
          <a href="https://buildingai.in" className="hover:text-[#7A8CA8] transition-colors">buildingai.in</a>
          <a href="mailto:hello@buildingai.in" className="hover:text-[#7A8CA8] transition-colors">Contact</a>
        </div>
      </footer>
    </div>
  );
}
