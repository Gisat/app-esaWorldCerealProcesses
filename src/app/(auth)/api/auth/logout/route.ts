import { ssrOpenidContext } from '@features/(shared)/ssr-auth/ssr.openid';
import { UsedAuthCookies } from '@features/(shared)/ssr-auth/enums.auth';
import { fetchLogoutNotification } from '@features/(auth)/_ssr/handlers.logoutFetch';
import { handleRouteError } from '@features/(shared)/errors/handlers.errorInRoute';
import { NextRequest, NextResponse } from 'next/server';
import { loggyInfo, loggyWarn } from '@gisatcz/ptr-be-core/node';

// NextJS Cache controls
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

/**
 * Logout endpoint to notify BE and clear session cookies
 * @param req NextJS request object
 * @returns Redirect response to the application root
 */
export async function GET(req: NextRequest) {
	try {
		// environment parameters
		const issuerUrl = process.env.OID_IAM_ISSUER_URL as string;
		const redirectUrl = process.env.OID_SELF_REDIRECT_URL as string;
		const clientId = process.env.OID_CLIENT_ID as string;

		// get auth context
		const auth = ssrOpenidContext(clientId, issuerUrl, redirectUrl);

		// handle logout – validates and returns the exchange URL
		const { tokenExchangeUrl } = await auth.handleLogout(process.env.PID_URL as string);

		// fetch logout notification for BE
		await fetchLogoutNotification({
			identityServiceUrl: tokenExchangeUrl,
			browserCookies: req.cookies,
		});

		// url back to FE
		const parsedUrl = new URL(redirectUrl);
		const selfUrl = `${parsedUrl.protocol}//${parsedUrl.host}`;

		// prepare redirect back to FE
		const feRedirect = NextResponse.redirect(selfUrl);

		// delete cookies from logout
		feRedirect.cookies.delete(UsedAuthCookies.SESSION_ID);

		loggyInfo('Logout successful', 'User has been logged out successfully.');
		return feRedirect;

	} catch (error: any) {
		const { message, status } = handleRouteError(error);
		const response = NextResponse.json({ error: message }, { status });

		if (status === 401) {
			loggyWarn('Unauthoried', 'User is not authorized to access the resource. Deleting session cookie.');
			response.cookies.delete(UsedAuthCookies.SESSION_ID);
		}

		return response;
	}
}
