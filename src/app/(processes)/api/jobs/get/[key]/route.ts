import { fetchWithSessions } from "@features/(auth)/_ssr/handlers.sessionFetch";
import { getRequireSessionId } from "@features/(auth)/_utils/requireSessionId";
import { handleRouteError } from "@gisatcz/ptr-fe-core/globals";
import { NextRequest, NextResponse } from "next/server";
import { loggyError, loggyWarn } from "@gisatcz/ptr-be-core/node";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

/**
 * Handles the GET request to get a job by key.
 *
 * @param {NextRequest} req - The incoming request object.
 * @param context
 * @returns {Promise<NextResponse>} - The response object.
 */
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await context.params; // Await params

    if (!key) {
      loggyError("Jobs get by key GET", "Missing key value");
      return NextResponse.json("Missing key value", {
        status: 400,
      });
    }

    const openeoUrlPrefix = process.env.OEO_URL

    if (!openeoUrlPrefix) {
      loggyError("Jobs get by key GET", "Missing openeo URL variable");
      throw new Error("Missing openeo URL variable")
    }

    const url = `${openeoUrlPrefix}/openeo/jobs/${key}`

    // fetch data with sessions
    const { backendContent, setCookieHeader } = await fetchWithSessions(
      {
        method: "GET",
        url,
        browserCookies: req.cookies,
        headers: {
          "Content-Type": "application/json"
        },
        requireSessionId: getRequireSessionId()
      })

    const nextResponse = NextResponse.json(backendContent);

    if (setCookieHeader) {
      nextResponse.headers.set('set-cookie', setCookieHeader);
    }
    return nextResponse

  } catch (error: any) {
    loggyError("Jobs get by key GET", error);
    const { message, status } = handleRouteError(error)
    const response = NextResponse.json({ error: message }, { status })

    if (status === 401) {
      loggyWarn('Unauthorized', 'User is not authorized to access the resource. Deleting session cookie.');
      response.cookies.delete('sid');
    }

    return response
  }
}
