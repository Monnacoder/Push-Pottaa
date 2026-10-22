# Push Pottaa ☠

**കോഡ് പുഷ് ചെയ്തോ? ഇനി കരഞ്ഞോ.** Commit Crimes is a Malayalam-first GitHub roast bot. It accepts signed GitHub webhooks, creates a roast from event metadata, and posts it to Slack.

## Live MVP

- App: https://push-pottaa.onrender.com
- Health: https://push-pottaa.onrender.com/health
- GitHub: Monnacoder/Push-Pottaa
- Slack delivery: MonnaCoder workspace, `#new-channel`
- Connected events: `push` and `pull_request`
- Verified: GitHub push delivery returned HTTP 200 and a Malayalam roast appeared in Slack. The temporary test branch was removed afterward.

The health endpoint reports whether the GitHub signing secret and Slack webhook are configured; it never returns their values. GitHub signatures are verified. The service uses event metadata and does not clone repositories or read source files.

The landing-page demo is sample data and does not contact GitHub.

## Run locally

Requires Node.js 20 or newer. Copy `.env.example` to `.env`, set `GITHUB_WEBHOOK_SECRET` and `SLACK_WEBHOOK_URL`, then run `npm start`. `npm test` runs the automated unit tests. Keep secrets out of Git, screenshots, public docs, and chat.

## Deployment notes

The service is running on Render’s free tier. It may spin down while inactive, so its first request after a quiet period can take 50 seconds or more. The Slack integration uses Incoming Webhooks, a legacy Slack feature that may be deprecated. No paid plan or upgrade was enabled.

The privacy and terms pages are launch drafts. Discord, billing, multi-repository settings, opt-out controls, and general self-serve installation are future work; the current MVP serves one connected repository and one Slack channel.
