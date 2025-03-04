import { fetchWithSessions } from "@features/(auth)/_ssr/handlers.sessionFetch";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET(
  req: NextRequest,
  { params: { jobKey } }: { params: { jobKey: string } }
) {
  try {
    // validate inputs for safe aggragation
    if (!jobKey) {
      return NextResponse.json("Missing jobKey value", {
        status: 400,
      });
    }

    const openeoUrlPrefix = process.env.OEO_URL

    if(!openeoUrlPrefix)
      throw new Error("Missing openeo URL variable")

    const url = `${openeoUrlPrefix}/openeo/jobs/${jobKey}`

    const {status, backendContent, setCookieHeader} = await fetchWithSessions(
      {
        method: "GET",
        url,
        browserCookies: req.cookies,
        headers: {
          "Content-Type": "application/json"
        },
      })

      if (status === 200) {
        const nextResponse = NextResponse.json(backendContent);

        if (setCookieHeader) {
          nextResponse.headers.set('set-cookie', setCookieHeader);
        }
        return nextResponse
    } else {
      return NextResponse.json({ error: ["Error getting job"] });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error["message"] });
  }
}
