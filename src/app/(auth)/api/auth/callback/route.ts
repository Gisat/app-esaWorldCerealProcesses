import { NextRequest, NextResponse } from "next/server";
import { pages } from "@features/(processes)/_constants/app";
import { authContext } from "@features/(auth)/_ssr/handlers.auth";
import { fetchForCookies } from "@features/(auth)/_ssr/handlers.callbackFetch";

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

        // build exchange URL at identity service
        const identityUrl = process.env.PID_URL
        const exchangeUrl = `${identityUrl}/sessions/exchange/tokens`

        // get auth context and handle tokens from IAM
        const auth = authContext(clientIdRaw, issuerUrlRaw, redirectUrl)
        const { tokens: tokenSet, tokenExchangeUrl, clientId, issuerUrl } = await auth.handleAuthCallback(req, exchangeUrl)

        // prepare body for session exchange
        const body = {
            access_token: tokenSet.access_token,
            refresh_token: tokenSet.refresh_token,
            id_token: tokenSet.id_token,
            client_id: clientId,
            issuer_url: issuerUrl
        };

        // make POST request to backend for session exchange with tokens
        const setCookieHeader = await fetchForCookies(tokenExchangeUrl, body)

        // build URL to redirect back to FE app
        const parsedRedirectUrl = new URL(redirectUrl as string)
        const urlToReturnWithSession = `${parsedRedirectUrl.protocol}//${parsedRedirectUrl.host}/${pages.processesList.url}`

        // prepare redirect response with session cookie
        const feRedirect = NextResponse.redirect(urlToReturnWithSession)
        feRedirect.headers.set('set-cookie', setCookieHeader);
       
        return feRedirect

    } catch (error: any) {
        return NextResponse.json({ "error": error["message"] })
    }
}