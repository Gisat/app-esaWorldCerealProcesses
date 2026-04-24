import { UsedAuthCookies, UsedAuthHeaders } from './enums.auth';

interface LogoutFetchProps {
	logoutUrl: string;
	browserCookies: any;
}

/**
 * Fetch from API handler to backend service with session ID forwarded in headers.
 * @param logoutUrl URL of target logout endpoint
 * @param browserCookies Cookies from browser request (SPA part of Next)
 * @returns Response from backend back to Next API route handler
 */
export const fetchLogoutNotification = async (props: LogoutFetchProps): Promise<void> => {
	const { browserCookies, logoutUrl } = props;

	// get session cookie from browser
	const sessionCookie = (browserCookies as any).get(UsedAuthCookies.SESSION_ID);
	const sessionId = sessionCookie?.value;

	if (!sessionId) console.warn('Logout: Missing SID from browser');

	const headers = sessionId
		? { [UsedAuthHeaders.SESSION_ID]: sessionId }
		: undefined;

	// make notify GET request to backend for logout
	try {
		const response = await fetch(logoutUrl, {
			method: 'GET',
			headers,
		});

		if (!response.ok) console.warn('Logout: Backend logout failed');
	} catch (error: any) {
		console.warn(`Logout: Backend logout failed: ${error['message']}`);
	}
};
