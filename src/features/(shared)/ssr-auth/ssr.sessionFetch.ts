import { Nullable, ServerError, AuthorizationError } from '@gisatcz/ptr-be-core/node';

// Define the interface for the properties of the fetchWithSessions function
interface FetchWithBrowserSessionProps {
    method: 'GET' | 'POST';
    url: string;
    browserCookies: any;
    body?: object;
    headers?: any;
    requireSessionId: boolean;
}

// Define the interface for the response of the fetchWithSessions function
interface FetchWithSessionsResponse {
    status: number;
    backendContent: Nullable<any>;
    setCookieHeader: Nullable<string>;
}

/**
 * Fetch from API handler to backend service with session ID included in cookies
 * @param props - Configuration properties for the session fetch
 * @param props.method - HTTP method (GET or POST)
 * @param props.url - URL of target endpoint
 * @param props.browserCookies - Cookies from browser request (SPA part of Next)
 * @param props.body - Optional request body
 * @param props.headers - Optional request headers
 * @param props.requireSessionId - Whether to require a session ID
 * @returns Response object containing status, content, and potential cookie header
 */
export const fetchWithSessions = async (props: FetchWithBrowserSessionProps): Promise<FetchWithSessionsResponse> => {
    const { url, browserCookies, method, body, headers } = props;

    // Check if the URL is provided
    if (!url)
        throw new ServerError('Missing URL for session fetch');

    // Get the session cookie from the browser cookies
    const sessionCookie = (browserCookies as any).get('sid');

    // Check if the session cookie is required but missing
    if (!sessionCookie && props.requireSessionId)
        throw new AuthorizationError();

    // Add the session cookie to the headers if it exists
    const headersWithCookies = sessionCookie
        ? { ...headers, Cookie: `${sessionCookie.name}=${sessionCookie.value}` }
        : { ...headers };

    // Make the fetch request to the backend
    const response = await fetch(url, {
        method,
        body: body ? JSON.stringify(body) : undefined,
        headers: headersWithCookies,
    });

    // Parse the response from the backend
    const backendContent = await response.json();

    // Check if the response is successful
    if (response.ok) {
        const setCookieHeader = response.headers.get('set-cookie');

        // Check if the set-cookie header is missing when a session ID is required
        if (!setCookieHeader && props.requireSessionId) {
            console.error('Sessions Fetch: Missing cookies with SID');

            throw new ServerError('Fetch response with new session cookie missing');
        }

        // Return the response status, content, and set-cookie header
        return { status: response.status, backendContent, setCookieHeader };
    } else {
        console.error('Error in fetchWithSessions', response.status, backendContent);
        throw new ServerError(backendContent);
    }
};
