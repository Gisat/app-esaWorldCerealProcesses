import { fetchWithSessions } from "@features/(auth)/_ssr/handlers.sessionFetch";
import { products, customProducts, processTypes } from "@features/(processes)/_constants/app";
import { getSamples } from "@features/(processes)/_utils/sample.loader";
import { handleRouteError } from "@features/(shared)/errors/handlers.errorInRoute";
import { NextRequest, NextResponse } from "next/server";


/**
 * Update processes with correct process type.
 *
 * @param {Array} processes - The list of processes to update.
 * @returns {Array} - The updated list of processes with the correct product type.
 */
const getProcessesWithCorrectProductType = (processes: any[]): any[] => {
  // Map processes to prevent mutation and set type to default value
  return processes.map((p: any) => {
    const processWithCorrectProductType = {
      ...p,
      type: processTypes.unknown,
    }

    // Check if process collection is one of download products ones
    if (products.map((p: any) => p.value).includes(p.oeoCollection)) {
      processWithCorrectProductType.type = processTypes.download;
    }

    // Check if processId is one of custom products ones
    if (customProducts.map((p: any) => p.value).includes(p.oeoProcessId)) {
      processWithCorrectProductType.type = processTypes.product;
    }

    // TODO: Check also for custom products

    return processWithCorrectProductType;
  });
};

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

/**
 * Handles the GET request to list all jobs.
 *
 * @param {NextRequest} req - The incoming request object.
 * @returns {Promise<NextResponse>} - The response object.
 */
export async function GET(req: NextRequest) {
  try {
    const openeoUrlPrefix = process.env.OEO_URL

    if (!openeoUrlPrefix)
      throw new Error("Missing openeo URL variable")

    const url = `${openeoUrlPrefix}/openeo/jobs/list-all`

    // fetch data with sessions
    const { backendContent, setCookieHeader } = await fetchWithSessions(
      {
        method: "GET",
        url,
        browserCookies: req.cookies,
        headers: {
          "Content-Type": "application/json"
        },
        requireSessionId: true
      })

    const samples = getSamples();

    const nextResponse = NextResponse.json(
      getProcessesWithCorrectProductType(
        [].concat(samples, backendContent)
      )
    );

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
