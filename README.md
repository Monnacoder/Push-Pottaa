# Push Pottaa ☠

Push Pottaa shows short Malayalam Therivili messages where developers work. The VS Code extension detects supported Git, pull request, test, build, and deployment commands in the integrated terminal. It also adds Push Pottaa Push/Pull actions to the Source Control toolbar. Optional speech is off by default. Local messages need no website or Slack setup.

## Use it in VS Code

1. Download the push-pottaa-vsix artifact from the latest successful [Build VS Code extension run](https://github.com/Monnacoder/Push-Pottaa/actions/workflows/build-vscode-extension.yml).
2. Extract the downloaded artifact zip. In VS Code, open Extensions → … → Install from VSIX… and choose the .vsix file.
3. Reload VS Code if prompted. Use the Command Palette entry **Push Pottaa: Test notification** to confirm the extension is active. In Source Control, use the Push Pottaa cloud-upload and cloud-download toolbar buttons for notifications after Git push and pull. Commands such as git push and git pull in VS Code's integrated terminal are also detected when terminal shell integration is available. Turn on pushPottaa.voice in Settings to hear messages aloud.

Push Pottaa cannot observe commands run in a separate terminal app, VS Code's built-in Git buttons, or actions clicked on GitHub.com. GitHub Actions results that arrive later remain available through the optional webhook-to-Slack service.

## Remote GitHub events

The optional webhook service can deliver remote GitHub workflow outcomes and browser-created pull requests to a team's Slack channel. Each team runs its own service under its own GitHub, Render, and Slack accounts. It verifies GitHub signatures and uses event metadata; it does not clone repositories or read source files. Follow the [remote event setup guide](DEVELOPER-SETUP.md) only if you want those Slack notifications.

The hosted [Push Pottaa service](https://push-pottaa.onrender.com) is the project owner's webhook installation, not a shared bot. Teams using remote Slack delivery need their own service and Slack webhook. The included Render Blueprint uses the free plan; free services may sleep while idle.

## Local development

Install Node.js 24.21.0 using the [official Node.js archive](https://nodejs.org/en/download/archive/v24.21.0). Run npm install, then npm test. To start the server locally, set GITHUB_WEBHOOK_SECRET and SLACK_WEBHOOK_URL in your terminal before npm start. The .env.example file lists the settings, but Node does not load a .env file automatically. GitHub cannot reach localhost, so use the Render deployment for a real GitHub-to-Slack delivery check.

The /health endpoint reports whether required settings exist, never their values. The landing-page demo uses sample data and does not post to Slack.

## Limits

The Slack integration uses Incoming Webhooks. The privacy and terms pages are drafts. The self-hosted setup does not require a paid upgrade. The VS Code extension is distributed as a VSIX build artifact; it has not been published to the VS Code Marketplace.
