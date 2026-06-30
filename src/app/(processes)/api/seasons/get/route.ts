import { fetchWithSessions } from '@features/(auth)/_ssr/handlers.sessionFetch';
import { handleRouteError } from "@gisatcz/ptr-fe-core/globals";
import { NextRequest, NextResponse } from 'next/server';
import { seasonsParamsSchema } from '@features/(processes)/_constants/validation';

const handleSeasonsRequest = async (request: NextRequest) => {
	try {
		let bbox: number[];
		let epsg: number;

		if (request.method === 'POST') {
			const body = await request.json();
			if (Array.isArray(body.bbox)) {
				body.bbox = body.bbox.join(',');
			}
			const result = seasonsParamsSchema.safeParse(body);
			if (!result.success) {
				return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
			}
			bbox = result.data.bbox.split(',').map(Number);
			epsg = result.data.epsg;
		} else {
			const searchParams = request.nextUrl.searchParams;
			const result = seasonsParamsSchema.safeParse({
				bbox: searchParams.get('bbox') ?? '',
				epsg: searchParams.get('epsg') ?? '',
			});
			if (!result.success) {
				return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
			}
			bbox = result.data.bbox.split(',').map(Number);
			epsg = result.data.epsg;
		}

		const openeoUrlPrefix = process.env.OEO_URL;
		if (!openeoUrlPrefix) {
			throw new Error('Missing openeo URL variable');
		}

		const backendUrl = `${openeoUrlPrefix}/worldcereals/seasons`;

		const { backendContent } = await fetchWithSessions({
			method: 'POST',
			url: backendUrl,
			browserCookies: request.cookies,
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				bbox: bbox,
				epsg: epsg,
			}),
			requireSessionId: false,
		});

		const transformedSeasons = Object.entries(backendContent).map(([id, dates]) => {
			const [startDateFull, endDateFull] = dates as [string, string];
			const formatDate = (dateStr: string) => {
				// Extract YYYY-MM-DD using regex to avoid timezone issues
				// Handles formats like: "2021-03-01 00:00:00", "2021-03-01T00:00:00", "2021-03-01T00:00:00.000000"
				const match = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
				if (match) {
					return `${match[1]}-${match[2]}-${match[3]}`;
				}
				// Fallback: try parsing as date
				const date = new Date(dateStr);
				if (!isNaN(date.getTime())) {
					const y = date.getUTCFullYear();
					const m = String(date.getUTCMonth() + 1).padStart(2, '0');
					const d = String(date.getUTCDate()).padStart(2, '0');
					return `${y}-${m}-${d}`;
				}
				return dateStr;
			};
			return {
				id,
				startDate: formatDate(startDateFull),
				endDate: formatDate(endDateFull),
			};
		});

		return NextResponse.json(transformedSeasons);
	} catch (error: any) {
		const { message, status } = handleRouteError(error);
		return NextResponse.json({ error: message, details: error?.message }, { status });
	}
};

export async function GET(request: NextRequest) {
	return handleSeasonsRequest(request);
}

export async function POST(request: NextRequest) {
	return handleSeasonsRequest(request);
}
