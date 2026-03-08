import { fetchWithSessions } from '@features/(auth)/_ssr/handlers.sessionFetch';
import { handleRouteError } from '@features/(shared)/errors/handlers.errorInRoute';
import { NextRequest, NextResponse } from 'next/server';

const handleSeasonsRequest = async (request: NextRequest) => {
	try {
		let bbox: number[];
		let epsg: number;

		if (request.method === 'POST') {
			const body = await request.json();
			bbox = body.bbox;
			epsg = body.epsg;
		} else {
			const searchParams = request.nextUrl.searchParams;
			const bboxStr = searchParams.get('bbox');
			const epsgStr = searchParams.get('epsg');

			if (!bboxStr || !epsgStr) {
				return NextResponse.json({ error: 'Missing required parameters: bbox and epsg are required' }, { status: 400 });
			}

			bbox = bboxStr.split(',').map(Number);
			epsg = Number(epsgStr);
		}

		if (!bbox || !epsg) {
			return NextResponse.json({ error: 'Missing required parameters: bbox and epsg are required' }, { status: 400 });
		}

		if (isNaN(epsg)) {
			return NextResponse.json({ error: 'Invalid epsg code' }, { status: 400 });
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
				const date = new Date(dateStr);
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, '0');
				const day = String(date.getDate()).padStart(2, '0');
				return `${year}-${month}-${day}`;
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
