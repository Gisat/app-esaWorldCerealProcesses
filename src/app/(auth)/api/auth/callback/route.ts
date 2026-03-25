import { ssrOpenidContext } from '@features/(shared)/ssr-auth/ssr.openid';
import { UsedAuthCookies } from '@features/(shared)/ssr-auth/enums.auth';
import { fetchForCookies } from '@features/(shared)/ssr-auth/ssr.callbackFetch';
import { handleRouteError } from '@features/(shared)/errors/handlers.errorInRoute';
import { NextRequest, NextResponse } from 'next/server';
import { loggyWarn } from '@gisatcz/ptr-be-core/node';
import { pages } from '@features/(processes)/_constants/app';

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

		if (!issuerUrlRaw || !redirectUrl || !clientIdRaw) {
			throw new Error('Missing required environment variables for OIDC callback');
		}

		// build exchange URL at identity service
		const identityUrl = process.env.PID_URL;
		const exchangeUrl = `${identityUrl}/sessions/exchange/tokens`;

		// get checks from cookies
		const state = req.cookies.get(UsedAuthCookies.OIDC_STATE)?.value;
		const pkceCodeVerifier = req.cookies.get(UsedAuthCookies.OIDC_PKCE_CODE_VERIFIER)?.value;
		const nonce = req.cookies.get(UsedAuthCookies.OIDC_NONCE)?.value;

		// get auth context and handle tokens from IAM
		const auth = ssrOpenidContext(clientIdRaw, issuerUrlRaw, redirectUrl);
		const {
			tokens: tokenSet,
			tokenExchangeUrl,
			clientId,
			issuerUrl,
		} = await auth.handleAuthCallback(
			{
				currentUrl: req.url,
				pkceCodeVerifier,
				expectedState: state,
				expectedNonce: nonce,
			},
			exchangeUrl
		);

		// prepare body for session exchange
		const body = {
			access_token: tokenSet.access_token,
			refresh_token: tokenSet.refresh_token,
			id_token: tokenSet.id_token,
			client_id: clientId,
			issuer_url: issuerUrl,
		};

		// build URL to redirect back to FE app
		const parsedRedirectUrl = new URL(redirectUrl);
		let urlToReturnWithSession = `${parsedRedirectUrl.protocol}//${parsedRedirectUrl.host}/${pages.home.url}`;

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

		// make POST request to identity backend for session exchange with tokens
		const { setCookieHeader, sessionId } = await fetchForCookies(tokenExchangeUrl, body);

		// Use session ID from body as priority
		if (sessionId) {
			feRedirect.cookies.set(UsedAuthCookies.SESSION_ID, sessionId, {
				httpOnly: true,
				secure: true,
				sameSite: 'lax',
				path: '/',
			});
		}
		// Fallback to original set-cookie header if sessionId is missing from body
		else if (setCookieHeader) {
			feRedirect.headers.set('set-cookie', setCookieHeader);
		}

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