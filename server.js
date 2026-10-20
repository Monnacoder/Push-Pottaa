import http from 'node:http';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { classifyEvent, pickRoast } from './roasts.js';

const ROOT = fileURLToPath(new URL('.', import.meta.url));
const PORT = Number(process.env.PORT || 3000);
const APP_NAME = process.env.APP_NAME || 'Commit Crimes';
const GITHUB_SECRET = process.env.GITHUB_WEBHOOK_SECRET || '';
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL || '';
const MAX_BODY_BYTES = 1_000_000;

function json(res, status, data) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
  res.end(JSON.stringify(data));
}

function verifySignature(rawBody, signature) {
  if (!GITHUB_SECRET || !signature || !signature.startsWith('sha256=')) return false;
  const expected = Buffer.from('sha256=' + createHmac('sha256', GITHUB_SECRET).update(rawBody).digest('hex'));
  const actual = Buffer.from(signature);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

async function readBody(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) throw new Error('BODY_TOO_LARGE');
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

async function postToSlack(message) {
  if (!SLACK_WEBHOOK_URL) throw new Error('SLACK_WEBHOOK_URL is not configured');
  if (!SLACK_WEBHOOK_URL.startsWith('https://hooks.slack.com/')) throw new Error('Slack webhook URL must use https://hooks.slack.com/');
  const response = await fetch(SLACK_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ text: message, unfurl_links: false, unfurl_media: false }),
    signal: AbortSignal.timeout(8000)
  });
  if (!response.ok) throw new Error(`Slack returned HTTP ${response.status}`);
}

function safeText(value, max = 180) {
  return String(value ?? '').replace(/[\r\n\t]+/g, ' ').slice(0, max);
}

function formatSlackMessage(kind, payload) {
  const repo = safeText(payload.repository?.full_name || payload.repository?.name || 'unknown repository', 120);
  const sender = safeText(payload.sender?.login || payload.pusher?.name || 'someone', 80);
  const branch = safeText(payload.ref?.replace('refs/heads/', '') || payload.pull_request?.head?.ref || '', 100);
  const url = payload.compare || payload.pull_request?.html_url || payload.workflow_run?.html_url || payload.repository?.html_url;
  const title = safeText(payload.head_commit?.message || payload.pull_request?.title || payload.workflow_run?.name || '', 160);
  const label = kind === 'failure' ? 'BUILD FAILED' : kind === 'success' ? 'BUILD PASSED' : kind === 'merged' ? 'PR MERGED' : kind === 'pull_request' ? 'PULL REQUEST' : kind === 'deploy' ? 'DEPLOYMENT' : 'PUSH DETECTED';
  const lines = [`*${APP_NAME} 💀 · ${label}*`, `*${pickRoast(kind)}*`, `👤 ${sender}  ·  📦 ${repo}${branch ? `  ·  🌿 ${branch}` : ''}`];
  if (title) lines.push(`> ${title.replace(/[<>]/g, '')}`);
  if (url && /^https:\/\//.test(url)) lines.push(`<${url}|കുറ്റകൃത്യം പരിശോധിക്കൂ →>`);
  return lines.join('\n');
}

async function serveStatic(req, res, pathname) {
  const routes = {
    '/': 'public/index.html',
    '/privacy': 'public/privacy.html',
    '/terms': 'public/terms.html',
    '/prototype': 'public/prototype.html'
  };
  const relative = routes[pathname];
  if (!relative) return false;
  try {
    const content = await readFile(join(ROOT, relative));
    const type = extname(relative) === '.html' ? 'text/html; charset=utf-8' : 'application/octet-stream';
    res.writeHead(200, { 'content-type': type, 'x-content-type-options': 'nosniff', 'referrer-policy': 'strict-origin-when-cross-origin' });
    res.end(content);
    return true;
  } catch {
    json(res, 500, { error: 'Unable to load page' });
    return true;
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', 'http://localhost');
  if (req.method === 'GET' && url.pathname === '/health') return json(res, 200, { ok: true, app: APP_NAME, slackConfigured: Boolean(SLACK_WEBHOOK_URL), githubSecretConfigured: Boolean(GITHUB_SECRET) });
  if (req.method === 'GET' && await serveStatic(req, res, url.pathname)) return;

  if (req.method === 'POST' && url.pathname === '/api/demo-roast') {
    let body = {};
    try { body = await readBody(req).then(b => b.length ? JSON.parse(b.toString('utf8')) : {}); }
    catch { return json(res, 400, { error: 'Invalid request body' }); }
    const allowed = ['push', 'failure', 'pull_request', 'merged', 'deploy', 'success'];
    const kind = allowed.includes(body.kind) ? body.kind : 'push';
    return json(res, 200, { kind, roast: pickRoast(kind) });
  }

  if (req.method === 'POST' && url.pathname === '/webhooks/github') {
    let raw;
    try { raw = await readBody(req); }
    catch (error) { return json(res, error.message === 'BODY_TOO_LARGE' ? 413 : 400, { error: 'Request body rejected' }); }
    if (!verifySignature(raw, req.headers['x-hub-signature-256'])) return json(res, 401, { error: 'Invalid webhook signature. Check GITHUB_WEBHOOK_SECRET.' });
    let payload;
    try { payload = JSON.parse(raw.toString('utf8')); }
    catch { return json(res, 400, { error: 'Invalid JSON payload' }); }
    const event = String(req.headers['x-github-event'] || '');
    const kind = classifyEvent(event, payload);
    if (!kind) return json(res, 202, { ok: true, ignored: true, reason: 'Event is not configured for roasting' });
    if (payload.sender?.type === 'Bot') return json(res, 202, { ok: true, ignored: true, reason: 'Bot events are ignored' });
    try {
      await postToSlack(formatSlackMessage(kind, payload));
      return json(res, 200, { ok: true, event, kind, delivered: true });
    } catch (error) {
      console.error('Slack delivery failed:', error.message);
      return json(res, 502, { error: 'Could not deliver roast to Slack. Check SLACK_WEBHOOK_URL and Slack connectivity.' });
    }
  }

  json(res, 404, { error: 'Not found' });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`${APP_NAME} listening on port ${PORT}`);
  if (!GITHUB_SECRET) console.warn('GITHUB_WEBHOOK_SECRET is not configured; GitHub webhooks will be rejected until configured.');
  if (!SLACK_WEBHOOK_URL) console.warn('SLACK_WEBHOOK_URL is not configured; webhook events cannot be delivered to Slack yet.');
});
