import { NextResponse } from "next/server";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

export const dynamic = 'force-dynamic'
export async function GET() {
    try {
        // get url origin
        const parsedUrl = new URL(process.env.OID_SELF_REDIRECT_URL as string)
        const selfUrl = `${parsedUrl.protocol}//${parsedUrl.host}`

        // where to make logout
        const identityUrl = process.env.PID_URL as string
        const logoutUrl = `${identityUrl}/oid/logout`

        // build cookie domain of the backend app
        const feRedirect = NextResponse.redirect(logoutUrl as string)
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

        feRedirect.cookies.set('client_redirect', selfUrl, cookieOptions);
        return feRedirect

    } catch {
        const backendDomain = new URL(process.env.OID_SELF_REDIRECT_URL as string).hostname
        const feRedirect = NextResponse.redirect(backendDomain as string)

        // delete cookies from logout
        feRedirect.cookies.delete("client_redirect")
        feRedirect.cookies.delete("sid")

        return feRedirect
    }
}