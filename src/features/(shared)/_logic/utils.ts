
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
	return fetch(`${url}?${queryParams}`, { credentials: 'include' }).then(r => r.json());
}

export const truncateUrl = (url: string, maxLength = 31): string => {
	if (url.length <= maxLength) return url;
	try {
		const urlObj = new URL(url);
		const filename = urlObj.pathname.split('/').filter(Boolean).pop() || '';
		const prefix = `${urlObj.protocol}//${urlObj.hostname}/.../`;
		if ((prefix + filename).length <= maxLength) return prefix + filename;
		const avail = maxLength - prefix.length - 3;
		if (avail > 10) {
			return `${prefix}${filename.slice(0, Math.max(1, avail - 10))}...${filename.slice(-10)}`;
		}
	} catch {
		/* not a valid URL */
	}
	const mid = Math.floor((maxLength - 3) / 2);
	return url.slice(0, mid) + '...' + url.slice(-(maxLength - mid - 3));
};

export const truncateMiddle = (text: string, maxLength = 40): string => {
	if (text.length <= maxLength) return text;
	const keep = Math.floor((maxLength - 3) / 2);
	return text.slice(0, keep) + '...' + text.slice(-(maxLength - keep - 3));
};

/**
 * Fetches data from the given URL.
 * @param {string} url - The URL to fetch data from.
 * @returns {Promise<any>} - The fetched data.
 */
export const fetcher = (url: string) => {
	return fetch(`${url}`, { credentials: 'include' }).then(r => r.json());
}
