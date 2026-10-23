# Push Pottaa ☠

Push Pottaa shows short Malayalam Therivili messages where developers work. The VS Code extension detects local Git, pull request, test, build, and deployment commands in the integrated terminal and shows a small editor notification. Optional speech is off by default. No website or Slack setup is needed for those local messages.

## Use it in VS Code

1. Download the push-pottaa-vsix artifact from the latest successful [Build VS Code extension run](https://github.com/Monnacoder/Push-Pottaa/actions/workflows/build-vscode-extension.yml).
2. Extract the downloaded artifact zip. In VS Code, open Extensions → … → Install from VSIX… and choose the .vsix file.
3. Reload VS Code if prompted. Push, pull, deploy, PR, and test/build commands entered in the integrated terminal now trigger editor notifications. Turn on pushPottaa.voice in Settings if you want messages read aloud.

This first version watches VS Code's integrated terminal, plus successful pushes made with VS Code's built-in Source Control view. It does not observe commands run in a separate terminal app or actions clicked on GitHub.com.

## Remote GitHub events

The optional webhook service can deliver remote GitHub workflow outcomes and browser-created pull requests to a team's Slack channel. Each team runs its own service under its own GitHub, Render, and Slack accounts. It verifies GitHub signatures and uses event metadata; it does not clone repositories or read source files. Follow the [remote event setup guide](DEVELOPER-SETUP.md) only if you want those Slack notifications.

The hosted [Push Pottaa service](https://push-pottaa.onrender.com) is the project owner's webhook installation, not a shared bot. Teams using remote Slack delivery need their own service and Slack webhook. The included Render Blueprint uses the free plan; free services may sleep while idle.

## Local development

Install Node.js 24.21.0 using the [official Node.js archive](https://nodejs.org/en/download/archive/v24.21.0). Run npm install, then npm test. To start the server locally, set GITHUB_WEBHOOK_SECRET and SLACK_WEBHOOK_URL in your terminal before npm start. The .env.example file lists the settings, but Node does not load a .env file automatically. GitHub cannot reach localhost, so use the Render deployment for a real GitHub-to-Slack delivery check.

The /health endpoint reports whether required settings exist, never their values. The landing-page demo uses sample data and does not post to Slack.

## Limits

The Slack integration uses Incoming Webhooks. The privacy and terms pages are drafts. The self-hosted setup does not require a paid upgrade. The VS Code extension is distributed as a VSIX build artifact; it has not been published to the VS Code Marketplace.
