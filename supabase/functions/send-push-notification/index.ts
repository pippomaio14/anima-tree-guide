import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

// Send push notifications via FCM HTTP v1 API
// Body: { title: string, body: string, audience?: 'all' | 'volunteers', data?: Record<string,string> }

const FIREBASE_SERVICE_ACCOUNT = Deno.env.get('FIREBASE_SERVICE_ACCOUNT')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

function base64url(input: Uint8Array | string): string {
  const bytes = typeof input === 'string' ? new TextEncoder().encode(input) : input;
  let str = btoa(String.fromCharCode(...bytes));
  return str.replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const b64 = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\s+/g, '');
  const binary = atob(b64);
  const buf = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) buf[i] = binary.charCodeAt(i);
  return buf.buffer;
}

async function getAccessToken(sa: { client_email: string; private_key: string }): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const claim = {
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/firebase.messaging',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };
  const toSign = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(claim))}`;
  const key = await crypto.subtle.importKey(
    'pkcs8',
    pemToArrayBuffer(sa.private_key),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(toSign));
  const jwt = `${toSign}.${base64url(new Uint8Array(sig))}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`Token error: ${JSON.stringify(json)}`);
  return json.access_token as string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const body = await req.json();
    const { title, body: message, audience = 'all', data = {} } = body ?? {};
    if (!title || !message) {
      return new Response(JSON.stringify({ error: 'title and body required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Fetch target tokens
    let tokens: string[] = [];
    if (audience === 'volunteers') {
      const { data: vols, error } = await supabase
        .from('profiles').select('user_id').eq('is_volunteer', true);
      if (error) throw error;
      const ids = (vols ?? []).map((v: any) => v.user_id);
      if (ids.length === 0) {
        return new Response(JSON.stringify({ sent: 0, note: 'no volunteers' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const { data: rows, error: e2 } = await supabase
        .from('push_tokens').select('token').in('user_id', ids);
      if (e2) throw e2;
      tokens = (rows ?? []).map((r: any) => r.token);
    } else {
      const { data: rows, error } = await supabase.from('push_tokens').select('token');
      if (error) throw error;
      tokens = (rows ?? []).map((r: any) => r.token);
    }

    tokens = Array.from(new Set(tokens.filter(Boolean)));
    if (tokens.length === 0) {
      return new Response(JSON.stringify({ sent: 0, note: 'no tokens' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const sa = JSON.parse(FIREBASE_SERVICE_ACCOUNT);
    const accessToken = await getAccessToken(sa);
    const url = `https://fcm.googleapis.com/v1/projects/${sa.project_id}/messages:send`;

    // Normalize data values to strings (FCM requirement)
    const dataStr: Record<string, string> = {};
    for (const [k, v] of Object.entries(data)) dataStr[k] = String(v);

    let sent = 0;
    const failed: { token: string; error: string }[] = [];

    await Promise.all(tokens.map(async (token) => {
      const payload = {
        message: {
          token,
          notification: { title, body: message },
          data: dataStr,
          android: { priority: 'HIGH' as const },
        },
      };
      const r = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (r.ok) {
        sent++;
      } else {
        const errBody = await r.text();
        failed.push({ token, error: errBody });
        // Clean up invalid tokens
        if (r.status === 404 || r.status === 400) {
          await supabase.from('push_tokens').delete().eq('token', token);
        }
      }
    }));

    return new Response(JSON.stringify({ sent, failed: failed.length, total: tokens.length }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('send-push error', e);
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
