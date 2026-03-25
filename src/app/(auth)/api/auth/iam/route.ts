import { ssrOpenidContext } from '@features/(shared)/ssr-auth/ssr.openid';
import { UsedAuthCookies } from '@features/(shared)/ssr-auth/enums.auth';
import { handleRouteError } from '@features/(shared)/errors/handlers.errorInRoute';
import { NextRequest, NextResponse } from 'next/server';
import { loggyWarn } from '@gisatcz/ptr-be-core/node';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

/**
 * IAM authorization endpoint to initiate OpenID Connect (OAuth2) flow
 * This route redirects the user to the IAM issuer for authentication
 * @param req NextJS request object
 * @returns Redirect response to the authorization URL
 */
export async function GET(req: NextRequest) {
	try {
		// environment parameters
		const issuerUrl = process.env.OID_IAM_ISSUER_URL;
		const redirectUrl = process.env.OID_SELF_REDIRECT_URL;
		const clientId = process.env.OID_CLIENT_ID;

		if (!issuerUrl || !redirectUrl || !clientId) {
			throw new Error('Missing required environment variables for IAM authentication');
		}

		// get auth context and build authorization URL with PKCE checks
		const auth = ssrOpenidContext(clientId, issuerUrl, redirectUrl);
		const { authorizationUrl, checks } = await auth.handleUserOpenID();

		// redirect to authorisation
		const response = NextResponse.redirect(authorizationUrl.toString());

		// store checks for callback validation in cookies
		response.cookies.set(UsedAuthCookies.OIDC_STATE, checks.state, { httpOnly: true, secure: true, sameSite: 'lax' });
		response.cookies.set(UsedAuthCookies.OIDC_PKCE_CODE_VERIFIER, checks.pkceCodeVerifier, {
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
		});
		response.cookies.set(UsedAuthCookies.OIDC_NONCE, checks.nonce, { httpOnly: true, secure: true, sameSite: 'lax' });

		// store return URL from query param if present
		const returnUrl = req.nextUrl.searchParams.get('returnUrl');
		if (returnUrl && returnUrl.startsWith('/') && !returnUrl.startsWith('//')) {
			response.cookies.set(UsedAuthCookies.AUTH_RETURN_URL, returnUrl, { httpOnly: true, secure: true, sameSite: 'lax' });
		}

		return response;
	} catch (error: any) {
		const { message, status } = handleRouteError(error);
		const response = NextResponse.json({ error: message }, { status });

		if (status === 401) {
			loggyWarn('Unauthorized', `Authentication failed: ${message}`);
			response.cookies.delete(UsedAuthCookies.SESSION_ID);
		}

		return response;
	}
}
