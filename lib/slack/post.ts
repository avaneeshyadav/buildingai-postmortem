import type { PostMortemDraft } from '../types';

// Slack always issues response_url values under this origin.
// Reject anything else before issuing a fetch — SSRF defence.
const SLACK_RESPONSE_URL_ORIGIN = 'https://hooks.slack.com';

function assertResponseUrlSafe(url: string): void {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error('response_url is not a valid URL');
  }
  if (parsed.origin !== SLACK_RESPONSE_URL_ORIGIN) {
    throw new Error(`response_url origin "${parsed.origin}" is not allowed`);
  }
}

type Block =
  | { type: 'header'; text: { type: 'plain_text'; text: string } }
  | { type: 'section'; text: { type: 'mrkdwn'; text: string } }
  | { type: 'divider' }
  | { type: 'context'; elements: Array<{ type: 'mrkdwn'; text: string }> };

// Strip Slack notification triggers that the LLM might reproduce from channel messages.
// <!here>, <!channel>, <!everyone> would ping all workspace members if left in the draft.
function sanitizeMrkdwn(text: string): string {
  return text.replace(/<!(?:here|channel|everyone)>/gi, '[notification removed]');
}

function header(text: string): Block {
  return { type: 'header', text: { type: 'plain_text', text } };
}

function section(text: string): Block {
  return { type: 'section', text: { type: 'mrkdwn', text: sanitizeMrkdwn(text) } };
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
  assertResponseUrlSafe(responseUrl);
  const res = await fetch(responseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ response_type: 'in_channel', blocks }),
  });

  if (!res.ok) {
    throw new Error(`Failed to post to response_url: HTTP ${res.status}`);
  }
}

export async function postErrorToResponseUrl(responseUrl: string, message: string): Promise<void> {
  assertResponseUrlSafe(responseUrl);
  await fetch(responseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      response_type: 'ephemeral',
      text: `:warning: ${message}`,
    }),
  });
}
