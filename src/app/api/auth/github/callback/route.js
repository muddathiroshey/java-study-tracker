import { cookies } from 'next/headers';
import {
  dbGetUserByUsernameOrEmail,
  dbUpdateUserProgress,
} from '../../../../../lib/db';

/**
 * GET /api/auth/github/callback?code=…&state=…
 *
 * GitHub redirects here after the user authorises.
 * 1. Exchange the temporary code for a permanent access token
 * 2. Fetch the user's GitHub login (@username) from the GitHub API
 * 3. Look up the app user from the session cookie
 * 4. Save githubToken + githubLogin into their settings in the DB
 * 5. Redirect back to /settings with a success or error flag
 */
export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code  = searchParams.get('code');
  const error = searchParams.get('error'); // e.g. "access_denied"

  const settingsUrl = `${origin}/settings`;

  // User denied the request on GitHub
  if (error || !code) {
    return Response.redirect(
      `${settingsUrl}?github=error&reason=${encodeURIComponent(error || 'no_code')}`,
      302
    );
  }

  // ── Step 1: Exchange code for access token ────────────────────────────────
  let accessToken;
  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id:     process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const tokenData = await tokenRes.json();

    if (tokenData.error || !tokenData.access_token) {
      const reason = tokenData.error_description || tokenData.error || 'token_exchange_failed';
      return Response.redirect(
        `${settingsUrl}?github=error&reason=${encodeURIComponent(reason)}`,
        302
      );
    }

    accessToken = tokenData.access_token;
  } catch (err) {
    return Response.redirect(
      `${settingsUrl}?github=error&reason=${encodeURIComponent('network_error')}`,
      302
    );
  }

  // ── Step 2: Fetch the GitHub username ────────────────────────────────────
  let githubLogin;
  try {
    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
    const githubUser = await userRes.json();
    githubLogin = githubUser.login; // e.g. "muddathiroshey"
  } catch {
    githubLogin = null;
  }

  // ── Step 3: Identify the app user from the session cookie ─────────────────
  const cookieStore = await cookies();
  const session = cookieStore.get('java_study_session');
  if (!session?.value) {
    return Response.redirect(
      `${settingsUrl}?github=error&reason=not_logged_in`,
      302
    );
  }

  const user = await dbGetUserByUsernameOrEmail(session.value);
  if (!user) {
    return Response.redirect(
      `${settingsUrl}?github=error&reason=user_not_found`,
      302
    );
  }

  // ── Step 4: Persist the token + GitHub login ──────────────────────────────
  const updatedSettings = {
    ...user.settings,
    githubToken: accessToken,
    githubLogin: githubLogin || null,
    // Preserve the repo if already set
    githubRepo: user.settings?.githubRepo || '',
  };

  await dbUpdateUserProgress(
    user.username,
    user.lessonsProgress,
    user.tasksProgress,
    user.submissions,
    updatedSettings,
    user.streak,
    user.lastActiveDate
  );

  // ── Step 5: Redirect back to Settings ────────────────────────────────────
  return Response.redirect(`${settingsUrl}?github=connected`, 302);
}
