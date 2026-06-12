// TEMPORARY DEBUG ENDPOINT — remove after diagnosing OAuth.
//
// Why this exists: Keystatic's built-in callback at
// /api/keystatic/github/oauth/callback returns a generic 401 "Authorization
// failed" without surfacing GitHub's actual error. This endpoint replicates
// the same token-exchange call but logs the full GitHub response so we can
// see whether the failure is `incorrect_client_credentials`,
// `bad_verification_code`, `redirect_uri_mismatch`, etc.
//
// Usage:
//   1. Open https://spring-massage-therapy.vercel.app/keystatic
//   2. Click "Sign in with GitHub" — let GitHub redirect you back
//   3. When the real callback returns 401, copy the `code=...` from the URL
//   4. Visit /api/debug-oauth?code=<that code> WITHIN 10 MINUTES
//   5. Check Vercel function logs for the [oauth-debug] line — it has the
//      exact GitHub error.
//
// Remove this file once OAuth is fixed.

import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const code = url.searchParams.get('code');
  const clientId = import.meta.env.KEYSTATIC_GITHUB_CLIENT_ID;
  const clientSecret = import.meta.env.KEYSTATIC_GITHUB_CLIENT_SECRET;

  // Diagnostic: confirm the env vars are actually visible to the function.
  // Length-only so we don't leak secrets to logs.
  const diag = {
    clientIdPresent: !!clientId,
    clientIdLength: clientId?.length ?? 0,
    clientIdFirst3: clientId?.slice(0, 3) ?? null, // safe to show first 3 chars
    clientSecretPresent: !!clientSecret,
    clientSecretLength: clientSecret?.length ?? 0,
    codePresent: !!code,
  };
  console.log('[oauth-debug] env check', JSON.stringify(diag));

  if (!code) {
    return new Response(
      JSON.stringify({ error: 'pass ?code=... in the query string', diag }, null, 2),
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
  let bodyText = await res.text();
  let bodyJson: unknown = null;
  try {
    bodyJson = JSON.parse(bodyText);
  } catch {
    /* leave bodyJson null */
  }

  // Redact access_token if it accidentally appears (success case).
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
