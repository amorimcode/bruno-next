/**
 * Cliente mínimo da Google Calendar API. São só três chamadas HTTP, então não
 * vale carregar o pacote `googleapis` inteiro num portfólio: menos peso no
 * bundle e cold start mais curto.
 *
 * Roda exclusivamente em rota de API. As credenciais nunca chegam ao browser.
 */
import { BUSY_CALENDAR_IDS, CALENDAR_ID, TIMEZONE } from './config';

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const CALENDAR_API = 'https://www.googleapis.com/calendar/v3';

export type Interval = { start: string; end: string };

type CachedToken = { token: string; expiresAt: number };

/**
 * Cache em escopo de módulo: enquanto a instância serverless estiver quente,
 * o access token é reaproveitado em vez de renegociado a cada request.
 */
let cachedToken: CachedToken | null = null;

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Variável de ambiente ${name} não configurada. Veja .env.local.example.`
    );
  }
  return value;
}

export async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.token;
  }

  const body = new URLSearchParams({
    client_id: requireEnv('GOOGLE_CLIENT_ID'),
    client_secret: requireEnv('GOOGLE_CLIENT_SECRET'),
    refresh_token: requireEnv('GOOGLE_REFRESH_TOKEN'),
    grant_type: 'refresh_token'
  });

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString()
  });

  const payload = await response.json();

  if (!response.ok) {
    // `invalid_grant` é o erro que aparece quando o app OAuth ficou em modo
    // Testing: nesse estado o refresh token morre em 7 dias.
    if (payload?.error === 'invalid_grant') {
      throw new Error(
        'Google recusou o refresh token (invalid_grant). Ou ele foi revogado, ou o app OAuth ainda está em modo Testing, onde o token expira em 7 dias. Publique o app no Google Cloud Console e rode scripts/google-oauth.mjs de novo.'
      );
    }
    throw new Error(
      `Falha ao renovar o access token: ${response.status} ${JSON.stringify(
        payload
      )}`
    );
  }

  cachedToken = {
    token: payload.access_token,
    expiresAt: Date.now() + Number(payload.expires_in) * 1000
  };

  return cachedToken.token;
}

async function googleFetch<T>(path: string, init: RequestInit): Promise<T> {
  const token = await getAccessToken();

  const response = await fetch(`${CALENDAR_API}${path}`, {
    ...init,
    headers: {
      ...init.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(
      `Google Calendar ${init.method ?? 'GET'} ${path} respondeu ${
        response.status
      }: ${text}`
    );
  }

  return text ? (JSON.parse(text) as T) : ({} as T);
}

/** Intervalos ocupados nas agendas de `BUSY_CALENDAR_IDS`, já unidos. */
export async function getBusyIntervals(
  timeMin: string,
  timeMax: string
): Promise<Interval[]> {
  const data = await googleFetch<{
    calendars?: Record<string, { busy?: Interval[]; errors?: unknown[] }>;
  }>('/freeBusy', {
    method: 'POST',
    body: JSON.stringify({
      timeMin,
      timeMax,
      timeZone: TIMEZONE,
      items: BUSY_CALENDAR_IDS.map((id) => ({ id }))
    })
  });

  // O `primary` volta com a chave resolvida no e-mail da conta, então a
  // resposta é lida pelo que veio, não pelo que foi pedido.
  const entries = Object.entries(data.calendars ?? {});

  // Agenda que responde erro (sem acesso, id errado) devolveria ocupação
  // vazia, e o horário já tomado apareceria livre. Entre derrubar a página e
  // deixar marcarem por cima, derrubar é o erro barato.
  const failed = entries.filter(([, calendar]) => calendar.errors?.length);
  if (failed.length > 0 || entries.length === 0) {
    throw new Error(
      `freeBusy retornou erro: ${JSON.stringify(
        Object.fromEntries(failed.map(([id, calendar]) => [id, calendar.errors]))
      )}`
    );
  }

  // Sobreposição entre agendas não incomoda: quem consome só pergunta se o
  // bloco encosta em algum intervalo.
  return entries.flatMap(([, calendar]) => calendar.busy ?? []);
}

export type BookingInput = {
  start: string;
  end: string;
  name: string;
  email: string;
  topic?: string;
};

export type CreatedEvent = {
  id: string;
  htmlLink: string;
  meetUrl: string | null;
};

/** A descrição do evento aceita HTML no Google Calendar, então texto do
 * visitante entra sem sinal de tag. */
function sanitize(value: string): string {
  return value.replace(/[<>]/g, '').trim();
}

export async function createEvent(input: BookingInput): Promise<CreatedEvent> {
  const name = sanitize(input.name);
  const topic = input.topic ? sanitize(input.topic) : '';

  const description = [
    topic,
    `Pedido por ${name} (${sanitize(input.email)})`,
    'Agendado pelo formulário em /schedule'
  ]
    .filter(Boolean)
    .join('\n\n');

  const event = await googleFetch<{
    id: string;
    htmlLink: string;
    hangoutLink?: string;
  }>(
    `/calendars/${encodeURIComponent(
      CALENDAR_ID
    )}/events?conferenceDataVersion=1&sendUpdates=all`,
    {
      method: 'POST',
      body: JSON.stringify({
        summary: `Bruno Amorim + ${name}`,
        description,
        start: { dateTime: input.start, timeZone: TIMEZONE },
        end: { dateTime: input.end, timeZone: TIMEZONE },
        attendees: [{ email: input.email, displayName: name }],
        guestsCanModify: false,
        guestsCanInviteOthers: false,
        reminders: { useDefault: true },
        conferenceData: {
          createRequest: {
            requestId: `schedule-${Date.now()}-${Math.random()
              .toString(36)
              .slice(2, 10)}`,
            conferenceSolutionKey: { type: 'hangoutsMeet' }
          }
        }
      })
    }
  );

  return {
    id: event.id,
    htmlLink: event.htmlLink,
    meetUrl: event.hangoutLink ?? null
  };
}
