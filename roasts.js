export const roasts = {
  push: [
    'എന്ത് തേങ്ങയാ ഇത്?',
    'മൈര്, ഇതും commit ചെയ്തോ?',
    'Git കുറ്റക്കാരനല്ല. നീയാണ്.',
    'Fix ആണോ, പുതിയ മൈരാണോ?',
    'കോഡ് കണ്ടിട്ട് കണ്ണ് പൊള്ളി.'
  ],
  failure: [
    'Build പൊട്ടി. മൈര്.',
    'CI പിടിച്ചു. നീ കുടുങ്ങി.',
    'Test തോറ്റു. നീയും.',
    'ഒരു bug പോയി. രണ്ടെണ്ണം വന്നു.',
    'Fail ആകാൻ ഇതിലും വേണോ?'
  ],
  pull_request: [
    'PR തുറന്നു. ബുദ്ധി അടച്ചു.',
    'വിവരണം ഇല്ല. ധൈര്യം മാത്രം.',
    'Approve വേണോ? കണ്ണടച്ച്.',
    'Diff വലുത്. ക്ഷമ ചെറുത്.',
    'ഇത് PR ആണോ, പണി ആണോ?'
  ],
  merged: [
    'Merge ചെയ്തു. കുഴപ്പം main-ൽ.',
    'Bug main-ൽ. അഭിനന്ദനങ്ങൾ.',
    'Rollback അറിയാമല്ലോ?',
    'ടീമിന് ഇനി പണി.',
    'Revert ചെയ്യുന്നതിന് മുമ്പ് ചിരിച്ചോ.'
  ],
  deploy: [
    'Deploy ആയി. ഇനി നോക്കിക്കോ.',
    'Production പോയി. മൈര്.',
    'Metrics green. കള്ളം.',
    'Logs തുറക്കെടാ.',
    'Rollback button ഉണ്ടല്ലോ?'
  ],
  success: [
    'പാസായി. സംശയം.',
    'Green build. തൊടല്ലേ.',
    'ഇന്ന് code ശരി. എന്തോ ഉണ്ട്.',
    'Tests പാസായി. നീയല്ല.',
    'ശരിയാണെങ്കിൽ പ്രശ്നമുണ്ട്.'
  ]
};

export function pickRoast(kind = 'push', random = Math.random) {
  const pool = roasts[kind] ?? roasts.push;
  return pool[Math.floor(random() * pool.length)];
}

export function classifyEvent(eventName, payload = {}) {
  if (eventName === 'push') return 'push';
  if (eventName === 'pull_request') {
    if (payload.action === 'closed' && payload.pull_request?.merged) return 'merged';
    return 'pull_request';
  }
  if (eventName === 'workflow_run') {
    if (payload.workflow_run?.conclusion === 'failure') return 'failure';
    if (payload.workflow_run?.conclusion === 'success') return 'success';
  }
  if (eventName === 'deployment_status' && payload.deployment_status?.state === 'success') return 'deploy';
  return null;
}
