# Push Pottaa for VS Code

Push Pottaa shows short Malayalam Therivili messages in VS Code after developer actions. It watches supported commands in VS Code's integrated terminal and adds Push and Pull actions to the Source Control toolbar so those clicks also trigger notifications. It does not read project files or send command text anywhere.

Notifications appear automatically after supported actions; users do not need to click to reveal them. A short system alert sound is enabled by default. Spoken messages remain optional and off by default.

## Install and verify

Download push-pottaa.vsix from the **Artifacts** section of the latest successful [Build VS Code extension run](https://github.com/Monnacoder/Push-Pottaa/actions/workflows/build-vscode-extension.yml). In VS Code, open Extensions, select the … menu, choose **Install from VSIX…**, and select the downloaded file. Reload VS Code if prompted.

Open the Command Palette and run **Push Pottaa: Test notification**. A Push Pottaa message should appear in the lower-right notification area along with a brief alert sound. To test Git actions, open the Source Control view and use the Push Pottaa cloud-upload or cloud-download buttons. Commands such as git push and git pull in VS Code's integrated terminal are also detected when terminal shell integration is available.

## Settings

- pushPottaa.enabled: show or hide notifications (default true).
- pushPottaa.sound: play a brief alert sound with each notification (default true).
- pushPottaa.soundStyle: choose Pop, Glass, Hero, Ping, Tink, or Message. Open VS Code Settings, search for “Push Pottaa: Sound Style,” choose a sound, then run **Push Pottaa: Test notification** to hear it. Each choice uses an alert built into the user's operating system; the exact Apple iPhone text tone is not bundled.
- pushPottaa.voice: read messages aloud with the operating system voice (default false).
- pushPottaa.successEvents: show messages after successful actions (default true).
- pushPottaa.deployCommands: add the deploy commands used by your team.

Push Pottaa cannot observe commands run in a separate terminal app or actions clicked on GitHub.com. GitHub Actions results that arrive later remain available through the optional webhook-to-Slack service.
