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
		const endDate = searchParams.get('endDate');
		const processId = searchParams.get('product');
		const model = searchParams.get('model');
		const orbitState = searchParams.get('orbitState');
		const postprocessMethod = searchParams.get('postprocessMethod');
		const postprocessKernelSize = searchParams.get('postprocessKernelSize');
		const seasonWindowsParam = searchParams.get('seasonWindows');
		const seasonIdsParam = searchParams.get('seasonIds');
		// New Crop Type params
		const enableCroplandHeadParam = searchParams.get('enableCroplandHead');
		const landcoverHeadZip = searchParams.get('landcoverHeadZip');
		const croptypeHeadZip = searchParams.get('croptypeHeadZip');
		const maskCroplandParam = searchParams.get('maskCropland');
		const postprocessMethodCropland = searchParams.get('postprocessMethodCropland');
		const postprocessKernelSizeCropland = searchParams.get('postprocessKernelSizeCropland');
		// Cropland Extent params (reuses postprocessMethod / postprocessKernelSize)

		// validate inputs for safe aggregation
		if (!endDate) {
			loggyError('Jobs create from process GET', 'Missing endDate value');
			throw new BaseHttpError('Missing endDate value', 400, ErrorBehavior.SSR);
		}

		if (!bbox) {
			loggyError('Jobs create from process GET', 'Missing bbox value');
			throw new BaseHttpError('Missing bbox value', 400, ErrorBehavior.SSR);
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
			if (postprocessKernelSize !== null && postprocessMethod === customProductsPostprocessMethods.majorityVote) {
				const parsedSize = Number(postprocessKernelSize);
				if (isNaN(parsedSize) || parsedSize < 1 || parsedSize > 25 || parsedSize % 2 === 0) {
					loggyError(
						'Jobs create from process GET',
						'Invalid postprocessKernelSize for crop type with majority_vote'
					);
					throw new BaseHttpError(
						'Invalid postprocessKernelSize: must be an odd integer between 1 and 25',
						400,
						ErrorBehavior.SSR
					);
				}
			}
		}

		// prepare data for the request
		// Parse date as local time to avoid timezone issues
		const [year, month, day] = endDate.split('-').map(Number);
		const endDateAsLocal = new Date(year, month - 1, day);
		const boundaryDates = getBoundaryDates(endDateAsLocal);
		const startDate = transformDate(boundaryDates.startDate);
		const transformedEndDate = transformDate(boundaryDates.endDate);

		// Parse boolean params
		const enableCroplandHead = enableCroplandHeadParam !== null ? enableCroplandHeadParam === 'true' : undefined;
		const maskCropland = maskCroplandParam !== null ? maskCroplandParam === 'true' : undefined;

		const data = {
			processId,
			namespace: getNamespaceByProcessId(processId),
			bbox: bbox.split(',').map(Number),
			crs: 'EPSG:4326',
			timeRange: [startDate, transformedEndDate],
			seasonWindows,
			seasonIds,
			model,
			...(orbitState && { orbitState }),
			...(postprocessMethod && { postprocessMethod }),
			...(postprocessMethod === customProductsPostprocessMethods.majorityVote && postprocessKernelSize
				? { postprocessKernelSize: Number(postprocessKernelSize) }
				: {}),
			// New Crop Type params
			...(enableCroplandHead !== undefined && { enableCroplandHead }),
			...(enableCroplandHead && landcoverHeadZip ? { landcoverHeadZip } : {}),
			...(croptypeHeadZip ? { croptypeHeadZip } : {}),
			...(maskCropland !== undefined && enableCroplandHead ? { maskCropland } : {}),
			...(postprocessMethodCropland && enableCroplandHead ? { postprocessMethodCropland } : {}),
			...(postprocessMethodCropland === customProductsPostprocessMethods.majorityVote && postprocessKernelSizeCropland && enableCroplandHead
				? { postprocessKernelSizeCropland: Number(postprocessKernelSizeCropland) }
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
