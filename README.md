# Push Pottaa ☠

Push Pottaa is a developer-facing GitHub integration that posts Therivili-style Malayalam tech humor to a team’s Slack channel when code is pushed, a pull request opens, or a pull request is merged. Each team deploys a small webhook service under its own accounts.

## Install it for your team

Each team needs access to this source repository, its own Render service, a Slack Incoming Webhook for its channel, and a GitHub webhook secret. The hosted demo at https://push-pottaa.onrender.com is the project owner’s installation; it is not a shared public bot for other teams.

1. Fork this repository into your GitHub account.
2. In Render, create a Blueprint from your fork and apply the included render.yaml.
3. In the new service’s private environment settings, set GITHUB_WEBHOOK_SECRET to a long random value and SLACK_WEBHOOK_URL to your team’s Slack Incoming Webhook URL. Set APP_NAME to Push Pottaa. Never put these values in Git, chat, or screenshots.
4. Wait for deployment, then open your service’s /health URL. It should report ok: true, githubSecretConfigured: true, and slackConfigured: true.
5. In each GitHub repository you want to connect, open Settings → Webhooks → Add webhook. Set the payload URL to https://YOUR-SERVICE.onrender.com/webhooks/github, content type to application/json, and enter the same secret from step 3. Select Pushes and Pull requests.
6. Push a commit or open a pull request. Check GitHub’s webhook delivery for HTTP 200 and look for the Push Pottaa message in the configured Slack channel.

One team deployment can receive events from multiple repositories by adding the same webhook URL and secret in each repository. All messages go to the one Slack channel configured for that deployment. Use a separate deployment and secret for each team.

## Local development

Requires Node.js 20 or newer. Copy .env.example to .env, set GITHUB_WEBHOOK_SECRET and SLACK_WEBHOOK_URL, then run npm start. Run npm test for the automated unit tests. The /health endpoint reveals only whether the secrets are set, never their values.

The service verifies GitHub’s signature and uses event metadata only; it does not clone repositories or read source files. The landing-page demo uses sample data and does not post to Slack.

## Limits

The included Render Blueprint uses the free tier, which can sleep during inactivity. The Slack integration uses Incoming Webhooks, a legacy feature that Slack may deprecate. The privacy and terms pages are drafts. There is no shared sign-up, one-click installation, billing, per-user settings, or opt-out control yet. No paid upgrade is required for the self-hosted setup.
