# Push Pottaa ☠

Push Pottaa sends short Malayalam Therivili messages to Slack when GitHub events happen. Each team runs its own service under its own GitHub, Render, and Slack accounts. The service verifies GitHub signatures and uses event metadata; it does not clone repositories or read source files.

## Set it up for your team

Follow the [step-by-step developer setup guide](DEVELOPER-SETUP.md). It covers creating a Slack Incoming Webhook, deploying this repository as a Render Blueprint, setting private environment values, and connecting the GitHub repositories you want to notify.

The hosted [Push Pottaa service](https://push-pottaa.onrender.com) is the project owner's installation, not a shared bot. Each team needs its own service and Slack webhook. The included Render Blueprint uses the free plan; free services may sleep while idle.

## Local development

Install Node.js 24.21.0 using the [official Node.js archive](https://nodejs.org/en/download/archive/v24.21.0). Run npm install, then npm test. To start the server locally, set GITHUB_WEBHOOK_SECRET and SLACK_WEBHOOK_URL in your terminal before npm start. The .env.example file lists the settings, but Node does not load a .env file automatically. GitHub cannot reach localhost, so use the Render deployment for a real GitHub-to-Slack delivery check.

The /health endpoint reports whether required settings exist, never their values. The landing-page demo uses sample data and does not post to Slack.

## Limits

The Slack integration uses Incoming Webhooks. The privacy and terms pages are drafts. Push Pottaa does not provide shared sign-up, one-click Slack installation, billing, per-user settings, or an opt-out control. The self-hosted setup does not require a paid upgrade.
