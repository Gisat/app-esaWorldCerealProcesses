
interface FetchWithBrowserSessionProps {
  method: "GET" | "POST",
  url: string,
  browserCookies: any,
  body?: any,
  headers?: any
}

/**
 * Fetch from API handler to backend service with session ID included in cookies
 * @param url URL of target endpoint
 * @param browserCookies Cookies from browser request (SPA part of Next)
 * @param headers Optional - any headers added to request
 * @returns Response from backend back to Next API route handler
 */
export const fetchWithSessions = async (props: FetchWithBrowserSessionProps) => {
  const {url, browserCookies, method, body, headers
  } = props

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

  return response // TODO: Return also SID from response
}