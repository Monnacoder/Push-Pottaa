# Push Pottaa for VS Code

Push Pottaa watches commands completed in VS Code's integrated terminal and shows a small notification inside the editor. It supports git push, git pull, gh pr create, gh pr merge, common deploy commands, and common test/build commands. It never reads project files or sends command text anywhere.

Notifications appear only after a command finishes. A brief toast appears for successful and failed supported actions. Voice is optional and off by default. The notification stays in the editor and does not take focus.

## Install

Download the push-pottaa-vsix artifact zip from the latest successful Build VS Code extension run: https://github.com/Monnacoder/Push-Pottaa/actions/workflows/build-vscode-extension.yml

Extract the zip to get push-pottaa.vsix. In VS Code, open Extensions, select the … menu, choose Install from VSIX…, and select that file. Reload VS Code if prompted. No account, website, Slack workspace, webhook, or paid service is needed for local notifications.

## Settings

- pushPottaa.enabled: show or hide notifications (default true).
- pushPottaa.voice: read messages aloud using the operating system speech service (default false).
- pushPottaa.successEvents: also notify after successful actions (default true).
- pushPottaa.deployCommands: add deploy commands used by your team.

This first version detects commands in VS Code's integrated terminal when shell integration is available. Successful pushes made with VS Code's built-in Source Control view are detected too. It does not observe commands in a separate terminal app or actions clicked in a web browser. Remote GitHub Actions results remain available through the existing optional webhook-to-Slack service.
