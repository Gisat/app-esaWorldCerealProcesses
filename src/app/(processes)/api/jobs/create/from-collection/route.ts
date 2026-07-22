import { fetchWithSessions } from "@features/(auth)/_ssr/handlers.sessionFetch";
import { ErrorBehavior } from "@gisatcz/ptr-fe-core/globals";
import { handleRouteError } from "@gisatcz/ptr-fe-core/globals";
import { BaseHttpError } from "@gisatcz/ptr-fe-core/globals";
import { NextRequest, NextResponse } from "next/server";
import { loggyError, loggyWarn } from "@gisatcz/ptr-be-core/node";
import { UsedAuthCookies } from '@features/(shared)/ssr/ssr-auth/enums.auth';

import formParams from "@features/(processes)/_constants/download-official-products/formParams";
import { getRequireSessionId } from "@features/(auth)/_utils/requireSessionId";
import { fromCollectionParamsSchema } from "@features/(processes)/_constants/validation";
import { SUPPORTED_OUTPUT_FORMAT } from '@features/(processes)/_constants/defaults';

/**
 * Handles the GET request to create a job from a collection.
 *
 * @param {NextRequest} req - The incoming request object.
 * @returns {Promise<NextResponse>} - The response object.
 */
export async function GET(req: NextRequest) {
	try {
		const secureCookie = req.nextUrl.protocol === 'https:';

		// read query params from the request URL
		const {searchParams} = req.nextUrl;
		const title = searchParams.get("title");

		const result = fromCollectionParamsSchema.safeParse(Object.fromEntries(searchParams));
		if (!result.success) {
			const firstIssue = result.error.issues[0];
			loggyError("Jobs create from collection GET", firstIssue.message);
			throw new BaseHttpError(firstIssue.message, 400, ErrorBehavior.SSR);
		}

		const { collection, product, bbox, customProperties } = result.data;

		const startDate = formParams.collection.options.find(
			(option) => option.value === collection
		)?.start;
		const endDate = formParams.collection.options.find(
			(option) => option.value === collection
		)?.end;

		if (!startDate) {
			loggyError("Jobs create from collection GET", "Missing startDate value");
			throw new BaseHttpError("Missing startDate value", 400, ErrorBehavior.SSR);
		}

		if (!endDate) {
			loggyError("Jobs create from collection GET", "Missing endDate value");
			throw new BaseHttpError("Missing endDate value", 400, ErrorBehavior.SSR);
		}

		// prepare data for the request
		const data = {
			collection: product,
			bbox: bbox.split(",").map(Number),
			crs: "EPSG:4326",   // Make parametrized in the future, if needed
			timeRange: [startDate, endDate],
			format: SUPPORTED_OUTPUT_FORMAT,
			...(title ? { title } : {}),
			...(customProperties ? { customProperties } : {}),
		};

		const openeoUrlPrefix = process.env.OEO_URL

		if (!openeoUrlPrefix) {
			loggyError("Jobs create from collection GET", "Missing openeo URL variable");
			throw new Error("Missing openeo URL variable")
		}

		const url = `${openeoUrlPrefix}/openeo/jobs/create/from-collection`;

		// fetch data with sessions
		const {backendContent, sessionId} = await fetchWithSessions(
			{
				method: "POST",
				requireSessionId: getRequireSessionId(),
				url,
				browserCookies: req.cookies,
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(data)
			})

		const nextResponse = NextResponse.json(backendContent);

		if (sessionId) {
			nextResponse.cookies.set(UsedAuthCookies.SESSION_ID, sessionId, { httpOnly: true, secure: secureCookie, sameSite: 'lax', path: '/' });
		}

		return nextResponse

	} catch (error: any) {
		loggyError("Jobs create from collection GET", error);
		const {message, status} = handleRouteError(error)
		const response = NextResponse.json({error: message}, {status})

		if (status === 401) {
			loggyWarn('Unauthorized', 'User is not authorized to access the resource. Deleting session cookie.');
			response.cookies.delete(UsedAuthCookies.SESSION_ID);
		}

		return response
	}
}
