export type TimelineEvent = {
  timestamp: Date;
  source: 'slack' | 'pagerduty' | 'github';
  content: string;
};

export type PostMortemDraft = {
  summary: string;
  impact: string;
  timeline: string[];
  rootCauseCandidates: string[];
  actionItems: string[];
};

export type PdIncident = {
  id: string;
  title: string;
  severity: string;
  status: string;
  createdAt: string;
  resolvedAt: string | null;
};
