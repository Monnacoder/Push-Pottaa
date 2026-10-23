function classify(command, deployCommands = []) {
  const value = String(command || '').toLowerCase().trim();
  const shellCommands = value.replaceAll('&&', ';').replaceAll('||', ';').split(/[;|]/).map(part => part.trim());
  const startsWith = (part, phrase) => part === phrase || part.startsWith(phrase + ' ');

  if (shellCommands.some(part => startsWith(part, 'git push') || startsWith(part, 'gh repo sync'))) return 'push';
  if (shellCommands.some(part => startsWith(part, 'git pull'))) return 'pull';
  if (shellCommands.some(part => startsWith(part, 'gh pr create'))) return 'pull_request';
  if (shellCommands.some(part => startsWith(part, 'gh pr merge'))) return 'merged';

  const deployCommand = deployCommands.some(phrase => {
    const normalizedPhrase = phrase.trim().toLowerCase();
    if (!normalizedPhrase) return false;
    return shellCommands.some(part => {
      const withoutRunner = part.replace(/^(npx|bunx|sudo) +/, '');
      if (startsWith(withoutRunner, normalizedPhrase)) return true;
      const scriptCommand = part.replace(/^(npm|pnpm|yarn|bun) +(run +)?/, '');
      return scriptCommand !== part && startsWith(scriptCommand, normalizedPhrase);
    });
  });
  if (deployCommand) return 'deploy';

  const packageCheck = shellCommands.some(part => /^(npm|pnpm|yarn|bun) +(test|run +(test|check|lint|build))($| )/.test(part));
  return packageCheck ? 'check' : null;
}

module.exports = { classify };
