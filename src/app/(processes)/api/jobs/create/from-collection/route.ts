import { fetchWithSessions } from "@features/(auth)/_ssr/handlers.sessionFetch";
import { ErrorBehavior } from "@features/(shared)/errors/enums.errorBehavior";
import { handleRouteError } from "@features/(shared)/errors/handlers.errorInRoute";
import { BaseHttpError } from "@features/(shared)/errors/models.error";
import { NextRequest, NextResponse } from "next/server";
import { loggyError, loggyWarn } from "@gisatcz/ptr-be-core/node";

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
		// read query params from the request URL
		const {searchParams} = req.nextUrl;

		const bbox = searchParams.get("bbox");
		const outputFileFormat = searchParams.get("outputFileFormat");
		const collection = searchParams.get("collection");
		const product = searchParams.get("product");
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

		if (!outputFileFormat) {
			loggyError("Jobs create from collection GET", "Missing outputFileFormat value");
			throw new BaseHttpError("Missing outputFileFormat value", 400, ErrorBehavior.SSR);
		}

		if (!formParams.collection.options.some((option) => option.value === collection)) {
			loggyError("Jobs create from collection GET", "Invalid collection value");
			throw new BaseHttpError("Invalid collection value", 400, ErrorBehavior.SSR);
		}

		if (!formParams.product.options.some((option) => option.value === product)) {
			loggyError("Jobs create from collection GET", "Invalid product value");
			throw new BaseHttpError("Invalid product value", 400, ErrorBehavior.SSR);
		}

		if (!formParams.outputFileFormat.options.some((option) => option.value === outputFileFormat)) {
			loggyError("Jobs create from collection GET", "Invalid outputFileFormat value");
			throw new BaseHttpError("Invalid outputFileFormat value", 400, ErrorBehavior.SSR);
		}

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
			outputFileFormat: outputFileFormat,
		};

		const openeoUrlPrefix = process.env.OEO_URL

		if (!openeoUrlPrefix) {
			loggyError("Jobs create from collection GET", "Missing openeo URL variable");
			throw new Error("Missing openeo URL variable")
		}

		const url = `${openeoUrlPrefix}/openeo/jobs/create/from-collection`;

		// fetch data with sessions
		const {backendContent, setCookieHeader} = await fetchWithSessions(
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

		if (setCookieHeader) {
			nextResponse.headers.set('set-cookie', setCookieHeader);
		}

		return nextResponse

	} catch (error: any) {
		loggyError("Jobs create from collection GET", error);
		const {message, status} = handleRouteError(error)
		const response = NextResponse.json({error: message}, {status})

		if (status === 401) {
			loggyWarn('Unauthorized', 'User is not authorized to access the resource. Deleting session cookie.');
			response.cookies.delete('sid');
		}

		return response
	}
}
