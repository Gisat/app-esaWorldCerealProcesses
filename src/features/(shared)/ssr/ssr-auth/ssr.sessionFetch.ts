import { Nullable, ServerError, AuthorizationError } from '@gisatcz/ptr-be-core/node';
import { UsedAuthCookies, UsedAuthHeaders } from './enums.auth';

// Define the interface for the properties of the fetchWithSessions function
interface FetchWithBrowserSessionProps {
    method: 'GET' | 'POST';
    url: string;
    browserCookies: any;
    explicitSessionId?: string;
    body?: object;
    headers?: any;
    requireSessionId: boolean;
}

// Define the interface for the response of the fetchWithSessions function
interface FetchWithSessionsResponse {
    status: number;
    backendContent: Nullable<any>;
    sessionId: Nullable<string>;
}

/**
 * Fetch from API handler to backend service with session ID forwarded in headers.
 * @param url URL of target endpoint
 * @param browserCookies Cookies from browser request (SPA part of Next)
 * @param headers Optional - any headers added to request
 * @returns Response from backend back to Next API route handler
 */
export const fetchWithSessions = async (props: FetchWithBrowserSessionProps): Promise<FetchWithSessionsResponse> => {
    const { url, browserCookies, explicitSessionId, method, body, headers } = props;

    // Check if the URL is provided
    if (!url)
        throw new ServerError('Missing URL for session fetch');

    // Define used Session If for BE fetch
    // If user defined SID explicitly, use it
    // Otherwise use SID from cookies (browser provided to Next Route)
    const sessionCookie = (browserCookies as any).get(UsedAuthCookies.SESSION_ID);
    const usedSessionId = explicitSessionId ?? sessionCookie?.value;

    // Check if the session cookie is required but missing
    if (!usedSessionId && props.requireSessionId)
        throw new AuthorizationError();

    // Forward the browser session to backend using a dedicated session header.
    const headersWithSessionId = usedSessionId
        ? { ...headers, [UsedAuthHeaders.SESSION_ID]: usedSessionId }
        : { ...headers };

    // Make the fetch request to the backend
    const response = await fetch(url, {
        method,
        body: body ? JSON.stringify(body) : undefined,
        headers: headersWithSessionId,
    });

    // Parse the response from the backend
    const backendContent = await response.json();

    // Check if the response is successful
    if (response.ok) {
        const updatedSessionId = response.headers.get(UsedAuthHeaders.SESSION_ID);

        // Check if the session header is missing when a session ID is required
        if (!updatedSessionId && props.requireSessionId) {
            console.error('Sessions Fetch: Missing session header with SID');

            throw new ServerError('Fetch response with new session header missing');
        }

        // Return the response status, content, and refreshed session ID.
        return { status: response.status, backendContent, sessionId: updatedSessionId };
    } else {
        console.error('Error in fetchWithSessions', response.status, backendContent);
        throw new ServerError(backendContent);
    }
};
