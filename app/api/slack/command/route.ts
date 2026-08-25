import { waitUntil } from '@vercel/functions';
import { verifySlackSignature } from '@/lib/slack/verify';
import { fetchChannelHistory } from '@/lib/slack/history';
import { formatDraftAsBlocks, postToResponseUrl, postErrorToResponseUrl } from '@/lib/slack/post';
import { fetchPagerDutyIncidents } from '@/lib/pagerduty/client';
import { fetchGitHubEvents, GitHubError } from '@/lib/github/client';
import { assembleTimeline } from '@/lib/timeline/assemble';
import { draftPostMortem } from '@/lib/llm/draft';

function parseDurationHours(text: string): number {
  const match = text.trim().match(/^(\d+)h?$/i);
  if (match) {
    const hours = parseInt(match[1], 10);
    if (hours > 0 && hours <= 168) return hours; // cap at 7 days
  }
  return 24; // default
}

function parseBody(raw: string): Record<string, string> {
  return Object.fromEntries(new URLSearchParams(raw));
}

export async function POST(req: Request): Promise<Response> {
  const { valid, body } = await verifySlackSignature(req);

  if (!valid) {
    return new Response('Unauthorized', { status: 403 });
  }

  const params = parseBody(body);
  const channelId = params['channel_id'];
  const responseUrl = params['response_url'];
  const text = params['text'] ?? '';

  if (!channelId || !responseUrl) {
    return new Response('Bad Request', { status: 400 });
  }

  const windowHours = parseDurationHours(text);

  // Acknowledge immediately — Slack requires a response within 3 seconds
  const ackResponse = new Response(
    JSON.stringify({
      text: `Generating post-mortem for the last ${windowHours}h — this may take up to 60 seconds…`,
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );

  waitUntil(runPipeline(channelId, responseUrl, windowHours));

  return ackResponse;
}

async function runPipeline(
  channelId: string,
  responseUrl: string,
  windowHours: number
): Promise<void> {
  try {
    const until = new Date();
    const since = new Date(until.getTime() - windowHours * 3600 * 1000);

    // Fetch all sources in parallel where possible
    const [slackEvents, pdResult, ghEvents] = await Promise.all([
      fetchChannelHistory(channelId, windowHours),
      fetchPagerDutyIncidents(since, until).catch((err) => {
        console.error('PagerDuty fetch failed:', err);
        return null;
      }),
      fetchGitHubEvents(since, until).catch((err) => {
        if (err instanceof GitHubError) {
          // Non-fatal — we'll include a note in the post
          console.error('GitHub fetch failed:', err.message);
          return { error: err.message } as { error: string };
        }
        throw err;
      }),
    ]);

    // Handle PagerDuty disambiguation
    let pdNote = '';
    let pdLogEntries = pdResult?.logEntries ?? [];

    if (pdResult === null) {
      // No PD key configured — silent skip
    } else if (pdResult.incidents.length === 0) {
      pdNote =
        '\n_No PagerDuty incident found in this time window. Proceeding with Slack + GitHub data only._';
    } else if (pdResult.incidents.length > 1) {
      const list = pdResult.incidents
        .map((i) => `• *${i.title}* (ID: ${i.id}, severity: ${i.severity})`)
        .join('\n');
      pdNote = `\n_Multiple PagerDuty incidents matched (${pdResult.incidents.length}). Using all for context. If only one applies, note its ID in the draft before sharing._\n${list}`;
    }

    // Handle GitHub errors
    let ghNote = '';
    const resolvedGhEvents = Array.isArray(ghEvents) ? ghEvents : [];
    if (!Array.isArray(ghEvents) && 'error' in ghEvents) {
      ghNote = `\n_GitHub data unavailable: ${ghEvents.error}_`;
    }

    const timeline = assembleTimeline(slackEvents, pdLogEntries, resolvedGhEvents);

    if (timeline.length === 0) {
      await postErrorToResponseUrl(
        responseUrl,
        `No events found in the last ${windowHours}h. Try a longer time window (e.g. \`/postmortem 48h\`).`
      );
      return;
    }

    const draft = await draftPostMortem(timeline);
    const blocks = formatDraftAsBlocks(draft);

    // Append any data-source notes as a trailing section
    const notes = [pdNote, ghNote].filter(Boolean).join('\n');
    if (notes) {
      blocks.push({
        type: 'context',
        elements: [{ type: 'mrkdwn', text: notes.trim() }],
      } as never);
    }

    await postToResponseUrl(responseUrl, blocks);
  } catch (err) {
    console.error('Post-mortem pipeline failed:', err);
    await postErrorToResponseUrl(
      responseUrl,
      `Failed to generate post-mortem: ${err instanceof Error ? err.message : 'Unknown error'}. Check server logs for details.`
    );
  }
}
