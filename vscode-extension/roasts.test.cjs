const test = require('node:test');
const assert = require('node:assert/strict');
const { roasts } = require('./roasts.cjs');

test('every Therivili category has at least ten lines with an explicit swear word', () => {
  const profanity = /തായോളി|കുണ്ണ|കഴുവേറി|പൂറിമോന|നായിന്റെ മോന|തന്തയില്ലാത്തവന/;
  for (const [kind, lines] of Object.entries(roasts)) {
    assert.ok(lines.length >= 10, kind + ' should have at least ten lines');
    assert.ok(lines.every(line => profanity.test(line)), kind + ' contains a line without a swear word');
  }
});
