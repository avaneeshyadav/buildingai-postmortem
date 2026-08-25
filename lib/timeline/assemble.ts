import type { TimelineEvent } from '../types';

const DEDUP_WINDOW_MS = 5000;

export function assembleTimeline(
  slackEvents: TimelineEvent[],
  pdEvents: TimelineEvent[],
  ghEvents: TimelineEvent[]
): TimelineEvent[] {
  const merged = [...slackEvents, ...pdEvents, ...ghEvents].sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
  );

  // Remove near-duplicates: same source+content within 5s window
  const seen = new Map<string, number>();
  return merged.filter((event) => {
    const key = `${event.source}:${event.content}`;
    const lastSeen = seen.get(key);
    const ts = event.timestamp.getTime();
    if (lastSeen !== undefined && ts - lastSeen < DEDUP_WINDOW_MS) {
      return false;
    }
    seen.set(key, ts);
    return true;
  });
}
