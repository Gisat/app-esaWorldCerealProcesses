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
import { fromProcessParamsSchema } from '@features/(processes)/_constants/validation';
import { SUPPORTED_OUTPUT_FORMAT } from '@features/(processes)/_constants/defaults';
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
		const title = searchParams.get('title');

		const result = fromProcessParamsSchema.safeParse(Object.fromEntries(searchParams));
		if (!result.success) {
			const firstIssue = result.error.issues[0];
			loggyError('Jobs create from process GET', firstIssue.message);
			throw new BaseHttpError(firstIssue.message, 400, ErrorBehavior.SSR);
		}

		const {
			processId,
			bbox: bboxStr,
			endDate,
			seasonWindows,
			seasonalModelZip,
			orbitState,
			postprocessMethodCroptype,
			postprocessKernelSizeCroptype,
			postprocessMethod,
			postprocessKernelSize,
			postprocessMethodCropland,
			postprocessKernelSizeCropland,
			enableCroplandHead,
			landcoverHeadZip,
			croptypeHeadZip,
			maskCropland,
			customProperties,
		} = result.data;

		// prepare data for the request
		// Parse date as local time to avoid timezone issues
		const [year, month, day] = endDate.split('-').map(Number);
		const endDateAsLocal = new Date(year, month - 1, day);
		const boundaryDates = getBoundaryDates(endDateAsLocal);
		const startDate = transformDate(boundaryDates.startDate);
		const transformedEndDate = transformDate(boundaryDates.endDate);

		const isCropType = processId === customProductsProductTypes.cropType;

		const data = {
			processId,
			namespace: getNamespaceByProcessId(processId),
			bbox: bboxStr.split(',').map(Number),
			crs: 'EPSG:4326',
			timeRange: [startDate, transformedEndDate],
			seasonWindows,
			format: SUPPORTED_OUTPUT_FORMAT,
			...(seasonalModelZip ? { seasonalModelZip } : {}),
			...(title ? { title } : {}),
			...(orbitState && { orbitState }),
			...(isCropType && postprocessMethodCroptype ? { postprocessMethodCroptype } : {}),
			...(isCropType && postprocessMethodCroptype === customProductsPostprocessMethods.majorityVote && postprocessKernelSizeCroptype
				? { postprocessKernelSizeCroptype }
				: {}),
			...(!isCropType && postprocessMethod ? { postprocessMethod } : {}),
			...(!isCropType && postprocessMethod === customProductsPostprocessMethods.majorityVote && postprocessKernelSize
				? { postprocessKernelSize }
				: {}),
			...(enableCroplandHead !== undefined && { enableCroplandHead }),
			...(landcoverHeadZip ? { landcoverHeadZip } : {}),
			...(croptypeHeadZip ? { croptypeHeadZip } : {}),
			...(maskCropland !== undefined && enableCroplandHead ? { maskCropland } : {}),
			...(postprocessMethodCropland && enableCroplandHead ? { postprocessMethodCropland } : {}),
			...(postprocessMethodCropland === customProductsPostprocessMethods.majorityVote && postprocessKernelSizeCropland && enableCroplandHead
				? { postprocessKernelSizeCropland }
				: {}),
			...(customProperties ? { customProperties } : {}),
		};

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
