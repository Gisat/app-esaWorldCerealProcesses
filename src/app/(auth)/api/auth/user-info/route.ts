import { fetchWithSessions } from "@features/(auth)/_ssr/handlers.sessionFetch";
import { handleRouteError } from "@features/(shared)/errors/handlers.errorInRoute";
import { NextRequest, NextResponse } from "next/server";

// NextJS Cache controls
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET(req: NextRequest) {
    try {

        // user info auth URL
        const identityUrl = process.env.PID_URL as string
        const userInfoUrl = `${identityUrl}/oid/user-info`
        
        // build cookie domain of the backend app
        const { backendContent, setCookieHeader } = await fetchWithSessions({
            method: "GET",
            url: userInfoUrl,
            browserCookies: req.cookies,
            requireSessionId: true
        })

        // check fetch result
        if (!backendContent)
            throw new Error("Fetch response data missing in session fetch");

        if (!setCookieHeader)
            throw new Error("Fetch response with new session cookie missing");

    // prepare NextJS response with recived cookies including new SID
    const nextResponse = NextResponse.json(backendContent);

    if (setCookieHeader) {
      nextResponse.cookies.delete("sid");
      nextResponse.headers.set("set-cookie", setCookieHeader);
    }
    return nextResponse;
  } catch (error: any) {
      const { message, status } = handleRouteError(error)
      const response = NextResponse.json({ error: message }, { status })
      
      if(status === 401) 
        response.cookies.delete("sid")

      return response
  }
}
