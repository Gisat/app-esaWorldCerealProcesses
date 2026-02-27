import { fetchWithSessions } from '@features/(auth)/_ssr/handlers.sessionFetch';
import { NextRequest, NextResponse } from 'next/server';
import getNamespaceByProcessId from '@features/(processes)/_utils/namespaceByProcessId';
import { handleRouteError } from '@features/(shared)/errors/handlers.errorInRoute';
import { ErrorBehavior } from '@features/(shared)/errors/enums.errorBehavior';
import { BaseHttpError } from '@features/(shared)/errors/models.error';
import getBoundaryDates from '@features/(processes)/_utils/boundaryDates';
import { transformDate } from '@features/(processes)/_utils/transformDate';
import { getRequireSessionId } from '@features/(auth)/_utils/requireSessionId';
import { customProductsPostprocessMethods, customProductsProductTypes } from '@features/(processes)/_constants/app';
import { loggyError, loggyWarn } from '@gisatcz/ptr-be-core/node';

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

		const bbox = searchParams.get('bbox');
		const outputFileFormat = searchParams.get('outputFileFormat');
		const endDate = searchParams.get('endDate');
		const processId = searchParams.get('product');
		const model = searchParams.get('model');
		const orbitState = searchParams.get('orbitState');
		const postprocessMethod = searchParams.get('postprocessMethod');
		const postprocessKernelSize = searchParams.get('postprocessKernelSize');

		// validate inputs for safe aggregation
		if (!endDate) {
			loggyError('Jobs create from process GET', 'Missing endDate value');
			throw new BaseHttpError('Missing endDate value', 400, ErrorBehavior.SSR);
		}

		if (!bbox) {
			loggyError('Jobs create from process GET', 'Missing bbox value');
			throw new BaseHttpError('Missing bbox value', 400, ErrorBehavior.SSR);
		}

		if (!outputFileFormat) {
			loggyError('Jobs create from process GET', 'Missing outputFileFormat value');
			throw new BaseHttpError('Missing outputFileFormat value', 400, ErrorBehavior.SSR);
		}

		if (!model) {
			loggyError('Jobs create from process GET', 'Missing model value');
			throw new BaseHttpError('Missing model value', 400, ErrorBehavior.SSR);
		}

		// Additional validation for crop type parameters
		if (processId === customProductsProductTypes.cropType) {
			if (!orbitState) {
				loggyError('Jobs create from process GET', 'Missing orbitState for crop type');
				throw new BaseHttpError('Missing orbitState for crop type', 400, ErrorBehavior.SSR);
			}
			if (!postprocessMethod) {
				loggyError('Jobs create from process GET', 'Missing postprocessMethod for crop type');
				throw new BaseHttpError('Missing postprocessMethod for crop type', 400, ErrorBehavior.SSR);
			}
			if (postprocessMethod === customProductsPostprocessMethods.majorityVote && !postprocessKernelSize) {
				loggyError(
					'Jobs create from process GET',
					'Invalid or missing postprocessKernelSize for crop type with majority_vote'
				);
				throw new BaseHttpError(
					'Invalid or missing postprocessKernelSize for crop type with majority_vote',
					400,
					ErrorBehavior.SSR
				);
			}
		}

		// prepare data for the request
		const boundaryDates = getBoundaryDates(new Date(endDate));
		const startDate = transformDate(boundaryDates.startDate);

		const data = {
			processId,
			namespace: getNamespaceByProcessId(processId),
			bbox: bbox.split(',').map(Number),
			crs: 'EPSG:4326',
			timeRange: [startDate, endDate],
			outputFileFormat,
			model,
			...(orbitState && { orbitState }),
			...(postprocessMethod && { postprocessMethod }),
			...(postprocessMethod === customProductsPostprocessMethods.majorityVote && postprocessKernelSize
				? { postprocessKernelSize: Number(postprocessKernelSize) }
				: {}),
		};

		console.log('data', data);

		const openeoUrlPrefix = process.env.OEO_URL;

		if (!openeoUrlPrefix) {
			loggyError('Jobs create from process GET', 'Missing openeo URL variable');
			throw new Error('Missing openeo URL variable');
		}

		const url = `${openeoUrlPrefix}/openeo/jobs/create/from-process`;

		// fetch data with sessions
		const { backendContent, setCookieHeader } = await fetchWithSessions({
			method: 'POST',
			url,
			browserCookies: req.cookies,
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
			requireSessionId: getRequireSessionId(),
		});

		const nextResponse = NextResponse.json(backendContent);

		if (setCookieHeader) {
			nextResponse.headers.set('set-cookie', setCookieHeader);
		}
		return nextResponse;
	} catch (error: any) {
		loggyError('Jobs create from process GET', error);
		const { message, status } = handleRouteError(error);
		const response = NextResponse.json({ error: message }, { status });

		if (status === 401) {
			loggyWarn('Unauthorized', 'User is not authorized to access the resource. Deleting session cookie.');
			response.cookies.delete('sid');
		}

		return response;
	}
}
