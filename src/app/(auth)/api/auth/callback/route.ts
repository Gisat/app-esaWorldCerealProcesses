import { ssrOpenidContext } from '@features/(shared)/ssr/ssr-auth/ssr.openid';
import { UsedAuthCookies } from '@features/(shared)/ssr/ssr-auth/enums.auth';
import { nextSetSessionIdCookie } from '@features/(shared)/ssr/ssr-auth/cookies.sid';
import { fetchExchangeTokensForSessionId } from '@features/(shared)/ssr/ssr-auth/ssr.callbackFetch';
import { handleRouteError } from '@gisatcz/ptr-fe-core/globals';
import { NextRequest, NextResponse } from 'next/server';
import { loggyWarn, ServerError } from '@gisatcz/ptr-be-core/node';

// NextJS Cache controls
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

/**
 * OpenID Code Flow callback endpoint to obtain tokens and exchange them for session cookie
 * @param req NextJS request object
 * @returns Response redirecting to home or error JSON
 */
export async function GET(req: NextRequest) {
	try {
		// environment parameters
		const issuerUrlRaw = process.env.OID_IAM_ISSUER_URL;
		const redirectUrl = process.env.OID_SELF_REDIRECT_URL;
		const clientIdRaw = process.env.OID_CLIENT_ID;

		if (!issuerUrlRaw) {
			throw new ServerError('Missing OID_IAM_ISSUER_URL environment variable');
		}
		if (!redirectUrl) {
			throw new ServerError('Missing OID_SELF_REDIRECT_URL environment variable');
		}
		if (!clientIdRaw) {
			throw new ServerError('Missing OID_CLIENT_ID environment variable');
		}

		// get checks from cookies
		const state = req.cookies.get(UsedAuthCookies.OIDC_STATE)?.value;
		const pkceCodeVerifier = req.cookies.get(UsedAuthCookies.OIDC_PKCE_CODE_VERIFIER)?.value;
		const nonce = req.cookies.get(UsedAuthCookies.OIDC_NONCE)?.value;

		// get auth context and handle tokens from OpenID provider
		const auth = ssrOpenidContext(clientIdRaw, issuerUrlRaw, redirectUrl);
		const openidBundle = await auth.handleAuthCallback(
			{
				currentUrl: new URL(redirectUrl),
				query: req.nextUrl.searchParams,
				pkceCodeVerifier,
				expectedState: state,
				expectedNonce: nonce,
			}
		);

		// build URL to redirect back to FE app
		const parsedRedirectUrl = new URL(redirectUrl as string);
		let urlToReturnWithSession = `${parsedRedirectUrl.protocol}//${parsedRedirectUrl.host}/`;

		// check for return URL in cookies and validate it before including in redirect URL
		const returnUrl = req.cookies.get(UsedAuthCookies.AUTH_RETURN_URL)?.value;
		if (returnUrl && returnUrl.startsWith('/') && !returnUrl.startsWith('//')) {
			urlToReturnWithSession = `${parsedRedirectUrl.protocol}//${parsedRedirectUrl.host}${returnUrl}`;
		}

		// prepare redirect response with session cookie
		const feRedirect = NextResponse.redirect(urlToReturnWithSession);
		if (returnUrl) {
			feRedirect.cookies.delete(UsedAuthCookies.AUTH_RETURN_URL);
		}

		// make  request to identity backend service to exchange sensitive tokens for session
		// - build exchange URL at identity service
		const identityUrl = process.env.PID_URL;
		if (!identityUrl) {
			throw new ServerError("Missing PID URL in environment variables")
		}

		const exchangeUrl = `${identityUrl}/sessions/exchange/tokens`;

		// - exchange tokens for session ID
		const { sessionId } = await fetchExchangeTokensForSessionId(exchangeUrl, openidBundle);

		// set sessions ID as Same Site HTTP Cookie
		nextSetSessionIdCookie(sessionId, feRedirect);

		// delete OIDC checks from cookies
		feRedirect.cookies.delete(UsedAuthCookies.OIDC_STATE);
		feRedirect.cookies.delete(UsedAuthCookies.OIDC_PKCE_CODE_VERIFIER);
		feRedirect.cookies.delete(UsedAuthCookies.OIDC_NONCE);

		return feRedirect;
	} catch (error: any) {
		const { message, status } = handleRouteError(error);
		const response = NextResponse.json({ error: message }, { status });

		if (status === 401) {
			loggyWarn('Unauthorized', 'User is not authorized to access the resource. Deleting session cookie.');
			response.cookies.delete(UsedAuthCookies.SESSION_ID);
		}

		return response;
	}
}
