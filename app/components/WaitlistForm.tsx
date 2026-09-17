'use client';

import { useState } from 'react';

// Replace with your Formspree form ID from formspree.io (free, 50 submissions/month)
const FORMSPREE_ID = 'mwlpkogk';

type State = 'idle' | 'loading' | 'success' | 'error';

export default function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<State>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState('loading');
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email }),
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
      <span className="font-mono text-xs font-bold text-[#4ADE80] bg-[#052E16] border border-[#14532D] px-4 py-2 rounded-full">
        ✓ You&apos;re on the list. We&apos;ll reach out shortly.
      </span>
    );
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full sm:w-auto">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          disabled={state === 'loading'}
          className="bg-[#131929] border border-[#1E2D45] focus:border-[#FF4D4D] outline-none text-sm text-[#E8EDF5] placeholder-[#4A5E7A] px-4 py-3 rounded-lg w-56 disabled:opacity-50 transition-colors"
        />
        <button
          type="submit"
          disabled={state === 'loading'}
          className="bg-[#FF4D4D] hover:opacity-90 transition-opacity text-white font-semibold text-sm px-5 py-3 rounded-lg whitespace-nowrap disabled:opacity-60"
        >
          {state === 'loading' ? '...' : 'Join Waitlist'}
        </button>
      </form>
      {state === 'error' ? (
        <p className="font-mono text-xs text-[#FF4D4D]">
          // Something went wrong. Email{' '}
          <a href="mailto:hello@buildingai.in" className="underline">
            hello@buildingai.in
          </a>{' '}
          directly.
        </p>
      ) : (
        <>
          <p className="font-mono text-xs text-[#4A5E7A]">
            // No spam · We&apos;ll reach out when your access is ready.
          </p>
          <p className="font-mono text-xs text-[#4A5E7A]">
            // Your email is stored by{' '}
            <a href="https://formspree.io/legal/privacy-policy/" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#7A8CA8]">
              Formspree
            </a>
            {' '}and used only for early-access outreach.
          </p>
        </>
      )}
    </div>
  );
}
