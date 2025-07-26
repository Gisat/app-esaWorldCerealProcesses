import { fetchWithSessions } from '@features/(auth)/_ssr/handlers.sessionFetch';
import { ErrorBehavior } from '@features/(shared)/errors/enums.errorBehavior';
import { handleRouteError } from '@features/(shared)/errors/handlers.errorInRoute';
import { BaseHttpError } from '@features/(shared)/errors/models.error';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

/**
 * Handles the GET request to delete a job by key.
 *
 * @param {NextRequest} req - The incoming request object.
 * @param {Object} params - The parameters object.
 * @param {string} params.key - The key of the job to delete.
 * @returns {Promise<NextResponse>} - The response object.
 */
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ key: string }> }
): Promise<NextResponse> {
  try {
    const { key } = await context.params; // Await params

    // validate inputs for safe aggregation
    if (!key) throw new BaseHttpError('Missing key value', 400, ErrorBehavior.SSR);

    // prepare data for the request
    const data = {
      keys: [key],
    };

    const openeoUrlPrefix = process.env.OEO_URL;

    if (!openeoUrlPrefix) throw new BaseHttpError('Missing openeo URL variable', 400, ErrorBehavior.SSR);

    const url = `${openeoUrlPrefix}/openeo/jobs/delete`;

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
    const { message, status } = handleRouteError(error);
    const response = NextResponse.json({ error: message }, { status });

    if (status === 401) response.cookies.delete('sid');

    return response;
  }
}
