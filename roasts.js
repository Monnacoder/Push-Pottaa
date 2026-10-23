export const roasts = {
  push: [
    'എന്ത് തേങ്ങയാ ഇത്, നായിന്റെ മോനേ?',
    'ഇത് commit ചെയ്ത പൂറിമോനാരാ?',
    'Git കുറ്റക്കാരനല്ല, തായോളി.',
    'Fix ആണോ, പുതിയ കുണ്ണപ്പണിയോ?',
    'ഈ diff കണ്ടിട്ട് കണ്ണ് പൊള്ളി, കഴുവേറി.'
  ],
  failure: [
    'CI പൊട്ടി, കഴുവേറി.',
    'Test തോറ്റു, തായോളി.',
    'Build തകർത്ത പൂറിമോനെ, സന്തോഷമായോ?',
    'ഒരു bug പോയി, രണ്ടെണ്ണം വന്നു, കുണ്ണേ.',
    'Fail ആകാൻ ഇത്രേം വേണോ, നായിന്റെ മോനേ?'
  ],
  pull_request: [
    'PR തുറന്ന തായോളി, വിവരണം എവിടെ?',
    'Approve ചെയ്യാൻ കണ്ണടയ്ക്കണോ, പൂറിമോനേ?',
    'Diff മലപോലെ, കഴുവേറി.',
    'ഈ PR നോക്കിയാൽ മതി, കുണ്ണേ.',
    'Review വേണോ, തന്തയില്ലാത്തവനേ?'
  ],
  merged: [
    'Main-ലേക്ക് തള്ളിയ പൂറിമോനേ.',
    'Merge ചെയ്തു, കുഴപ്പം main-ൽ, തായോളി.',
    'Bug main-ൽ; അഭിനന്ദനം, കഴുവേറി.',
    'Rollback നോക്കിക്കോ, കുണ്ണേ.',
    'ടീമിന് പണി കൊടുത്ത തായോളി.'
  ],
  deploy: [
    'Deploy ആയി; പ്രാർത്ഥിക്കെടാ, കഴുവേറി.',
    'Production പൊട്ടി, പൂറിമോനേ.',
    'Metrics green? കണ്ണ് തുറക്ക്, തായോളി.',
    'Logs നോക്കെടാ, കുണ്ണേ.',
    'Rollback ചെയ്യ്, നായിന്റെ മോനേ.'
  ],
  success: [
    'പാസായി, തായോളി. സംശയം.',
    'Green build-ൽ തൊടല്ലേ, പൂറിമോനേ.',
    'ഇന്ന് code ശരി? എന്ത് കുണ്ണപ്പണി?',
    'Tests പാസായി; നീയല്ല, കഴുവേറി.',
    'ശരിയാണെങ്കിൽ സംശയം, തായോളി.'
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
