import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyEvent, pickRoast, roasts } from './roasts.js';

test('every roast category has at least one line', () => {
  for (const [kind, lines] of Object.entries(roasts)) {
    assert.ok(lines.length > 0, `${kind} should not be empty`);
    assert.ok(lines.every(line => typeof line === 'string' && line.length > 0));
  }
});

test('pickRoast is deterministic when a random function is supplied', () => {
  assert.equal(pickRoast('push', () => 0), roasts.push[0]);
  assert.equal(pickRoast('failure', () => 0.999999), roasts.failure.at(-1));
});

test('unknown roast category safely falls back to push', () => {
  assert.equal(pickRoast('unknown', () => 0), roasts.push[0]);
});

test('classifies supported GitHub events', () => {
  assert.equal(classifyEvent('push', {}), 'push');
  assert.equal(classifyEvent('pull_request', { action: 'opened' }), 'pull_request');
  assert.equal(classifyEvent('pull_request', { action: 'closed', pull_request: { merged: true } }), 'merged');
  assert.equal(classifyEvent('workflow_run', { workflow_run: { conclusion: 'failure' } }), 'failure');
  assert.equal(classifyEvent('workflow_run', { workflow_run: { conclusion: 'success' } }), 'success');
  assert.equal(classifyEvent('issues', {}), null);
});
