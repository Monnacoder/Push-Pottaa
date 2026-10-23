# Integration design

Push Pottaa keeps its Therivili catalog in the root roasts.js file. Platform packages receive a generated copy of that catalog and implement two platform-specific pieces: detecting an action and showing the resulting notification.

## Current adapter

- vscode-extension/classify.cjs detects completed terminal actions.
- vscode-extension/extension.js maps those actions to VS Code's nonblocking notification and optional operating-system speech APIs.
- scripts/generate-vscode-roasts.js produces the catalog bundle from roasts.js.
- .github/workflows/build-vscode-extension.yml checks the extension and creates the installable VSIX artifact.

The extension does not read project files or send command text to Push Pottaa. It classifies commands locally and keeps only the action and exit status for the notification.

## Adding another platform

A future Chrome extension or editor integration can reuse the same catalog and event kinds: push, pull, failure, pull_request, merged, deploy, and success. Its small adapter can listen to events available in that platform and display them through its native notification API. VS Code remains responsible for local Git and terminal actions, which a browser extension cannot see. Remote GitHub events can be connected separately through a signed event feed.

This keeps one Therivili list and separate platform adapters. Publishing to the VS Code Marketplace or Chrome Web Store will require registering the publisher/developer account and completing that store's review. The project currently builds a VSIX for direct installation and does not claim store publication.
