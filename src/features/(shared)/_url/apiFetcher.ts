/**
 * Fetches data from the given API endpoint.
 *
 * @param {string} url - The API endpoint.
 * @param {string} [queryParams] - Optional query parameters to include in the request.
 * @param {string} [method] - HTTP method (default: 'GET').
 * @param {object} [body] - Request body for POST/PUT requests.
 * @returns {Promise<any>} The fetched data in JSON format.
 */
export const apiFetcher = (url: string, queryParams?: string, method?: string, body?: object) => {
	const fullUrl = queryParams ? `${url}?${queryParams}` : url;
	const options: RequestInit = {};
	if (method && method !== 'GET') {
		options.method = method;
		if (body) {
			options.headers = { 'Content-Type': 'application/json' };
			options.body = JSON.stringify(body);
		}
	}
	return fetch(fullUrl, options).then((r) => r.json());
};
