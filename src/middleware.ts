import { fetchWithSessions } from "@features/(auth)/_ssr/handlers.sessionFetch";
import { handleRouteError } from "@features/(shared)/errors/handlers.errorInRoute";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";


// NextJS Cache controls
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

// Middleware configuration
// This middleware will run on all paths except for the ones listed below
export const config = {
  matcher: "/((?!api|_next|static|favicon.ico).*)",
};

/**
 * Next.js middleware function for session validation and authentication.
 * This middleware checks for session cookies, validates them, and refreshes them as needed.
 *
 * @param request - The incoming Next.js request object
 * @returns A Next.js response object with appropriate authentication handling
 * @throws Error if PID_URL environment variable is missing or session refresh fails
 */
export async function middleware(request: NextRequest) {
  try {

    // get the session ID from the request cookies
    const sid = request.cookies.get("sid");

    // allowed paths without session
    const allowedPaths = ["/"];

    // if no session ID is found, check if the current path is allowed
    if (!sid) {

      if (!allowedPaths.includes(request.nextUrl.pathname)) {
        return NextResponse.rewrite(new URL("/", request.nextUrl));
      }

      return NextResponse.next();
    }

    // session refresh auth URL
    const identityUrl = process.env.PID_URL;

    if (!identityUrl)
      throw new Error("Missing PID_URL environment variable");

    const refreshUrl = `${identityUrl}/sessions/refresh`;

    // build cookie domain of the backend app
    const { setCookieHeader } = await fetchWithSessions({
      method: "HEAD",
      url: refreshUrl,
      browserCookies: request.cookies,
      requireSessionId: true,
    });

    if (!setCookieHeader)
      throw new Error("Fetch response with new session cookie missing");

    // prepare NextJS response with recived cookies including new SID
    const response = NextResponse.next();

    // Remove the old SID cookie and set the new one
    response.cookies.delete("sid");
    response.headers.set("set-cookie", setCookieHeader);

    // Return the response
    return response;
  } catch (error: any) {

    const { message, status } = handleRouteError(error)

    // Log the error message
    console.warn("Error in middleware", message, status);

    // Redirect to the logout endpoint if the session is invalid or refresh failed
    const logoutUrl = new URL("/api/auth/logout", request.nextUrl);
    const redirect = NextResponse.rewrite(logoutUrl);
    redirect.cookies.delete("sid");

    return redirect;
  }
}
