import { ServerError, messageFromError } from '@gisatcz/ptr-be-core/node';
import { OpenidResultBundle } from './ssr.openid';

/**
 * Fetch from API handler to backend service with value included in cookies
 * @param exchangeEndpointUrl Endpoint URL
 * @param body Body for POST request
 * @param method Optional - method for fetch request
 * @returns Object with cookie header, session id
 */
export const fetchExchangeTokensForSessionId = async (exchangeEndpointUrl: string, openidBundle: OpenidResultBundle) => {
	try {

		//  build and execute fetch for exchange OpenID values for session ID
		const response = await fetch(exchangeEndpointUrl as string, {
			method: "POST",
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(openidBundle),
		});

		console.log(`[fetchForCookies] Response status: ${response.status}`);

		// if the response is not ok, throw custom error and write the cause
		if (!response.ok) {
			const errorBody = await response.text();
			throw new ServerError(`Fetch failed with status ${response.status}: ${errorBody}`);
		}

		// get body for session id parameter
		const backendContent = await response.json();
		const sessionId = backendContent?.session_id;

		// check for session information
		if (!sessionId) {
			console.error('[fetchForCookies] Missing session information in response');
			throw new ServerError('Missing session information in response (cookie or body)');
		}

		// return cookie header
		return {
			sessionId,
		};
	} catch (error: unknown) {
		console.error(`[fetchForCookies] Error during session fetch: ${messageFromError(error)}`);
		throw new ServerError(`Session Fetch Error: ${messageFromError(error)}`);
	}
};
