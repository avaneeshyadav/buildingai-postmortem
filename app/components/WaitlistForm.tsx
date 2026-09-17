'use client';

import { useState } from 'react';

const INPUT_CLS =
  'bg-[#0F172A] border border-[#334155] focus:border-[#6366F1] outline-none text-sm text-[#F1F5F9] placeholder-[#64748B] px-4 py-3 rounded-lg w-full disabled:opacity-50 transition-colors';

type State = 'idle' | 'loading' | 'success' | 'error';

export default function WaitlistForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [usecase, setUsecase] = useState('');
  const [state, setState] = useState<State>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, usecase }),
      });
      if (res.ok) {
        setState('success');
      } else {
        setState('error');
      }
    } catch {
      setState('error');
    }
  }

  if (state === 'success') {
    return (
      <div className="bg-[#1E293B] border border-[#4ADE80]/30 rounded-xl px-6 py-5 text-center">
        <p className="font-mono text-sm font-bold text-[#4ADE80] mb-1">
          ✓ Request received.
        </p>
        <p className="font-mono text-xs text-[#4ADE80]/70">
          We&apos;ll be in touch at {email} within 24h.
        </p>
      </div>
    );
  }

  const disabled = state === 'loading';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          disabled={disabled}
          className={INPUT_CLS}
        />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="work@company.com"
          disabled={disabled}
          className={INPUT_CLS}
        />
      </div>
      <textarea
        required
        rows={3}
        value={usecase}
        onChange={(e) => setUsecase(e.target.value)}
        placeholder="Tell us about your team — e.g. we run on-call rotations for 10 engineers and lose post-mortems to the backlog every week."
        disabled={disabled}
        className={`${INPUT_CLS} resize-none`}
      />
      <button
        type="submit"
        disabled={disabled}
        className="bg-indigo-600 hover:bg-indigo-500 transition-colors text-white font-semibold text-sm px-5 py-3 rounded-lg w-full disabled:opacity-60 shadow-lg shadow-indigo-500/20"
      >
        {disabled ? 'Sending…' : 'Automate My First Post-Mortem →'}
      </button>
      {state === 'error' ? (
        <p className="font-mono text-xs text-red-400 text-center">
          Something went wrong. Please try again in a moment.
        </p>
      ) : (
        <p className="text-xs text-[#64748B] text-center">
          Free during early access · No credit card · Setup in ~15 minutes
        </p>
      )}
    </form>
  );
}
