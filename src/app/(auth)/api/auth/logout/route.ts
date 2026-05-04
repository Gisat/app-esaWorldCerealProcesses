import { handleRouteError } from '@gisatcz/ptr-fe-core/globals';
import { NextRequest, NextResponse } from 'next/server';
import { loggyWarn } from '@gisatcz/ptr-be-core/node';
import { ssrOpenidContext } from '@features/(shared)/ssr/ssr-auth/ssr.openid';
import { UsedAuthCookies } from '@features/(shared)/ssr/ssr-auth/enums.auth';
import { fetchLogoutNotification } from '@features/(shared)/ssr/ssr-auth/handlers.logoutFetch';

// NextJS Cache controls
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

/**
 * Logout endpoint to notify BE and clear session cookies
 * @param req NextJS request
 * @returns
 */
export async function GET(req: NextRequest) {
	try {
		// environment parameters
		const issuerUrl = process.env.OID_IAM_ISSUER_URL as string;
		const redirectUrl = process.env.OID_SELF_REDIRECT_URL as string;
		const clientId = process.env.OID_CLIENT_ID as string;
		const identityServiceUrl = process.env.PID_URL as string;

		// get auth context
		const auth = ssrOpenidContext(clientId, issuerUrl, redirectUrl);

		// handle logout with OIDC client
		const { logoutUrl } = await auth.handleLogout(`${identityServiceUrl}/oid/logout`);

		// fetch logout notification for BE
		await fetchLogoutNotification({
			logoutUrl,
			browserCookies: req.cookies,
		});

		// url back to FE
		const parsedUrl = new URL(redirectUrl);
		const selfUrl = `${parsedUrl.protocol}//${parsedUrl.host}`;

		// prepare redirect back to FE
		const feRedirect = NextResponse.redirect(selfUrl);

		// delete cookies from logout
		feRedirect.cookies.delete(UsedAuthCookies.SESSION_ID);

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
