# Push Pottaa ☠

Push Pottaa sends short Malayalam tech-humor messages to a Slack channel when GitHub activity happens. Each team runs its own service under its own GitHub, Render, and Slack accounts. The service verifies GitHub's signature and uses event metadata; it does not clone repositories or read source files.

## Set it up for your team

Follow the [step-by-step developer setup guide](DEVELOPER-SETUP.md). You will create a Slack Incoming Webhook, deploy this repository as a Render Blueprint, add private environment settings, and connect the GitHub repositories you want to notify.

The hosted [Push Pottaa service](https://push-pottaa.onrender.com) is the project owner's installation. It is not a shared bot for other teams. Each team needs its own service and Slack webhook. The included Render Blueprint uses the free plan; free services may sleep while idle.

## Local development

Requires Node.js 20 or newer. Run npm install, then npm test for the automated tests. To start the server locally, set GITHUB_WEBHOOK_SECRET and SLACK_WEBHOOK_URL in your terminal environment before running npm start. The .env.example file lists the settings, but Node does not load a .env file automatically. A GitHub webhook cannot reach localhost, so use the Render setup for a real GitHub-to-Slack delivery check.

The /health endpoint reports whether required settings exist, never their values. The landing-page demo uses sample data and does not post to Slack.

## Limits

The Slack integration uses Incoming Webhooks. The privacy and terms pages are drafts. Push Pottaa does not provide shared sign-up, one-click Slack installation, billing, per-user settings, or an opt-out control. No paid upgrade is required for the self-hosted setup.
