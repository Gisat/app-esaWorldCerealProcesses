import { fetchWithSessions } from '@features/(auth)/_ssr/handlers.sessionFetch';
import { NextRequest, NextResponse } from 'next/server';
import getNamespaceByProcessId from '@features/(processes)/_utils/namespaceByProcessId';
import { handleRouteError } from "@gisatcz/ptr-fe-core/globals";
import { ErrorBehavior } from "@gisatcz/ptr-fe-core/globals";
import { BaseHttpError } from "@gisatcz/ptr-fe-core/globals";
import getBoundaryDates from '@features/(processes)/_utils/boundaryDates';
import { transformDate } from '@features/(processes)/_utils/transformDate';
import { getRequireSessionId } from '@features/(auth)/_utils/requireSessionId';
import { customProductsPostprocessMethods, customProductsProductTypes } from '@features/(processes)/_constants/app';
import { UsedAuthCookies } from '@features/(shared)/ssr/ssr-auth/enums.auth';
import { loggyError, loggyWarn } from '@gisatcz/ptr-be-core/node';

/**
 * Handles the GET request to create a job from a process.
 *
 * @param {NextRequest} req - The incoming request object.
 * @returns {Promise<NextResponse>} - The response object.
 */
export async function GET(req: NextRequest) {
	try {
		const secureCookie = req.nextUrl.protocol === 'https:';

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
		const seasonWindowsParam = searchParams.get('seasonWindows');
		const seasonIdsParam = searchParams.get('seasonIds');

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

		if (!seasonWindowsParam) {
			loggyError('Jobs create from process GET', 'Missing seasonWindows value');
			throw new BaseHttpError('Missing seasonWindows value', 400, ErrorBehavior.SSR);
		}

		let seasonWindows;
		let seasonIds: string[] | undefined;
		try {
			seasonWindows = JSON.parse(seasonWindowsParam);
			seasonIds = seasonIdsParam ? JSON.parse(seasonIdsParam) : Object.keys(seasonWindows);
		} catch (error) {
			loggyError('Jobs create from process GET', 'Invalid seasonWindows value');
			throw new BaseHttpError('Invalid seasonWindows value', 400, ErrorBehavior.SSR);
		}

		if (!seasonWindows || typeof seasonWindows !== 'object' || Array.isArray(seasonWindows)) {
			loggyError('Jobs create from process GET', 'Invalid seasonWindows payload shape');
			throw new BaseHttpError('Invalid seasonWindows payload shape', 400, ErrorBehavior.SSR);
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
		// Parse date as local time to avoid timezone issues
		const [year, month, day] = endDate.split('-').map(Number);
		const endDateAsLocal = new Date(year, month - 1, day);
		const boundaryDates = getBoundaryDates(endDateAsLocal);
		const startDate = transformDate(boundaryDates.startDate);
		const transformedEndDate = transformDate(boundaryDates.endDate);

		const data = {
			processId,
			namespace: getNamespaceByProcessId(processId),
			bbox: bbox.split(',').map(Number),
			crs: 'EPSG:4326',
			timeRange: [startDate, transformedEndDate],
			seasonWindows,
			seasonIds,
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
		const { backendContent, sessionId } = await fetchWithSessions({
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

		if (sessionId) {
			nextResponse.cookies.set(UsedAuthCookies.SESSION_ID, sessionId, { httpOnly: true, secure: secureCookie, sameSite: 'lax', path: '/' });
		}
		return nextResponse;
	} catch (error: any) {
		loggyError('Jobs create from process GET', error);
		const { message, status } = handleRouteError(error);
		const response = NextResponse.json({ error: message }, { status });

		if (status === 401) {
			loggyWarn('Unauthorized', 'User is not authorized to access the resource. Deleting session cookie.');
			response.cookies.delete(UsedAuthCookies.SESSION_ID);
		}

		return response;
	}
}
