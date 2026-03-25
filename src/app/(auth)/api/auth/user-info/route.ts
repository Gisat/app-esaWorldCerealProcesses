import { fetchWithSessions } from "@features/(auth)/_ssr/handlers.sessionFetch";
import { handleRouteError } from "@features/(shared)/errors/handlers.errorInRoute";
import { NextRequest, NextResponse } from "next/server";
import { getRequireSessionId } from "@features/(auth)/_utils/requireSessionId";
import { UsedAuthCookies } from "@features/(shared)/ssr-auth/enums.auth";

// NextJS Cache controls
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

/**
 * User info endpoint to retrieve user details from the backend
 * @param req NextJS request object
 * @returns JSON response with user info and updated session cookie
 */
export async function GET(req: NextRequest) {
  try {
    // user info auth URL
    const identityUrl = process.env.PID_URL as string;
    const userInfoUrl = `${identityUrl}/oid/user-info`;

    // build cookie domain of the backend app
    const { backendContent, setCookieHeader } = await fetchWithSessions({
      method: "GET",
      url: userInfoUrl,
      browserCookies: req.cookies,
      requireSessionId: getRequireSessionId(),
    });

    // check fetch result
    if (!backendContent) throw new Error("Fetch response data missing in session fetch");
    if (!setCookieHeader) throw new Error("Fetch response with new session cookie missing");

    // prepare NextJS response with received cookies including new SID
    const response = NextResponse.json(backendContent);
    response.cookies.delete(UsedAuthCookies.SESSION_ID);
    response.headers.set("set-cookie", setCookieHeader);

    return response;
  } catch (error: any) {
    const { message, status } = handleRouteError(error);
    const response = NextResponse.json({ error: message }, { status });

    if (status === 401) {
      response.cookies.delete(UsedAuthCookies.SESSION_ID);
    }

    return response;
  }
}
