export default async (req, context) => {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_KEY;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return new Response(JSON.stringify({ error: 'Environment variables not set' }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    });
  }

  const url = new URL(req.url);
  const path = url.searchParams.get('path'); // e.g. /lc_shifts?id=eq.main&select=data
  const method = req.method;

  let body = null;
  if (method !== 'GET' && method !== 'DELETE') {
    body = await req.text();
  }

  const prefer = req.headers.get('x-prefer') || '';

  const headers = {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
  };
  if (prefer) headers['Prefer'] = prefer;

  const fetchRes = await fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    method,
    headers,
    body: body || undefined,
  });

  const resBody = await fetchRes.text();

  return new Response(resBody, {
    status: fetchRes.status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
};

export const config = { path: '/api/supabase' };
