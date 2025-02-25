
/**
 * Fetch function for SWR
 * @param url where to fetch data
 * @returns 
 */
export const swrFetcher = (url: any) => fetch(url, { 
  redirect: 'manual',  
  credentials: 'include', // Ensure cookies are sent
}).then((res) => res.json())

export const enumToArray = (enumType: any) => Object.values(enumType)

export const enumIncludes = (enumType: any, value: string) => enumToArray(enumType).includes(value)

export const strCapitalizeFirstLetter = (str: string) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

/**
 * Fetches data from the given URL with query parameters.
 * @param {string} url - The URL to fetch data from.
 * @param {string} queryParams - The query parameters.
 * @returns {Promise<any>} - The fetched data.
 */
export const queryFetcher = (url: string, queryParams: string) => {
	return fetch(`${url}?${queryParams}`).then(r => r.json());
}

/**
 * Fetches data from the given URL.
 * @param {string} url - The URL to fetch data from.
 * @returns {Promise<any>} - The fetched data.
 */
export const fetcher = (url: string) => {
	return fetch(`${url}`).then(r => r.json());
}