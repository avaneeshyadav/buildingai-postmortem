'use client';

import { useState } from 'react';

const INPUT_CLS =
  'bg-[#131929] border border-[#1E2D45] focus:border-[#FF4D4D] outline-none text-sm text-[#E8EDF5] placeholder-[#4A5E7A] px-4 py-3 rounded-lg w-full disabled:opacity-50 transition-colors';

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
      <div className="bg-[#052E16] border border-[#14532D] rounded-xl px-6 py-5 text-center">
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full max-w-md">
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
        placeholder="your@email.com"
        disabled={disabled}
        className={INPUT_CLS}
      />
      <textarea
        required
        rows={4}
        value={usecase}
        onChange={(e) => setUsecase(e.target.value)}
        placeholder="Tell us about your team — e.g. we run on-call rotations for 10 engineers and lose post-mortems to the backlog every week."
        disabled={disabled}
        className={`${INPUT_CLS} resize-none`}
      />
      <button
        type="submit"
        disabled={disabled}
        className="bg-[#FF4D4D] hover:opacity-90 transition-opacity text-white font-semibold text-sm px-5 py-3 rounded-lg w-full disabled:opacity-60"
      >
        {disabled ? 'Sending…' : 'Request Access'}
      </button>
      {state === 'error' ? (
        <p className="font-mono text-xs text-[#FF4D4D]">
          // Something went wrong. Please try again in a moment.
        </p>
      ) : (
        <p className="font-mono text-xs text-[#4A5E7A]">
          // No spam · We&apos;ll reply within 24h with setup instructions.
        </p>
      )}
    </form>
  );
}
