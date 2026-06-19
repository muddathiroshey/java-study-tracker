import { cookies } from 'next/headers';

/**
 * GET /api/auth/github/connect
 *
 * Builds the GitHub OAuth authorization URL server-side (GITHUB_CLIENT_ID
 * never leaves the server) and redirects the browser to GitHub.
 *
 * After the user authorises, GitHub redirects to:
 *   /api/auth/github/callback?code=…&state=…
 */
export async function GET(request) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return new Response('GITHUB_CLIENT_ID is not configured.', { status: 500 });
  }

  // Build the callback URL from the incoming request origin so this works on
  // both localhost and production without any extra env var.
  const origin = new URL(request.url).origin;
  const callbackUrl = `${origin}/api/auth/github/callback`;

  // Use the session username as the OAuth "state" — simple enough for an
  // internal admin tool.  A random nonce would be needed for a public app.
  const cookieStore = await cookies();
  const session = cookieStore.get('java_study_session');
  const state = session?.value || 'unknown';

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: callbackUrl,
    scope: 'repo',          // full repo access (private + public)
    state,
  });

  return Response.redirect(
    `https://github.com/login/oauth/authorize?${params.toString()}`,
    302
  );
}
