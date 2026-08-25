import { WebClient } from '@slack/web-api';
import type { TimelineEvent } from '../types';

const DISCARDED_SUBTYPES = new Set([
  'channel_join',
  'channel_leave',
  'channel_purpose',
  'channel_topic',
  'channel_name',
  'pinned_item',
  'unpinned_item',
]);

let client: WebClient | null = null;

function getClient(): WebClient {
  if (!client) {
    client = new WebClient(process.env.SLACK_BOT_TOKEN);
  }
  return client;
}

export async function fetchChannelHistory(
  channelId: string,
  windowHours: number
): Promise<TimelineEvent[]> {
  const now = Math.floor(Date.now() / 1000);
  const oldest = String(now - windowHours * 3600);
  const latest = String(now);

  const events: TimelineEvent[] = [];
  let cursor: string | undefined;

  do {
    const response = await getClient().conversations.history({
      channel: channelId,
      oldest,
      latest,
      limit: 200,
      cursor,
    });

    for (const msg of response.messages ?? []) {
      // Skip messages with discarded subtypes; keep undefined (human) and bot_message
      if (msg.subtype && DISCARDED_SUBTYPES.has(msg.subtype)) continue;
      if (!msg.ts || !msg.text) continue;

      events.push({
        timestamp: new Date(parseFloat(msg.ts) * 1000),
        source: 'slack',
        content: msg.text,
      });
    }

    cursor = response.response_metadata?.next_cursor ?? undefined;
  } while (cursor);

  return events.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
}
