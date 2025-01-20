import { fetchWithSessions } from "@features/(auth)/_ssr/handlers.sessionFetch";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic'
export const fetchCache = "force-no-store";

export async function GET(req: NextRequest) {
    try {

        const identityUrl = process.env.PID_URL as string
        const userInfoUrl = `${identityUrl}/oid/user-info`
        
        console.log(userInfoUrl)

        // build cookie domain of the backend app
        const { backendContent, setCookieHeader } = await fetchWithSessions({
            method: "GET",
            url: userInfoUrl,
            browserCookies: req.cookies
        })

        if (!backendContent)
            throw new Error("Fetch response data missing in session fetch");

        if (!setCookieHeader)
            throw new Error("Fetch response with new session cookie missing");

        const nextResponse = NextResponse.json(backendContent);

        if (setCookieHeader) {
            nextResponse.cookies.delete("sid")
            nextResponse.headers.set('set-cookie', setCookieHeader);
        }
        return nextResponse

    } catch (error: any) {
        return NextResponse.json({ "error": error["message"] })
    }
}