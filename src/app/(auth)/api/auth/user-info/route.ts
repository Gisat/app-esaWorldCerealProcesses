import { fetchWithSessions } from "@features/(auth)/_ssr/handlers.sessionFetch";
import { handleRouteError } from "@features/(shared)/errors/handlers.errorInRoute";
import { NextRequest, NextResponse } from "next/server";
import { getRequireSessionId } from "@features/(auth)/_utils/requireSessionId";
import { loggyError, loggyWarn } from "@gisatcz/ptr-be-core/node";

// NextJS Cache controls
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

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
    if (!backendContent) {
      loggyError("User info GET", "Fetch response data missing in session fetch");
      throw new Error("Fetch response data missing in session fetch");
    }

    if (!setCookieHeader) {
      loggyError("User info GET", "Fetch response with new session cookie missing");
      throw new Error("Fetch response with new session cookie missing");
    }

    // prepare NextJS response with recived cookies including new SID
    const nextResponse = NextResponse.json(backendContent);

    if (setCookieHeader) {
      nextResponse.cookies.delete("sid");
      nextResponse.headers.set("set-cookie", setCookieHeader);
    }
    return nextResponse;
  } catch (error: any) {
    loggyError("User info GET", error);
    const { message, status } = handleRouteError(error);
    const response = NextResponse.json({ error: message }, { status });

    if (status === 401) {
      loggyWarn('Unauthorized', 'User is not authorized to access the resource. Deleting session cookie.');
      response.cookies.delete('sid');
    }

    return response;
  }
}
