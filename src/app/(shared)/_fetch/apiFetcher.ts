/**
 * Fetches data from the given API endpoint.
 *
 * @param {string} url - The API endpoint.
 * @param {string} [queryParams] - Optional query parameters to include in the request.
 * @returns {Promise<any>} The fetched data in JSON format.
 */
export const apiFetcher = (url: string, queryParams?: string) => {
  const fullUrl = queryParams ? `${url}?${queryParams}` : url;
  return fetch(fullUrl).then((r) => r.json());
};
