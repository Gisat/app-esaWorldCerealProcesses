import { NextRequest, NextResponse } from "next/server";
import { pages } from "@features/(processes)/_constants/app";
import { authContext } from "@features/(auth)/_ssr/handlers.auth";

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
        const { tokens: tokenSet, tokenExchangeUrl, clientId, issuerUrl } = await auth.handleAuthCallback(req, exchangeUrl)


        const body = {
            access_token: tokenSet.access_token,
            refresh_token: tokenSet.refresh_token,
            id_token: tokenSet.id_token,
            client_id: clientId,
            issuer_url: issuerUrl
        };

        // make POST request to backend for session exchange with tokens
        const response = await fetch(tokenExchangeUrl as string, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        const setCookieHeader = response.headers.get('set-cookie');

        if (!setCookieHeader)
            throw new Error("Missing session cookie in response")

        // build URL to return back to FE app
        const parsedRedirectUrl = new URL(redirectUrl as string)
        const urlToReturnWithSession = `${parsedRedirectUrl.protocol}//${parsedRedirectUrl.host}/${pages.processesList.url}`

        const feRedirect = NextResponse.redirect(urlToReturnWithSession)

        feRedirect.headers.set('set-cookie', setCookieHeader);
        return feRedirect

    } catch (error: any) {
        return NextResponse.json({ "error": error["message"] })
    }
}