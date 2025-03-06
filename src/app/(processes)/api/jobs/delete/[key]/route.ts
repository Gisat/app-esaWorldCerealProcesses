import { fetchWithSessions } from "@features/(auth)/_ssr/handlers.sessionFetch";
import { handleRouteError } from "@features/(shared)/errors/handlers.errorInRoute";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params: { key } }: { params: { key: string } }
) {
  try {
    // validate inputs for safe aggragation
    if (!key) {
      return NextResponse.json("Missing key value", {
        status: 400,
      });
    }

    const data = {
      keys: [key],
    };

    const openeoUrlPrefix = process.env.OEO_URL

    if (!openeoUrlPrefix)
      throw new Error("Missing openeo URL variable")

    const url = `${openeoUrlPrefix}/openeo/jobs/delete`

    const { status, backendContent, setCookieHeader } = await fetchWithSessions(
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

    if (status === 200) {
      const nextResponse = NextResponse.json(backendContent);

      if (setCookieHeader) {
        nextResponse.headers.set('set-cookie', setCookieHeader);
      }
      return nextResponse
    } else {
      return NextResponse.json({ error: ["Error starting job"] });
    }
  } catch (error: any) {
    const { message, status } = handleRouteError(error)
    const response = NextResponse.json({ error: message }, { status })

    if (status === 401)
      response.cookies.delete("sid")

    return response
  }
}
