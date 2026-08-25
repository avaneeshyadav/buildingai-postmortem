import { fetchGitHubEvents, GitHubError } from '@/lib/github/client';
import { fetchPagerDutyIncidents } from '@/lib/pagerduty/client';
import { assembleTimeline } from '@/lib/timeline/assemble';
import { draftPostMortem } from '@/lib/llm/draft';

// TEST ONLY — remove before production or protect with a secret header
// Usage: POST /api/test/pipeline
// Body:  { "windowHours": 24 }   (optional, defaults to 24)

export async function POST(req: Request): Promise<Response> {
  // Basic guard — require a header so this isn't accidentally hit
  if (req.headers.get('x-test-mode') !== 'true') {
    return new Response('Set header x-test-mode: true to use this endpoint', { status: 403 });
  }

  let windowHours = 24;
  try {
    const body = await req.json();
    if (typeof body.windowHours === 'number') windowHours = body.windowHours;
  } catch {
    // no body / invalid JSON — use default
  }

  const until = new Date();
  const since = new Date(until.getTime() - windowHours * 3600 * 1000);

  const errors: string[] = [];

  // GitHub
  let ghEvents = await fetchGitHubEvents(since, until).catch((err) => {
    if (err instanceof GitHubError) {
      errors.push(`GitHub: ${err.message}`);
      return [];
    }
    throw err;
  });

  // PagerDuty (optional)
  const pdResult = await fetchPagerDutyIncidents(since, until).catch((err) => {
    errors.push(`PagerDuty: ${err instanceof Error ? err.message : String(err)}`);
    return null;
  });

  const timeline = assembleTimeline(
    [], // no Slack in test mode
    pdResult?.logEntries ?? [],
    ghEvents
  );

  if (timeline.length === 0) {
    return Response.json({
      ok: false,
      message: `No events found in the last ${windowHours}h. Check GITHUB_REPOS and GITHUB_TOKEN, or try a longer window.`,
      errors,
      windowHours,
      since: since.toISOString(),
      until: until.toISOString(),
    });
  }

  const draft = await draftPostMortem(timeline);

  return Response.json({
    ok: true,
    windowHours,
    since: since.toISOString(),
    until: until.toISOString(),
    eventCount: timeline.length,
    timeline: timeline.map((e) => ({
      ts: e.timestamp.toISOString(),
      source: e.source,
      content: e.content,
    })),
    draft,
    errors,
  });
}
