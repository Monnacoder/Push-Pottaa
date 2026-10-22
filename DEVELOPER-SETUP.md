# Push Pottaa — developer setup

Push Pottaa sends short Malayalam tech-humor messages to a Slack channel when GitHub activity happens. Each team runs its own copy under its own GitHub, Render, and Slack accounts. No source code is sent to Push Pottaa; the app uses GitHub event metadata to format a message.

You will need a GitHub account, a Slack workspace where you can add an app or webhook, and a Render account. The included Render setup uses the free plan. Free services can sleep while idle, so the first request after a quiet period may take around 50 seconds.

## 1. Make your own copy

1. Open the [Push Pottaa repository](https://github.com/Monnacoder/Push-Pottaa) and choose **Fork**. Create the fork in the GitHub account or organization that owns the repositories you want to connect.
2. Keep the fork private or public according to your team's needs. The app source contains no secrets; never put secret values in Git.

## 2. Create a Slack webhook for your channel

1. Open Slack's [Incoming Webhooks guide](https://api.slack.com/messaging/webhooks) and create a Slack app for your workspace if you do not already have one.
2. In the app's settings, turn on **Incoming Webhooks**, then choose **Add New Webhook to Workspace**.
3. Select the channel where Push Pottaa should post and authorize the app.
4. Copy the generated URL. Keep it private; anyone who gets it can post to that channel. If Slack does not let you add an app, ask a workspace admin.

## 3. Deploy your copy to Render

1. In Render, choose **New** → **Blueprint** and connect your fork. Render will read the included render.yaml and create the web service.
2. Open the service's **Environment** settings. Add GITHUB_WEBHOOK_SECRET with a strong random value (use your password manager's generator), and add SLACK_WEBHOOK_URL with the URL from step 2. Keep both values private. APP_NAME is already set to Push Pottaa in the Blueprint.
3. Save the settings and wait until Render reports the service is live.
4. Open https://YOUR-SERVICE.onrender.com/health, replacing YOUR-SERVICE with the host Render assigned. Confirm it reports ok: true, githubSecretConfigured: true, and slackConfigured: true. This check shows only whether each setting exists; it never reveals the values.

## 4. Connect a GitHub repository

Repeat these steps for every repository whose events should post to the Slack channel:

1. In that repository, open **Settings** → **Webhooks** → **Add webhook**.
2. For **Payload URL**, enter https://YOUR-SERVICE.onrender.com/webhooks/github using your Render host.
3. Set **Content type** to application/json.
4. In **Secret**, enter exactly the same value you saved as GITHUB_WEBHOOK_SECRET in Render. Do not send it to Push Pottaa or include it in a message, screenshot, or repository file.
5. Choose **Let me select individual events**, then select **Pushes** and **Pull requests**. Leave the hook active and save it.

All connected repositories use the same deployment secret and send messages to that deployment's one configured Slack channel. Use a separate Render service and Slack webhook for each team or channel.

## 5. Verify the connection

If your free Render service may have been idle, first open its /health URL and wait for the health response; this wakes the service before GitHub sends an event. Then make a small test commit and push it to the connected repository, or open a pull request. In GitHub, return to **Settings** → **Webhooks** → your hook → **Recent Deliveries**. The push or pull-request event should receive HTTP **200**, and a Push Pottaa message should appear in the selected Slack channel. Bot-generated events are ignored.

## Troubleshooting

- **HTTP 401:** The GitHub secret and Render's GITHUB_WEBHOOK_SECRET do not match. Enter the same value in both places and save.
- **HTTP 502:** Check that SLACK_WEBHOOK_URL is the complete, current Slack Incoming Webhook URL and that the app is still allowed in the channel.
- **HTTP 202 / ignored:** GitHub sends an automatic ping when a hook is created; Push Pottaa intentionally ignores it, so a 202 for that ping is expected. For a real test, send a Push or Pull request event.
- **No message right away:** A free Render service may be waking from sleep. Open /health first and wait for it to respond before creating the test push or pull request.
- **Redelivery:** GitHub lets you redeliver a failed event from its delivery details after correcting the problem.

Never paste secrets into chat or commit them to Git. If a webhook URL is exposed, regenerate it in Slack; if a GitHub secret is exposed, replace it in both Render and GitHub.

## Local development

Requires Node.js 20 or newer.

1. Clone your fork and open its folder in a terminal.
2. Install dependencies and run the automated tests. These tests do not need Slack or GitHub secrets:

~~~sh
npm install
npm test
~~~

3. To run the server locally, set GITHUB_WEBHOOK_SECRET and SLACK_WEBHOOK_URL in your terminal session before running npm start. The .env.example file lists the variable names, but the app does not load a .env file automatically.

On macOS/Linux (Bash), these prompts keep the values out of your command history:

~~~sh
read -rsp "GitHub webhook secret: " GITHUB_WEBHOOK_SECRET; echo
export GITHUB_WEBHOOK_SECRET
read -rp "Slack webhook URL: " SLACK_WEBHOOK_URL; echo
export SLACK_WEBHOOK_URL
npm start
~~~

On Windows PowerShell:

~~~powershell
$env:GITHUB_WEBHOOK_SECRET = Read-Host "GitHub webhook secret"
$env:SLACK_WEBHOOK_URL = Read-Host "Slack webhook URL"
npm start
~~~

The local app listens at http://localhost:3000; check http://localhost:3000/health. A GitHub webhook cannot reach your computer at localhost. Use the Render deployment for a real GitHub-to-Slack test unless you already know how to configure a secure public tunnel.

The landing-page demo uses sample data and does not post to Slack. The GitHub webhook service verifies GitHub's signature before sending messages.
