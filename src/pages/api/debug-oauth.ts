// TEMPORARY DEBUG ENDPOINT — remove after diagnosing OAuth.
//
// Why this exists: Keystatic's built-in callback at
// /api/keystatic/github/oauth/callback returns a generic 401 "Authorization
// failed" without surfacing GitHub's actual error. This endpoint replicates
// the same token-exchange call but logs the full GitHub response so we can
// see whether the failure is `incorrect_client_credentials`,
// `bad_verification_code`, `redirect_uri_mismatch`, etc.
//
// Two modes:
//   ?code=...        — exchange the GitHub code for a token (OAuth callback test)
//   ?mode=request    — just dump request headers + URL so we can see what
//                      origin/protocol Vercel hands to the function. Useful
//                      for diagnosing redirect_uri mismatches.
//
// Remove this file once OAuth is fixed.

import type { APIRoute } from 'astro';

const isStaticBuild = process.env.DEPLOY_TARGET === 'cloudflare';
export const prerender = isStaticBuild;

export const GET: APIRoute = async ({ url, request }) => {
  if (isStaticBuild) {
    return new Response('Not available on this host', { status: 404 });
  }

  const mode = url.searchParams.get('mode');
  if (mode === 'request') {
    // Dump everything we can see about the request.
    const headers: Record<string, string> = {};
    request.headers.forEach((v, k) => {
      headers[k] = v;
    });
    const dump = {
      'request.url (raw, what Astro sees)': request.url,
      'url.toString() (what new URL gives us)': url.toString(),
      'url.origin': url.origin,
      'url.protocol': url.protocol,
      'url.host': url.host,
      'url.pathname': url.pathname,
      'reconstructed redirect_uri': `${url.origin}/api/keystatic/github/oauth/callback`,
      headers,
    };
    return new Response(JSON.stringify(dump, null, 2), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const code = url.searchParams.get('code');
  const clientId = import.meta.env.KEYSTATIC_GITHUB_CLIENT_ID;
  const clientSecret = import.meta.env.KEYSTATIC_GITHUB_CLIENT_SECRET;

  const diag = {
    clientIdPresent: !!clientId,
    clientIdLength: clientId?.length ?? 0,
    clientIdFirst3: clientId?.slice(0, 3) ?? null,
    clientSecretPresent: !!clientSecret,
    clientSecretLength: clientSecret?.length ?? 0,
    codePresent: !!code,
  };
  console.log('[oauth-debug] env check', JSON.stringify(diag));

  if (!code) {
    return new Response(
      JSON.stringify({ error: 'pass ?code=... in the query string, or ?mode=request to dump headers', diag }, null, 2),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
  if (!clientId || !clientSecret) {
    return new Response(
      JSON.stringify({ error: 'env vars missing on the function', diag }, null, 2),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const tokenUrl = new URL('https://github.com/login/oauth/access_token');
  tokenUrl.searchParams.set('client_id', clientId);
  tokenUrl.searchParams.set('client_secret', clientSecret);
  tokenUrl.searchParams.set('code', code);

  const res = await fetch(tokenUrl, {
    method: 'POST',
    headers: { Accept: 'application/json' },
  });

  const status = res.status;
  const bodyText = await res.text();
  let bodyJson: unknown = null;
  try {
    bodyJson = JSON.parse(bodyText);
  } catch {
    /* leave bodyJson null */
  }

  const safeBody =
    bodyJson && typeof bodyJson === 'object' && 'access_token' in (bodyJson as Record<string, unknown>)
      ? { ...(bodyJson as Record<string, unknown>), access_token: '[REDACTED]' }
      : bodyJson ?? bodyText;

  console.log('[oauth-debug] github responded', JSON.stringify({ status, body: safeBody }));

  return new Response(
    JSON.stringify({ githubStatus: status, githubBody: safeBody, diag }, null, 2),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
};
