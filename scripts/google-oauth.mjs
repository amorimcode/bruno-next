#!/usr/bin/env node
/**
 * Gera o GOOGLE_REFRESH_TOKEN uma única vez e grava direto no .env.local.
 *
 * Uso:
 *   1. Preencha GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET no .env.local
 *   2. node scripts/google-oauth.mjs
 *   3. Aceite o consentimento no browser
 *
 * O token nunca é impresso no terminal, para não sobrar em histórico de shell
 * nem em log de sessão compartilhada.
 */
import { exec } from 'node:child_process';
import { createServer } from 'node:http';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ENV_PATH = resolve(process.cwd(), '.env.local');
const PORT = 4455;
const REDIRECT_URI = `http://localhost:${PORT}/oauth2callback`;
const SCOPE = 'https://www.googleapis.com/auth/calendar.events';

function readEnvFile() {
  try {
    return readFileSync(ENV_PATH, 'utf8');
  } catch {
    return '';
  }
}

function parseEnv(contents) {
  const values = {};
  for (const line of contents.split('\n')) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (match) values[match[1]] = match[2].replace(/^["']|["']$/g, '');
  }
  return values;
}

function upsertEnv(contents, key, value) {
  const line = `${key}=${value}`;
  const pattern = new RegExp(`^\\s*${key}\\s*=.*$`, 'm');
  if (pattern.test(contents)) return contents.replace(pattern, line);
  return `${contents.replace(/\n*$/, '')}\n${line}\n`;
}

const env = { ...parseEnv(readEnvFile()), ...process.env };
const clientId = env.GOOGLE_CLIENT_ID;
const clientSecret = env.GOOGLE_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  console.error(
    'Faltam GOOGLE_CLIENT_ID e/ou GOOGLE_CLIENT_SECRET no .env.local.\n' +
      'Copie o .env.local.example e preencha com a credencial OAuth do Google Cloud Console.'
  );
  process.exit(1);
}

const consentUrl =
  'https://accounts.google.com/o/oauth2/v2/auth?' +
  new URLSearchParams({
    client_id: clientId,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: SCOPE,
    // `offline` + `consent` é o que garante o refresh token voltar na resposta,
    // mesmo que a conta já tenha autorizado o app antes.
    access_type: 'offline',
    prompt: 'consent',
    include_granted_scopes: 'true'
  }).toString();

async function exchange(code) {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code'
    }).toString()
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(`${response.status}: ${JSON.stringify(payload)}`);
  }
  if (!payload.refresh_token) {
    throw new Error(
      'O Google não devolveu refresh_token. Revogue o acesso do app em ' +
        'https://myaccount.google.com/permissions e rode de novo.'
    );
  }
  return payload.refresh_token;
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  if (url.pathname !== '/oauth2callback') {
    res.writeHead(404).end('not found');
    return;
  }

  const error = url.searchParams.get('error');
  const code = url.searchParams.get('code');

  if (error || !code) {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`Consentimento não concluído: ${error ?? 'sem código'}`);
    server.close();
    process.exitCode = 1;
    return;
  }

  try {
    const refreshToken = await exchange(code);
    writeFileSync(
      ENV_PATH,
      upsertEnv(readEnvFile(), 'GOOGLE_REFRESH_TOKEN', refreshToken),
      'utf8'
    );

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(
      '<h1>Pronto.</h1><p>O GOOGLE_REFRESH_TOKEN foi gravado no .env.local. Pode fechar esta aba.</p>'
    );
    console.log('\nGOOGLE_REFRESH_TOKEN gravado em .env.local.');
    console.log(
      'Lembre de publicar o app no Google Cloud Console (status "In production"),\n' +
        'senão o token expira em 7 dias.'
    );
  } catch (thrown) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(String(thrown));
    console.error('\nFalhou:', thrown);
    process.exitCode = 1;
  } finally {
    server.close();
  }
});

server.listen(PORT, () => {
  console.log(`Autorize o acesso à agenda abrindo:\n\n${consentUrl}\n`);
  console.log(
    `Se o navegador não abrir sozinho, cole a URL acima.\nEsperando o callback em ${REDIRECT_URI} ...`
  );

  const opener =
    process.platform === 'darwin'
      ? 'open'
      : process.platform === 'win32'
      ? 'start ""'
      : 'xdg-open';
  exec(`${opener} "${consentUrl}"`, () => {});
});
