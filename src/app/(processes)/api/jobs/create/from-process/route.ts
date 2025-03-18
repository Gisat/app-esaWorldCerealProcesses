import { fetchWithSessions } from "@features/(auth)/_ssr/handlers.sessionFetch";
import { NextRequest, NextResponse } from "next/server";
import getNamespaceByProcessId from "@features/(processes)/_utils/namespaceByProcessId";
import { handleRouteError } from "@features/(shared)/errors/handlers.errorInRoute";
import { ErrorBehavior } from "@features/(shared)/errors/enums.errorBehavior";
import { BaseHttpError } from "@features/(shared)/errors/models.error";
import getBoundaryDates from "@features/(processes)/_utils/boundaryDates";
import { transformDate } from "@features/(processes)/_utils/transformDate";

/**
 * Handles the GET request to create a job from a process.
 *
 * @param {NextRequest} req - The incoming request object.
 * @returns {Promise<NextResponse>} - The response object.
 */
export async function GET(req: NextRequest) {
  try {
    // read query params from the request URL
    const { searchParams } = req.nextUrl;

    const bbox = searchParams.get("bbox");
    const outputFileFormat = searchParams.get("outputFileFormat");
    const endDate = searchParams.get("endDate");
    const processId = searchParams.get("product");
    const model = searchParams.get("model");

    // validate inputs for safe aggregation
    if (!endDate)
      throw new BaseHttpError("Missing endDate value", 400, ErrorBehavior.SSR);

    if (!bbox)
      throw new BaseHttpError("Missing bbox value", 400, ErrorBehavior.SSR);

    if (!outputFileFormat)
      throw new BaseHttpError("Missing outputFileFormat value", 400, ErrorBehavior.SSR);

    if (!model) 
      throw new BaseHttpError("Missing model value", 400, ErrorBehavior.SSR);

    // prepare data for the request
    const boundaryDates = getBoundaryDates(new Date(endDate));
    const startDate = transformDate(boundaryDates.startDate);

    const data = {
      processId,
      namespace: getNamespaceByProcessId(processId),
      bbox: bbox.split(",").map(Number),
      crs: "EPSG:4326",
      timeRange: [startDate, endDate],
      outputFileFormat,
      model
    };

    console.log("data", data);

    const openeoUrlPrefix = process.env.OEO_URL

    if (!openeoUrlPrefix)
      throw new Error("Missing openeo URL variable")

    const url = `${openeoUrlPrefix}/openeo/jobs/create/from-process`;

    // fetch data with sessions
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
