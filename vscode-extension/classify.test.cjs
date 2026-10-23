const test = require('node:test');
const assert = require('node:assert/strict');
const { classify } = require('./classify.cjs');

test('detects the supported local developer actions', () => {
  assert.equal(classify('git push origin main'), 'push');
  assert.equal(classify('cd app && git pull --rebase'), 'pull');
  assert.equal(classify('gh pr create --fill'), 'pull_request');
  assert.equal(classify('gh pr merge 41 --squash'), 'merged');
  assert.equal(classify('npm run deploy', ['deploy']), 'deploy');
  assert.equal(classify('pnpm test'), 'check');
  assert.equal(classify('npm run build'), 'check');
  assert.equal(classify('echo deploy', ['deploy']), null);
});

test('custom deployment phrases are supported case-insensitively', () => {
  assert.equal(classify('npx Flyctl deploy', ['flyctl deploy']), 'deploy');
});
