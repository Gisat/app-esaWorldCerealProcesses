import { ServerError, messageFromError } from '@gisatcz/ptr-be-core/node';

/**
 * Fetch to backend service to retrieve session cookies/ID
 * @param endpointUrl - Endpoint URL
 * @param body - Body for POST request
 * @param method - Optional method for fetch request (default: POST)
 * @returns Object with cookie header, session id and backend content
 */
export const fetchForCookies = async (endpointUrl: string, body: unknown, method = 'POST') => {
	try {
		console.log(`[fetchForCookies] Fetching from: ${method} ${endpointUrl}`);

		// execute fetch request
		const response = await fetch(endpointUrl as string, {
			method,
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		});

		console.log(`[fetchForCookies] Response status: ${response.status}`);

		if (!response.ok) {
			const errorBody = await response.text();
			console.error(`[fetchForCookies] Fetch failed with status ${response.status}: ${errorBody}`);
			throw new ServerError(`Fetch failed with status ${response.status}: ${errorBody}`);
		}

		// get session cookie from response
		const setCookieHeader = response.headers.get('set-cookie');

		// get body for session id parameter
		const backendContent = await response.json();
		const sessionId = backendContent?.session_id;

		// check for session information
		if (!setCookieHeader && !sessionId) {
			console.error('[fetchForCookies] Missing session information in response');
			throw new ServerError('Missing session information in response (cookie or body)');
		}

		// return cookie header
		return {
			setCookieHeader,
			sessionId,
			backendContent,
		};
	} catch (error: unknown) {
		console.error(`[fetchForCookies] Error during session fetch: ${messageFromError(error)}`);
		throw new ServerError(`Session Fetch Error: ${messageFromError(error)}`);
	}
};
