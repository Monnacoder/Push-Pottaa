function classify(command, deployCommands = []) {
  const value = String(command || '').toLowerCase().replace(/\\/g, '/').trim();
  if (/(^|[;&|]\\s*)git\\s+push\\b/.test(value) || /(^|[;&|]\\s*)gh\\s+repo\\s+sync\\b/.test(value)) return 'push';
  if (/(^|[;&|]\\s*)git\\s+pull\\b/.test(value)) return 'pull';
  if (/(^|[;&|]\\s*)gh\\s+pr\\s+create\\b/.test(value)) return 'pull_request';
  if (/(^|[;&|]\\s*)gh\\s+pr\\s+merge\\b/.test(value)) return 'merged';
  const shellCommands = value.split(/&&|\\|\\||[;|]/).map(part => part.trim());
  const deployCommand = deployCommands.some(phrase => {
    const normalizedPhrase = phrase.trim().toLowerCase();
    if (!normalizedPhrase) return false;
    return shellCommands.some(part => {
      const withoutRunner = part.replace(/^(?:npx|bunx|sudo)\\s+/, '');
      if (withoutRunner === normalizedPhrase || withoutRunner.startsWith(normalizedPhrase + ' ')) return true;
      if (/^(npm|pnpm|yarn|bun)\\s+(?:run\\s+)?/.test(part)) {
        const scriptCommand = part.replace(/^(npm|pnpm|yarn|bun)\\s+(?:run\\s+)?/, '');
        return scriptCommand === normalizedPhrase || scriptCommand.startsWith(normalizedPhrase + ' ');
      }
      return false;
    });
  });
  if (deployCommand) return 'deploy';
  if (/(^|[;&|]\\s*)(npm|pnpm|yarn|bun)\\s+(test|run\\s+(test|check|lint|build))\\b/.test(value)) return 'check';
  return null;
}

module.exports = { classify };
