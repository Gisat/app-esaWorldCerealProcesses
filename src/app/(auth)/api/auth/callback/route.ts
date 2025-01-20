import { NextRequest, NextResponse } from "next/server";
import { authContext } from "../../../_ssr/handlers.auth";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { pages } from "@/features/(shared)/constants/app";

export const dynamic = 'force-dynamic'

/**
 * OpenID Code Flow callback endpoint to obtain tokens and exchange them for session cookie
 * @param req 
 * @returns 
 */
export async function GET(req: NextRequest) {
    try {

        // environment parameters
        const issuerUrlRaw = process.env.OID_IAM_ISSUER_URL
        const redirectUrl = process.env.OID_SELF_REDIRECT_URL
        const clientIdRaw = process.env.CLIENT_ID

        const identityUrl = process.env.PID_URL
        const exchangeUrl = `${identityUrl}/sessions/exchange/tokens`

        // get auth context and handle tokens from IAM
        const auth = authContext(clientIdRaw, issuerUrlRaw, redirectUrl)
        const {tokens: tokenSet, tokenExchangeUrl, clientId, issuerUrl } = await auth.handleAuthCallback(req, exchangeUrl)            

        // build URL to return back to FE app
        const parsedRedirectUrl = new URL(process.env.OID_SELF_REDIRECT_URL as string)
        const urlToReturnWithSession = `${parsedRedirectUrl.protocol}//${parsedRedirectUrl.host}/${pages.processesList.url}`

        // build cookie domain of the backend app
        const feRedirect = NextResponse.redirect(tokenExchangeUrl as string)
        const backendDomain = new URL(process.env.OID_SELF_REDIRECT_URL as string).hostname

        // check production
        const isProd = process.env.NODE_ENV === "production"

        // define cookie options (same for all)
        const cookieOptions: Partial<ResponseCookie> = {
            httpOnly: true,
            secure: isProd, // true for production
            path: '/',
            sameSite: 'lax', // TODO: check with strinc on subdomains
            maxAge: isProd ? 8 : 120, // 8 seconds for prod | 120 for dev
            domain: backendDomain
        };

        // Set temporary cookie for each token exchange parameter
        feRedirect.cookies.set('access_token', tokenSet.access_token, cookieOptions); // TODO check types
        feRedirect.cookies.set('refresh_token', tokenSet.refresh_token, cookieOptions);
        feRedirect.cookies.set('id_token', tokenSet.id_token, cookieOptions);
        feRedirect.cookies.set('client_id', clientId, cookieOptions);
        feRedirect.cookies.set('client_redirect', urlToReturnWithSession, cookieOptions);
        feRedirect.cookies.set('issuer_url', issuerUrl, cookieOptions);

        // make redirect to backend with tokens for session cookie (tey will be exchanged)
        return feRedirect
    } catch (error: any) {
        return NextResponse.json({ "error": error["message"] })
    }
}