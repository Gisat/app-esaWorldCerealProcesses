import { Nullable } from "../_logic/types.universal";

interface FetchWithBrowserSessionProps {
  method: "GET" | "POST",
  url: string,
  browserCookies: any,
  body?: any,
  headers?: any
}

interface FetchWithSessionsResponse {
  status: number,
  backendContent: Nullable<any>
  setCookieHeader: Nullable<string>
}

/**
 * Fetch from API handler to backend service with session ID included in cookies
 * @param url URL of target endpoint
 * @param browserCookies Cookies from browser request (SPA part of Next)
 * @param headers Optional - any headers added to request
 * @returns Response from backend back to Next API route handler
 */
export const fetchWithSessions = async (props: FetchWithBrowserSessionProps): Promise<FetchWithSessionsResponse> => {
  const {
    url, browserCookies, method, body, headers
  } = props

  if (!url)
    throw new Error("Missing URL for session fetch");

  const sessionCookie = (browserCookies as any).get('sid');

  if (!sessionCookie)
    throw new Error("Missing session from browser");

  const response = await fetch(
    url,
    {
      method,
      body,
      headers: {
        ...headers,
        'Cookie': `${sessionCookie.name}=${sessionCookie.value}`,
      }
    }
  );

  if (response.ok) {
    const backendContent = await response.json()
    const setCookieHeader = response.headers.get('set-cookie');

    return { status: response.status, backendContent, setCookieHeader }
  }

  else return { status: response.status, backendContent: null, setCookieHeader: null }
}