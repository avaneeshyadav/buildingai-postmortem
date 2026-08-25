import type { PdIncident, TimelineEvent } from '../types';

const PD_BASE = 'https://api.pagerduty.com';

async function pdFetch(path: string): Promise<unknown> {
  const key = process.env.PAGERDUTY_API_KEY;
  const res = await fetch(`${PD_BASE}${path}`, {
    headers: {
      Authorization: `Token token=${key}`,
      Accept: 'application/vnd.pagerduty+json;version=2',
    },
  });

  if (!res.ok) {
    throw new Error(`PagerDuty API error ${res.status}: ${await res.text()}`);
  }

  return res.json();
}

export async function fetchPagerDutyIncidents(
  since: Date,
  until: Date
): Promise<{ incidents: PdIncident[]; logEntries: TimelineEvent[] } | null> {
  if (!process.env.PAGERDUTY_API_KEY) {
    return null;
  }

  const params = new URLSearchParams({
    'time_zone': 'UTC',
    'since': since.toISOString(),
    'until': until.toISOString(),
    'limit': '25',
  });

  const data = (await pdFetch(`/incidents?${params}`)) as {
    incidents: Array<{
      id: string;
      title: string;
      urgency: string;
      status: string;
      created_at: string;
      resolved_at: string | null;
    }>;
  };

  const incidents: PdIncident[] = data.incidents.map((i) => ({
    id: i.id,
    title: i.title,
    severity: i.urgency,
    status: i.status,
    createdAt: i.created_at,
    resolvedAt: i.resolved_at,
  }));

  const logEntries: TimelineEvent[] = [];

  for (const incident of incidents) {
    const logData = (await pdFetch(
      `/incidents/${incident.id}/log_entries?time_zone=UTC&limit=100`
    )) as {
      log_entries: Array<{ created_at: string; summary: string }>;
    };

    for (const entry of logData.log_entries) {
      if (!entry.summary) continue;
      logEntries.push({
        timestamp: new Date(entry.created_at),
        source: 'pagerduty',
        content: `[PagerDuty] ${entry.summary}`,
      });
    }
  }

  return { incidents, logEntries };
}
