import Groq from 'groq-sdk';
import type { TimelineEvent, PostMortemDraft } from '../types';

const MODEL = process.env.GROQ_MODEL ?? 'qwen/qwen3.6-27b';
const MAX_TIMELINE_EVENTS = 30;

let groq: Groq | null = null;

function getGroq(): Groq {
  if (!groq) {
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groq;
}

const SYSTEM_PROMPT = `You are an SRE writing a post-mortem. Output ONLY a raw JSON object with no markdown, no explanation, no code fences.

Example output format:
{"summary":"Brief 2-3 sentence incident summary.","impact":"Who was affected and for how long.","timeline":["Event 1","Event 2"],"rootCauseCandidates":["Hypothesis: possible cause"],"actionItems":["Fix X","Monitor Y"]}

Rules: rootCauseCandidates must start with "Hypothesis:" or "Candidate:". timeline should be condensed key events only.`;

function formatTimeline(events: TimelineEvent[]): string {
  const trimmed =
    events.length > MAX_TIMELINE_EVENTS
      ? [...events.slice(0, 10), ...events.slice(-(MAX_TIMELINE_EVENTS - 10))]
      : events;

  return trimmed
    .map((e) => `[${e.timestamp.toISOString()}][${e.source.toUpperCase()}] ${e.content.slice(0, 150)}`)
    .join('\n');
}

function extractJson(text: string): string {
  // Strip markdown code fences if present
  const stripped = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
  // Find the outermost { ... } block
  const start = stripped.indexOf('{');
  const end = stripped.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) {
    throw new Error(`No JSON object found in LLM response: ${text.slice(0, 300)}`);
  }
  return stripped.slice(start, end + 1);
}

export async function draftPostMortem(timeline: TimelineEvent[]): Promise<PostMortemDraft> {
  const timelineText = formatTimeline(timeline);

  const response = await getGroq().chat.completions.create({
    model: MODEL,
    max_tokens: 800,
    temperature: 0.1,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: `Timeline:\n${timelineText}\n\nOutput the JSON post-mortem now.`,
      },
    ],
  });

  const raw = response.choices[0]?.message?.content ?? '';
  if (!raw.trim()) {
    throw new Error('LLM returned an empty response');
  }

  const jsonStr = extractJson(raw);
  const draft = JSON.parse(jsonStr) as PostMortemDraft;

  if (!draft.summary || !draft.impact || !Array.isArray(draft.timeline)) {
    throw new Error(`LLM response missing required fields. Raw: ${raw.slice(0, 300)}`);
  }

  return draft;
}
