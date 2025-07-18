import { fetchWithSessions } from "@features/(auth)/_ssr/handlers.sessionFetch";
import { getRequireSessionId } from "@features/(auth)/_utils/requireSessionId";
import { handleRouteError } from "@features/(shared)/errors/handlers.errorInRoute";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

/**
 * Handles the GET request to get a job by key.
 *
 * @param {NextRequest} req - The incoming request object.
 * @param {Object} params - The parameters object.
 * @param {string} params.key - The key of the job to retrieve.
 * @returns {Promise<NextResponse>} - The response object.
 */
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await context.params; // Await params

    if (!key) {
      return NextResponse.json("Missing key value", {
        status: 400,
      });
    }

    const openeoUrlPrefix = process.env.OEO_URL

    if (!openeoUrlPrefix)
      throw new Error("Missing openeo URL variable")

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
    const { message, status } = handleRouteError(error)
    const response = NextResponse.json({ error: message }, { status })

    if (status === 401)
      response.cookies.delete("sid")

    return response
  }
}
