import type { PostMortemDraft } from '../types';

type Block =
  | { type: 'header'; text: { type: 'plain_text'; text: string } }
  | { type: 'section'; text: { type: 'mrkdwn'; text: string } }
  | { type: 'divider' }
  | { type: 'context'; elements: Array<{ type: 'mrkdwn'; text: string }> };

function header(text: string): Block {
  return { type: 'header', text: { type: 'plain_text', text } };
}

function section(text: string): Block {
  return { type: 'section', text: { type: 'mrkdwn', text } };
}

function bullets(items: string[]): Block {
  return section(items.map((i) => `• ${i}`).join('\n'));
}

export function formatDraftAsBlocks(draft: PostMortemDraft): Block[] {
  return [
    header('Incident Post-Mortem Draft'),
    { type: 'divider' },

    header('Summary'),
    section(draft.summary),

    header('Impact'),
    section(draft.impact),

    header('Timeline'),
    bullets(draft.timeline),

    header('Root Cause Candidates'),
    bullets(draft.rootCauseCandidates),

    header('Suggested Action Items'),
    bullets(draft.actionItems),

    { type: 'divider' },
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: '_This is a draft generated from available data — please review and edit before sharing externally._',
        },
      ],
    },
  ];
}

export async function postToResponseUrl(responseUrl: string, blocks: Block[]): Promise<void> {
  const res = await fetch(responseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ response_type: 'in_channel', blocks }),
  });

  if (!res.ok) {
    throw new Error(`Failed to post to response_url: ${res.status} ${await res.text()}`);
  }
}

export async function postErrorToResponseUrl(responseUrl: string, message: string): Promise<void> {
  await fetch(responseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      response_type: 'ephemeral',
      text: `:warning: ${message}`,
    }),
  });
}
