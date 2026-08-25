import Groq from 'groq-sdk';
import type { TimelineEvent, PostMortemDraft } from '../types';

const MODEL = 'llama-3.3-70b-versatile';

let groq: Groq | null = null;

function getGroq(): Groq {
  if (!groq) {
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groq;
}

const SYSTEM_PROMPT = `You are an expert site reliability engineer writing incident post-mortems.
Given a chronological timeline of events from Slack messages, PagerDuty log entries, and GitHub commits/deployments, produce a structured post-mortem draft.

Rules:
- Only use information present in the provided timeline. Do not invent facts.
- For "rootCauseCandidates": every item MUST be framed as a hypothesis or candidate. Use phrases like "Hypothesis:", "Possible cause:", "Candidate:". Never state a root cause as confirmed fact unless the timeline directly and unambiguously confirms it.
- For "timeline": condense to key turning points only — do not include every Slack message verbatim.
- For "impact": describe who or what was affected and for how long.
- For "actionItems": make items specific and actionable.
- If the data is insufficient to draw a conclusion, say so explicitly rather than guessing.`;

const TOOL_DEFINITION: Groq.Chat.ChatCompletionTool = {
  type: 'function',
  function: {
    name: 'create_postmortem',
    description: 'Create a structured incident post-mortem draft from timeline data',
    parameters: {
      type: 'object',
      properties: {
        summary: {
          type: 'string',
          description: '2-3 sentence summary of the incident',
        },
        impact: {
          type: 'string',
          description: 'Who and what was affected, and for how long',
        },
        timeline: {
          type: 'array',
          items: { type: 'string' },
          description: 'Key events in chronological order (condensed, not every message)',
        },
        rootCauseCandidates: {
          type: 'array',
          items: { type: 'string' },
          description: 'Root cause hypotheses/candidates — must be framed as hypotheses, not confirmed facts',
        },
        actionItems: {
          type: 'array',
          items: { type: 'string' },
          description: 'Specific, actionable follow-up items',
        },
      },
      required: ['summary', 'impact', 'timeline', 'rootCauseCandidates', 'actionItems'],
    },
  },
};

function formatTimeline(events: TimelineEvent[]): string {
  return events
    .map((e) => {
      const ts = e.timestamp.toISOString();
      return `[${ts}] [${e.source.toUpperCase()}] ${e.content}`;
    })
    .join('\n');
}

export async function draftPostMortem(timeline: TimelineEvent[]): Promise<PostMortemDraft> {
  const timelineText = formatTimeline(timeline);

  const response = await getGroq().chat.completions.create({
    model: MODEL,
    tools: [TOOL_DEFINITION],
    tool_choice: { type: 'function', function: { name: 'create_postmortem' } },
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: `Here is the incident timeline:\n\n${timelineText}\n\nGenerate a structured post-mortem draft.`,
      },
    ],
  });

  const toolCall = response.choices[0]?.message?.tool_calls?.[0];
  if (!toolCall || toolCall.type !== 'function') {
    throw new Error('LLM did not return a structured tool call response');
  }

  const draft = JSON.parse(toolCall.function.arguments) as PostMortemDraft;
  return draft;
}
