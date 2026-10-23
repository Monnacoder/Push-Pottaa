const vscode = require('vscode');
const { pickRoast } = require('./roasts.cjs');
const { classify } = require('./classify.cjs');
const { spawn } = require('node:child_process');

let lastNotification = { kind: '', at: 0 };

function speak(text) {
  if (process.platform === 'darwin') {
    const child = spawn('say', [text], { detached: true, stdio: 'ignore' });
    child.on('error', () => {});
    child.unref();
  } else if (process.platform === 'linux') {
    const child = spawn('spd-say', [text], { detached: true, stdio: 'ignore' });
    child.on('error', () => {});
    child.unref();
  } else if (process.platform === 'win32') {
    const script = 'Add-Type -AssemblyName System.Speech; $s = New-Object System.Speech.Synthesis.SpeechSynthesizer; $s.Speak($env:PUSH_POTTAA_TEXT)';
    const child = spawn('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', script], {
      detached: true, stdio: 'ignore', windowsHide: true,
      env: { ...process.env, PUSH_POTTAA_TEXT: text }
    });
    child.on('error', () => {});
    child.unref();
  }
}

function activate(context) {
  const config = () => vscode.workspace.getConfiguration('pushPottaa');
  const notify = (kind, settings = config()) => {
    if (!settings.get('enabled', true)) return;
    const now = Date.now();
    if (lastNotification.kind === kind && now - lastNotification.at < 1500) return;
    lastNotification = { kind, at: now };
    const message = pickRoast(kind);
    const title = 'Push Pottaa · ' + kind.replace('_', ' ').toUpperCase();
    vscode.window.showInformationMessage(title + ': ' + message);
    if (settings.get('voice', false)) speak(message);
  };

  // Catch pushes made with VS Code's built-in Source Control button.
  const gitExtension = vscode.extensions.getExtension('vscode.git');
  if (gitExtension) {
    gitExtension.activate().then(extension => {
      const gitApi = extension.getAPI(1);
      context.subscriptions.push(gitApi.onDidPublish(() => notify('push')));
    }).catch(() => {});
  }

  context.subscriptions.push(vscode.window.onDidEndTerminalShellExecution(event => {
    const settings = config();
    if (!settings.get('enabled', true)) return;
    const command = event.execution?.commandLine?.value || '';
    const action = classify(command, settings.get('deployCommands', []));
    if (!action || event.exitCode === undefined) return;
    let kind = event.exitCode === 0 ? action : 'failure';
    if (action === 'check') kind = event.exitCode === 0 ? 'success' : 'failure';
    if (event.exitCode === 0 && !settings.get('successEvents', true)) return;
    notify(kind, settings);
  }));
}

function deactivate() {}

module.exports = { activate, deactivate };
