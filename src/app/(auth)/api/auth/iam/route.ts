import { authContext } from "@features/(auth)/_ssr/handlers.auth";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic'
export async function GET() {
    try {
        // environment parameters
        const issuerUrl = process.env.OID_IAM_ISSUER_URL
        const redirectUrl = process.env.OID_SELF_REDIRECT_URL
        const clientId = process.env.OID_CLIENT_ID

        // get auth context and handle tokens from IAM
        const auth = authContext(clientId, issuerUrl, redirectUrl)
        
        // redirect to authorisation
        const authorizationReadyUrl = await auth.handleInternalKeycloak()
        return NextResponse.redirect(authorizationReadyUrl)
    } catch (error: any) {
        return NextResponse.json({ "error": error["message"] })
    }
}