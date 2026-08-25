# Incident Post-Mortem Generator

A Next.js Slack bot that generates structured incident post-mortem drafts. Run `/postmortem` (optionally with a duration like `/postmortem 6h`) in an incident Slack channel, and the bot collects channel history, PagerDuty incident data, and GitHub commits/deployments, merges them into a chronological timeline, and posts a structured RCA draft back into the channel for human review.

**All services used have free tiers** — Groq (LLM), Slack API, GitHub API, PagerDuty (optional, free plan for ≤5 users), Vercel (hobby tier).

---

## Architecture

```
/postmortem slash command
  → POST /api/slack/command
      → verify Slack signature (HMAC-SHA256)
      → ack immediately (< 3s)
      → async pipeline (waitUntil):
          ├── Slack conversations.history
          ├── PagerDuty /incidents + /log_entries  (optional)
          └── GitHub /commits + /deployments
          → merge + sort timeline
          → Groq llama-3.3-70b-versatile (function calling)
          → post Block Kit draft to response_url
```

---

## Setup

### 1. Slack App

1. Go to [api.slack.com/apps](https://api.slack.com/apps) → **Create New App** → "From scratch"
2. **Slash Command**: `/postmortem` → Request URL: `https://postmortem.buildingai.in/api/slack/command`
   - For local dev: use an ngrok URL (see below) and update this URL temporarily
3. **OAuth & Permissions → Scopes**: add `channels:history`, `chat:write`, `commands`
4. **Install App** to workspace → copy the **Bot User OAuth Token** (`xoxb-…`) → `SLACK_BOT_TOKEN`
5. **Basic Information → Signing Secret** → `SLACK_SIGNING_SECRET`

### 2. Groq API (free)

1. Sign up at [console.groq.com](https://console.groq.com)
2. Create an API key → `GROQ_API_KEY`
3. Free tier: 14,400 requests/day, 6,000 tokens/minute

### 3. GitHub Token (free)

1. [github.com](https://github.com) → Settings → Developer settings → Personal access tokens → Fine-grained
2. Grant **Contents: Read** on the target repo(s)
3. Set `GITHUB_REPOS=org/repo1,org/repo2`

### 4. PagerDuty (optional, free plan for ≤5 users)

1. Sign up at [pagerduty.com](https://www.pagerduty.com) (free plan available)
2. User icon → My Profile → API Access → Create API User Token
3. Set `PAGERDUTY_API_KEY` — if not set, PagerDuty is skipped silently

---

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Copy env template and fill in values
cp .env.example .env.local
# edit .env.local with your real keys

# 3. Start dev server
npm run dev

# 4. Expose locally with ngrok (install from ngrok.com)
ngrok http 3000

# 5. In your Slack app's slash command settings, temporarily set the URL to:
#    https://<your-ngrok-subdomain>.ngrok-free.app/api/slack/command

# 6. Run /postmortem in a Slack channel to test
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `SLACK_BOT_TOKEN` | Yes | Bot User OAuth Token from api.slack.com/apps |
| `SLACK_SIGNING_SECRET` | Yes | From Basic Information in your Slack app settings |
| `GROQ_API_KEY` | Yes | From console.groq.com — free tier available |
| `GITHUB_TOKEN` | Yes | PAT with repo:read scope |
| `GITHUB_REPOS` | Yes | Comma-separated list, e.g. `org/repo1,org/repo2` |
| `PAGERDUTY_API_KEY` | No | Omit to skip PD; free plan at pagerduty.com |

See `.env.example` for a template.

---

## Deployment (Vercel)

1. Push working code to `main` on GitHub
2. [vercel.com](https://vercel.com) → **Add New → Project** → import this repo → Deploy
3. In Vercel project → **Settings → Environment Variables**: add all vars from `.env.example`
4. In **Settings → Domains**: add `postmortem.buildingai.in`
5. Update the Slack slash command URL to `https://postmortem.buildingai.in/api/slack/command`
6. Redeploy after adding/changing env vars (Vercel requires a redeploy to pick them up)

---

## Testing Checklist

- [ ] `/postmortem` returns acknowledgment within 3s, draft within ~60s
- [ ] A forged request (wrong signature) returns `403`
- [ ] No PD API key set → bot proceeds with Slack + GitHub only, no error
- [ ] Invalid GitHub token → bot posts a clear error to Slack, not a silent failure
- [ ] Root cause candidates use "Hypothesis:" / "Candidate:" framing, not declarative statements
- [ ] `npm run build` passes cleanly
