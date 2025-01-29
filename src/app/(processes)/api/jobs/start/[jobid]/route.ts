import { fetchWithSessions } from "@features/(auth)/_ssr/handlers.sessionFetch";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params: { jobid } }: { params: { jobid: string } }
) {
  try {
    // validate inputs for safe aggragation
    if (!jobid) {
      return NextResponse.json("Missing jobid value", {
        status: 400,
      });
    }
    const data = {
      key: jobid,
    };

    const openeoUrlPrefix = process.env.OEO_URL

    if(!openeoUrlPrefix)
      throw new Error("Missing openeo URL variable")

    const url = `${openeoUrlPrefix}/openeo/jobs/start`

    const {status, backendContent, setCookieHeader} = await fetchWithSessions(
      {
        method: "POST",
        url,
        browserCookies: req.cookies,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
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
    return NextResponse.json({ error: error["message"] });
  }
}
