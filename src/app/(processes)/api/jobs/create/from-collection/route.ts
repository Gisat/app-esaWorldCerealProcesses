import { fetchWithSessions } from "@features/(auth)/_ssr/handlers.sessionFetch";
import { ErrorBehavior } from "@features/(shared)/errors/enums.errorBehavior";
import { handleRouteError } from "@features/(shared)/errors/handlers.errorInRoute";
import { BaseHttpError } from "@features/(shared)/errors/models.error";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // read query params from the request URL
    const { searchParams } = req.nextUrl;

    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const bbox = searchParams.get("bbox");
    const off = searchParams.get("off");
    const collection = searchParams.get("collection");

    // validate inputs for safe aggragation
    if (!startDate)
      throw new BaseHttpError("Missing startDate value", 400, ErrorBehavior.SSR);


    if (!endDate)
      throw new BaseHttpError("Missing endDate value", 400, ErrorBehavior.SSR);

    if (!bbox)
      throw new BaseHttpError("Missing bbox value", 400, ErrorBehavior.SSR);

    if (!off)
      throw new BaseHttpError("Missing outputFileFormat value", 400, ErrorBehavior.SSR);


    const data = {
      collection: collection,
      bbox: bbox.split(",").map(Number),
      crs: "EPSG:4326",   // Make parametrized in the future, if needed
      timeRange: [startDate, endDate],
      outputFileFormat: off,
    };

    const openeoUrlPrefix = process.env.OEO_URL

    if (!openeoUrlPrefix)
      throw new Error("Missing openeo URL variable")

    const url = `${openeoUrlPrefix}/openeo/jobs/create/from-collection`;

    const { backendContent, setCookieHeader } = await fetchWithSessions(
      {
        method: "POST",
        requireSessionId: true,
        url,
        browserCookies: req.cookies,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
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
