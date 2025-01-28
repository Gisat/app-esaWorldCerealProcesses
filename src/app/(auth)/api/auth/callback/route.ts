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
        const {tokens: tokenSet, tokenExchangeUrl, clientId, issuerUrl } = await auth.handleAuthCallback(req, exchangeUrl)            

        // build URL to return back to FE app
        const parsedRedirectUrl = new URL(process.env.OID_SELF_REDIRECT_URL as string)
        const urlToReturnWithSession = `${parsedRedirectUrl.protocol}//${parsedRedirectUrl.host}/${pages.processesList.url}`

        // build query params for token exchange
        const urlparams = new URLSearchParams(tokenExchangeUrl as string)
        urlparams.append('access_token', tokenSet.access_token)
        urlparams.append('refresh_token', tokenSet.refresh_token)
        urlparams.append('id_token', tokenSet.id_token)
        urlparams.append('client_id', clientId)
        urlparams.append('client_redirect', urlToReturnWithSession)
        urlparams.append('issuer_url', issuerUrl)
        
        // redirect to backend for session exchange with tokens
        const finalurl = new URL(tokenExchangeUrl as string)
        const feRedirect = NextResponse.redirect(`${finalurl.origin}${finalurl.pathname}?${urlparams.toString()}`)
       
        return feRedirect
    } catch (error: any) {
        return NextResponse.json({ "error": error["message"] })
    }
}