import { fetchWithSessions } from "@features/(auth)/_ssr/handlers.sessionFetch";
import { processTypes } from "@features/(processes)/_constants/app";
import { getSamples } from "@features/(processes)/_utils/sample.loader";
import { handleRouteError } from "@gisatcz/ptr-fe-core/globals";
import { NextRequest, NextResponse } from "next/server";
import { loggyError, loggyWarn } from "@gisatcz/ptr-be-core/node";
import { UsedAuthCookies } from '@features/(shared)/ssr/ssr-auth/enums.auth';

import downloadFormParmas from "@features/(processes)/_constants/download-official-products/formParams";
import customProductFormParams from "@features/(processes)/_constants/generate-custom-products/formParams";
import { getRequireSessionId } from "@features/(auth)/_utils/requireSessionId";


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
    if (downloadFormParmas.product.options.map((p: any) => p.value).includes(p.oeoCollection)) {
      processWithCorrectProductType.type = processTypes.download;
    }

    // Check if processId is one of custom products ones
    if (customProductFormParams.product.options.map((p: any) => p.value).includes(p.oeoProcessId)) {
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
    const secureCookie = req.nextUrl.protocol === 'https:';

    const openeoUrlPrefix = process.env.OEO_URL

    if (!openeoUrlPrefix) {
      loggyError("Jobs get list GET", "Missing openeo URL variable");
      throw new Error("Missing openeo URL variable")
    }

    const url = `${openeoUrlPrefix}/openeo/jobs/list-all`

    // fetch data with sessions
    const { backendContent, sessionId } = await fetchWithSessions(
      {
        method: "GET",
        url,
        browserCookies: req.cookies,
        requireSessionId: getRequireSessionId()
      })

    const samples = getSamples();

    const processesWithValidProductType = getProcessesWithCorrectProductType(
      [].concat(samples, backendContent)
    ).filter((p: any) => p.type !== processTypes.unknown);

    const nextResponse = NextResponse.json(processesWithValidProductType);

     if (sessionId) {
		nextResponse.cookies.set(UsedAuthCookies.SESSION_ID, sessionId, { httpOnly: true, secure: secureCookie, sameSite: 'lax', path: '/' });
     }
    return nextResponse

  } catch (error: any) {
    loggyError("Jobs get list GET", error);
    const { message, status } = handleRouteError(error)
    const normalizedMessage = typeof message === 'string'
      ? message
      : (message && typeof message === 'object'
        ? (message as any).error ?? (message as any).message ?? JSON.stringify(message)
        : String(message));
    const response = NextResponse.json({
      error: normalizedMessage,
      details: typeof message === 'object' ? message : undefined,
    }, { status })

    if (status === 401) {
      loggyWarn('Unauthorized', 'User is not authorized to access the resource. Deleting session cookie.');
		  response.cookies.delete(UsedAuthCookies.SESSION_ID);
    }

    return response
  }
}
