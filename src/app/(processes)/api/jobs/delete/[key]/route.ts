import { fetchWithSessions } from "@features/(auth)/_ssr/handlers.sessionFetch";
import { ErrorBehavior } from "@features/(shared)/errors/enums.errorBehavior";
import { handleRouteError } from "@features/(shared)/errors/handlers.errorInRoute";
import { BaseHttpError } from "@features/(shared)/errors/models.error";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params: { key } }: { params: { key: string } }
) {
  try {
    // validate inputs for safe aggragation
    if (!key) 
      throw new BaseHttpError("Missing key value", 400, ErrorBehavior.SSR);

    const data = {
      keys: [key],
    };

    const openeoUrlPrefix = process.env.OEO_URL

    if (!openeoUrlPrefix)
      throw new BaseHttpError("Missing openeo URL variable", 400, ErrorBehavior.SSR);

    const url = `${openeoUrlPrefix}/openeo/jobs/delete`

    const { backendContent, setCookieHeader } = await fetchWithSessions(
      {
        method: "POST",
        url,
        browserCookies: req.cookies,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
        requireSessionId: true
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
