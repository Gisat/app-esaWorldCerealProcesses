import { fetchWithSessions } from "@features/(auth)/_ssr/handlers.sessionFetch";
import { getRequireSessionId } from "@features/(auth)/_utils/requireSessionId";
import { handleRouteError } from "@features/(shared)/errors/handlers.errorInRoute";
import { NextRequest, NextResponse } from "next/server";
import { loggyError, loggyWarn } from "@gisatcz/ptr-be-core/node";

// NextJS Cache controls
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

/**
 * Handles the GET request to start a job.
 * 
 * @param {NextRequest} req - The incoming request object.
 * @param {Object} context - The context object containing route parameters.
 * @param {Promise<{ key: string }>} context.params - The key parameter from the route.
 * @returns {Promise<NextResponse>} - The response object.
 */
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ key: string }> }
) {
  const { key } = await context.params;
  try {
    // Validate inputs for safe aggregation
    if (!key) {
      loggyError("Jobs start GET", "Missing key value");
      return NextResponse.json("Missing key value", {
        status: 400,
      });
    }
    const data = {
      key
    };

    const openeoUrlPrefix = process.env.OEO_URL;

    // Check if the OpenEO URL prefix is defined
    if (!openeoUrlPrefix) {
      loggyError("Jobs start GET", "Missing openeo URL variable");
      throw new Error("Missing openeo URL variable");
    }

    const url = `${openeoUrlPrefix}/openeo/jobs/start`;

    // Fetch data with session handling
    const { backendContent, setCookieHeader } = await fetchWithSessions(
      {
        method: "POST",
        url,
        browserCookies: req.cookies,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
        requireSessionId: getRequireSessionId()
      });

    const nextResponse = NextResponse.json(backendContent);

    // Set the cookie header if available
    if (setCookieHeader) {
      nextResponse.headers.set('set-cookie', setCookieHeader);
    }
    return nextResponse;

  } catch (error: any) {
    loggyError("Jobs start GET", error);
    // Handle errors and return appropriate response
    const { message, status } = handleRouteError(error);
    const response = NextResponse.json({ error: message }, { status });

    // Delete session cookie if unauthorized
    if (status === 401) {
      loggyWarn('Unauthorized', 'User is not authorized to access the resource. Deleting session cookie.');
      response.cookies.delete('sid');
    }

    return response;
  }
}
