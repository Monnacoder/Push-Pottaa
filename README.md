# Commit Crimes ☠

**കോഡ് പുഷ് ചെയ്തോ? ഇനി കരഞ്ഞോ.** A Malayalam-first developer roast bot prototype. It can serve a landing page, generate demo roasts, verify GitHub webhook signatures, and forward supported GitHub events to a Slack Incoming Webhook.

## Current status

- [x] Landing page with interactive roast demo
- [x] Malayalam/Manglish roast library for pushes, pull requests, merged PRs, failed/successful builds, and deployment events
- [x] Node.js webhook server with GitHub HMAC signature verification
- [x] Slack message formatting and delivery
- [x] Health endpoint
- [x] Privacy/terms launch-draft pages
- [x] Automated unit tests
- [ ] Live hosting and real URL
- [ ] GitHub repository created under your account
- [ ] Real Slack workspace/webhook configured
- [ ] Real GitHub webhook connected and end-to-end tested
- [ ] Discord integration, billing, user settings and opt-out controls

## Requirements

- Node.js 20 or newer (Node 22 recommended)
- A Slack workspace where you can add an Incoming Webhook
- A publicly reachable HTTPS URL for the running app to receive GitHub webhooks

## Run locally

```bash
cp .env.example .env
# Edit .env and set GITHUB_WEBHOOK_SECRET and SLACK_WEBHOOK_URL
npm test
npm start
```

Open `http://localhost:3000`. The landing-page demo works without secrets. `/health` shows whether secrets are configured, but never returns their values.

The server uses only Node built-ins; no third-party npm runtime dependencies are required. `npm install` is harmless but not necessary for local startup.

## Connect Slack

1. In a Slack workspace you administer, create or enable a Slack app with an Incoming Webhook.
2. Add an Incoming Webhook for the channel where roasts should appear.
3. Copy the webhook URL into `SLACK_WEBHOOK_URL` in the host's private environment-variable settings.
4. Do not put the real URL into Git, screenshots, public docs, or chat messages. If exposed, revoke it and create a new one.

## Connect GitHub

1. Deploy this app to a public HTTPS host first.
2. Create a long random value for `GITHUB_WEBHOOK_SECRET`; set it in the host's environment variables.
3. In the GitHub repository: **Settings → Webhooks → Add webhook**.
4. Payload URL: `https://YOUR-APP-DOMAIN/webhooks/github`
5. Content type: `application/json`.
6. Secret: exactly the same value as `GITHUB_WEBHOOK_SECRET`.
7. Select events: **Pushes**, **Pull requests**, **Workflow runs**, and optionally **Deployment statuses**.
8. Save, then use GitHub's **Recent Deliveries** to inspect response codes. A valid event should return HTTP 200 and post a roast to Slack. Unsupported event types return HTTP 202.

The app validates `X-Hub-Signature-256`, limits request bodies to 1 MB, ignores GitHub bot senders, and only formats selected event metadata. It does not clone repositories or need source code. It currently uses the push/PR/workflow/deployment event data supplied by GitHub.

## Deploy to Render (manual account action required)

A `render.yaml` Blueprint file is included.

1. Create a GitHub repository and upload these project files.
2. Sign in to Render and choose **New → Blueprint**.
3. Select your repository and apply `render.yaml`.
4. In the Render service's environment settings, set `GITHUB_WEBHOOK_SECRET` and `SLACK_WEBHOOK_URL` as secret values.
5. Wait for the service to deploy, then open `/health` and confirm both configuration flags are true.
6. Copy the public HTTPS URL and configure the GitHub webhook as above.

Free hosting plans and provider policies can change; confirm current limits and availability in your hosting account. A sleeping service may delay the first webhook delivery.

## Test

```bash
npm test
```

## Security and launch checklist

- Keep `.env` out of Git; `.gitignore` already excludes it.
- Use a unique long webhook secret. Rotate it if exposed.
- Keep Slack Incoming Webhook URL private.
- Start with a test repository and private Slack channel.
- Tell team members the bot is installed; give teams a clear way to mute it before charging.
- Add rate limits, event deduplication, retries/queueing, monitoring and an opt-out/settings system before broad production use.
- Review `public/privacy.html` and `public/terms.html`; they are explicitly launch drafts, not final legal policies.
- The landing page contains a placeholder `hello@commitcrimes.dev` address. Replace it with a real contact address or remove it before public launch.
- Do not promise perfect anonymity. Hosting providers, GitHub, Slack, payment processors and tax authorities may know the account owner.

## Suggested monetisation validation

Do not add billing before the bot has repeat users. First aim for 10 teams to install the free version, then 5 teams to keep it enabled for two weeks. Interview those teams and test a paid offer for custom roast packs and team configuration. These are validation targets, not guaranteed outcomes.
