import { fetchWithSessions } from "@/app/(shared)/_ssr/handlers.sessionFetch";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic'
export const fetchCache = "force-no-store";

export async function GET(req: NextRequest) {
    try {

        // where to make logout
        const userInfoUrl = process.env.PID_USER_INFO as string
        console.log(userInfoUrl)

        // build cookie domain of the backend app
        const response = await fetchWithSessions({
            method: "GET",
            url: userInfoUrl,
            browserCookies: req.cookies
        })

        // response user info back to FE client part
        const body = await response.json()


        return NextResponse.json(body)

    } catch (error: any) {
        return NextResponse.json({ "error": error["message"] })
    }
}