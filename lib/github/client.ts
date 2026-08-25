import type { TimelineEvent } from '../types';

export class GitHubError extends Error {
  constructor(
    message: string,
    public readonly repo: string,
    public readonly status: number
  ) {
    super(message);
    this.name = 'GitHubError';
  }
}

async function ghFetch(path: string): Promise<unknown> {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  if (!res.ok) {
    const [owner, repo] = path.split('/repos/')[1]?.split('/') ?? ['', ''];
    throw new GitHubError(
      `GitHub API error ${res.status} on ${owner}/${repo}`,
      `${owner}/${repo}`,
      res.status
    );
  }

  return res.json();
}

async function fetchCommits(repo: string, since: Date, until: Date): Promise<TimelineEvent[]> {
  const params = new URLSearchParams({
    since: since.toISOString(),
    until: until.toISOString(),
    per_page: '100',
  });

  const commits = (await ghFetch(`/repos/${repo}/commits?${params}`)) as Array<{
    sha: string;
    commit: { message: string; author: { date: string } | null };
  }>;

  return commits.map((c) => ({
    timestamp: new Date(c.commit.author?.date ?? since.toISOString()),
    source: 'github' as const,
    content: `[Commit] ${repo}: ${c.commit.message.split('\n')[0]} (${c.sha.slice(0, 7)})`,
  }));
}

async function fetchDeployments(repo: string, since: Date, until: Date): Promise<TimelineEvent[]> {
  const deploys = (await ghFetch(
    `/repos/${repo}/deployments?environment=production&per_page=50`
  )) as Array<{ id: number; ref: string; created_at: string; description: string | null }>;

  return deploys
    .filter((d) => {
      const t = new Date(d.created_at);
      return t >= since && t <= until;
    })
    .map((d) => ({
      timestamp: new Date(d.created_at),
      source: 'github' as const,
      content: `[Deploy] ${repo}: ref=${d.ref}${d.description ? ` — ${d.description}` : ''}`,
    }));
}

export async function fetchGitHubEvents(since: Date, until: Date): Promise<TimelineEvent[]> {
  const reposEnv = process.env.GITHUB_REPOS ?? '';
  const repos = reposEnv
    .split(',')
    .map((r) => r.trim())
    .filter(Boolean);

  const events: TimelineEvent[] = [];

  for (const repo of repos) {
    const [commits, deploys] = await Promise.all([
      fetchCommits(repo, since, until),
      fetchDeployments(repo, since, until),
    ]);
    events.push(...commits, ...deploys);
  }

  return events;
}
