const vscode = require('vscode');
const { pickRoast } = require('./roasts.cjs');
const { classify } = require('./classify.cjs');
const { spawn } = require('node:child_process');

let lastNotification = { kind: '', at: 0 };
let gitApiPromise;

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
  const output = vscode.window.createOutputChannel('Push Pottaa');
  context.subscriptions.push(output);
  output.appendLine('Push Pottaa activated.');

  const notify = (kind, settings = config()) => {
    if (!settings.get('enabled', true)) return;
    const now = Date.now();
    if (lastNotification.kind === kind && now - lastNotification.at < 1500) return;
    lastNotification = { kind, at: now };
    const message = pickRoast(kind);
    const title = 'Push Pottaa · ' + kind.replace('_', ' ').toUpperCase();
    output.appendLine(title + ': notification shown.');
    void vscode.window.showInformationMessage(title + ': ' + message);
    if (settings.get('voice', false)) speak(message);
  };

  const getGitApi = async () => {
    if (!gitApiPromise) {
      const gitExtension = vscode.extensions.getExtension('vscode.git');
      if (!gitExtension) throw new Error('VS Code built-in Git extension is unavailable.');
      gitApiPromise = gitExtension.activate().then(extension => extension.getAPI(1));
    }
    return gitApiPromise;
  };

  const getRepository = async () => {
    const api = await getGitApi();
    const repositories = api.repositories || [];
    const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    const workspaceRepositories = workspacePath
      ? repositories.filter(repository => repository.rootUri.fsPath.startsWith(workspacePath))
      : repositories;
    const available = workspaceRepositories.length ? workspaceRepositories : repositories;
    const repository = available.find(item => item.ui?.selected) || available[0];
    if (!repository) throw new Error('Open a Git repository in this VS Code window first.');
    return repository;
  };

  context.subscriptions.push(vscode.commands.registerCommand('pushPottaa.testNotification', () => {
    output.appendLine('Manual notification test requested.');
    notify('push');
  }));

  context.subscriptions.push(vscode.commands.registerCommand('pushPottaa.push', async () => {
    try {
      const repository = await getRepository();
      await repository.push();
      notify('push');
    } catch (error) {
      output.appendLine('Push failed: ' + (error.message || error));
      notify('failure');
    }
  }));

  context.subscriptions.push(vscode.commands.registerCommand('pushPottaa.pull', async () => {
    try {
      const repository = await getRepository();
      await repository.pull();
      notify('pull');
    } catch (error) {
      output.appendLine('Pull failed: ' + (error.message || error));
      notify('failure');
    }
  }));

  if (typeof vscode.window.onDidEndTerminalShellExecution !== 'function') {
    output.appendLine('This VS Code version does not expose terminal command completion events.');
    return;
  }

  context.subscriptions.push(vscode.window.onDidEndTerminalShellExecution(event => {
    const settings = config();
    if (!settings.get('enabled', true)) return;
    const command = event.execution?.commandLine?.value || '';
    const action = classify(command, settings.get('deployCommands', []));
    output.appendLine('Terminal command completed; detected action: ' + (action || 'none') + '; exit=' + (event.exitCode ?? 'unknown') + '.');
    if (!action || event.exitCode === undefined) return;

    let kind = event.exitCode === 0 ? action : 'failure';
    if (action === 'check') kind = event.exitCode === 0 ? 'success' : 'failure';
    if (event.exitCode === 0 && !settings.get('successEvents', true)) return;
    notify(kind, settings);
  }));
}

function deactivate() {}

module.exports = { activate, deactivate };
