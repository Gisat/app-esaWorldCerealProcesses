import { fetchWithSessions } from "@features/(auth)/_ssr/handlers.sessionFetch";
import { products, processTypes } from "@features/(processes)/_constants/app";
import { getSamples } from "@features/(processes)/_utils/sample.loader";
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

    // TODO: Check also for custom products

    return processWithCorrectProductType;
  });
};

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export async function GET(req: NextRequest) {
  try {
    const openeoUrlPrefix = process.env.OEO_URL

    if (!openeoUrlPrefix)
      throw new Error("Missing openeo URL variable")

    const url = `${openeoUrlPrefix}/openeo/jobs/list-all`

    const { backendContent, setCookieHeader, status } = await fetchWithSessions(
      {
        method: "GET",
        url,
        browserCookies: req.cookies,
        headers: {
          "Content-Type": "application/json"
        },
      })

    const samples = getSamples();

    if (status === 200) {
      const nextResponse = NextResponse.json(
        getProcessesWithCorrectProductType(
          [].concat(samples, backendContent)
        )
      );

      if (setCookieHeader) {
        nextResponse.headers.set('set-cookie', setCookieHeader);
      }
      return nextResponse

    } else {
      return NextResponse.json({ error: ["Error getting list of jobs"] });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error["message"] });
  }
}
