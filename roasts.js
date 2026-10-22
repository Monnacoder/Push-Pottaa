export const roasts = {
  push: [
    'എന്ത് തേങ്ങയാടാ ഈ കോഡ്?',
    'മൈര്. ഇതൊക്കെ commit ചെയ്യുമോ?',
    'Git കുറ്റക്കാരനല്ല. നീ തന്നെയാണ്.',
    'ഇത് fix ആണോ, പുതിയ മൈരാണോ?',
    'ഈ കോഡ് കണ്ടിട്ട് bug പോലും പേടിച്ചു.'
  ],
  failure: [
    'Build fail. പ്രതീക്ഷയും.',
    'CI കണ്ടുപിടിച്ചു, നീ മറച്ചുവെച്ച മൈര്.',
    'Test പാസായില്ല. അടുത്തത് നീ നോക്ക്.',
    'ഒരു bug fix ചെയ്തു; രണ്ടെണ്ണം ഫ്രീ.',
    'ഇത് fail അല്ല. code-ന്റെ സ്വഭാവം.'
  ],
  pull_request: [
    'PR അല്ല, കൂട്ടമൈര്.',
    'Description ചെറുത്. Diff കണ്ടിട്ട് തലകറങ്ങി.',
    'Approve? ആദ്യം code തുറന്ന് നോക്ക്.',
    'ഈ PR കണ്ടിട്ട് reviewer offline ആയി.',
    'ചെറിയ മാറ്റമെന്നല്ലേ പറഞ്ഞത്? എന്ത് തേങ്ങ.'
  ],
  merged: [
    'Merge ചെയ്തു. ഇനി എല്ലാവരും അനുഭവിക്ക്.',
    'Bug main-ലെത്തി. സ്വാഗതം.',
    'Rollback-ന് ticket തുറന്നോ?',
    'Production-ന് ആദ്യം പറഞ്ഞേക്ക്.',
    'ഇത് revert ആകുന്നതുവരെ ആഘോഷിക്ക്.'
  ],
  deploy: [
    'Deploy കഴിഞ്ഞു. ഇനി മിണ്ടാതെ നോക്ക്.',
    'Rollback button എവിടെ, മൈര്?',
    'Metrics പച്ച. ആരും വിശ്വസിക്കണ്ട.',
    'Logs തുറക്ക്. പ്രാർത്ഥനയല്ല.',
    'Production-ലേക്ക് പോയി. ഭാഗ്യം.'
  ],
  success: [
    'പാസായി. എന്തോ കുഴപ്പമുണ്ട്.',
    'Green build. തൊടരുത്, മൈര്.',
    'ഇന്ന് code നന്നായി. സംശയകരം.',
    'Tests പാസായി. ഷെയർ ചെയ്യണ്ട.',
    'Compiler മിണ്ടി. അത്ഭുതം തന്നെ.'
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
