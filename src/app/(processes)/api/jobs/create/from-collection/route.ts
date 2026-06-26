import { fetchWithSessions } from "@features/(auth)/_ssr/handlers.sessionFetch";
import { ErrorBehavior } from "@gisatcz/ptr-fe-core/globals";
import { handleRouteError } from "@gisatcz/ptr-fe-core/globals";
import { BaseHttpError } from "@gisatcz/ptr-fe-core/globals";
import { NextRequest, NextResponse } from "next/server";
import { loggyError, loggyWarn } from "@gisatcz/ptr-be-core/node";
import { UsedAuthCookies } from '@features/(shared)/ssr/ssr-auth/enums.auth';

import formParams from "@features/(processes)/_constants/download-official-products/formParams";
import { getRequireSessionId } from "@features/(auth)/_utils/requireSessionId";

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

		const bbox = searchParams.get("bbox");
		const format = searchParams.get("format");
		const collection = searchParams.get("collection");
		const product = searchParams.get("product");
		const title = searchParams.get("title");
		const customPropertiesRaw = searchParams.get("customProperties");
		const startDate = formParams.collection.options.find(
			(option) => option.value === collection
		)?.start;
		const endDate = formParams.collection.options.find(
			(option) => option.value === collection
		)?.end;

		// validate inputs for safe aggregation
		if (!collection) {
			loggyError("Jobs create from collection GET", "Missing collection value");
			throw new BaseHttpError("Missing collection value", 400, ErrorBehavior.SSR);
		}

		if (!product) {
			loggyError("Jobs create from collection GET", "Missing product value");
			throw new BaseHttpError("Missing product value", 400, ErrorBehavior.SSR);
		}

		if (!bbox) {
			loggyError("Jobs create from collection GET", "Missing bbox value");
			throw new BaseHttpError("Missing bbox value", 400, ErrorBehavior.SSR);
		}

		if (!format) {
			loggyError("Jobs create from collection GET", "Missing format value");
			throw new BaseHttpError("Missing format value", 400, ErrorBehavior.SSR);
		}

		if (!formParams.collection.options.some((option) => option.value === collection)) {
			loggyError("Jobs create from collection GET", "Invalid collection value");
			throw new BaseHttpError("Invalid collection value", 400, ErrorBehavior.SSR);
		}

		if (!formParams.product.options.some((option) => option.value === product)) {
			loggyError("Jobs create from collection GET", "Invalid product value");
			throw new BaseHttpError("Invalid product value", 400, ErrorBehavior.SSR);
		}

		if (!formParams.format.options.some((option) => option.value === format)) {
			loggyError("Jobs create from collection GET", "Invalid format value");
			throw new BaseHttpError("Invalid format value", 400, ErrorBehavior.SSR);
		}

		if (!startDate) {
			loggyError("Jobs create from collection GET", "Missing startDate value");
			throw new BaseHttpError("Missing startDate value", 400, ErrorBehavior.SSR);
		}

		if (!endDate) {
			loggyError("Jobs create from collection GET", "Missing endDate value");
			throw new BaseHttpError("Missing endDate value", 400, ErrorBehavior.SSR);
		}

		let customProperties: Record<string, unknown> | undefined;
		if (customPropertiesRaw) {
			try {
				customProperties = JSON.parse(customPropertiesRaw);
			} catch {
				loggyError("Jobs create from collection GET", "Invalid customProperties JSON");
				throw new BaseHttpError("Invalid customProperties value", 400, ErrorBehavior.SSR);
			}
		}

		// prepare data for the request
		const data = {
			collection: product,
			bbox: bbox.split(",").map(Number),
			crs: "EPSG:4326",   // Make parametrized in the future, if needed
			timeRange: [startDate, endDate],
			format: format,
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
