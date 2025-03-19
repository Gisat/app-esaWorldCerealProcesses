import { fetchWithSessions } from "@features/(auth)/_ssr/handlers.sessionFetch";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Middleware function for handling authentication session refresh in Next.js.
 * 
 * This middleware attempts to refresh the user's session by:
 * 1. Making a request to the identity provider's session refresh endpoint
 * 2. Retrieving a new session ID (SID) from the response
 * 3. Setting the new session cookie in the response headers
 * 
 * If the session refresh fails for any reason (invalid session, missing environment variables, 
 * network errors, etc.), the user is redirected to the logout endpoint and their
 * existing session cookie is deleted.
 * 
 * @param request - The incoming Next.js request object
 * @returns A NextResponse object with either:
 *   - The original response with updated session cookies if refresh was successful
 *   - A redirect to the logout endpoint if refresh failed
 * 
 * @throws No exceptions are thrown externally as they're caught internally and handled by redirecting to logout
 */
export async function middleware(request: NextRequest) {
  try {
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

    console.warn("Error in middleware", error);

    // Redirect to the logout endpoint if the session is invalid or refresh failed
    const redirect = NextResponse.redirect(new URL("/api/auth/logout", request.url));
    redirect.cookies.delete("sid");

    return redirect;
  }
}


// TODO: Old version
// /**
//  * Middleware function to check the login status of a user.
//  *
//  * This function intercepts incoming requests and verifies if the user is logged in
//  * by making a request to the `/api/auth/user-info` endpoint. If the user is not logged in
//  * and the request is not for the `/` page, the user is redirected to the `/` page.
//  *
//  * @param {NextRequest} request - The incoming request object.
//  * @returns {Promise<NextResponse>} - The response object, either allowing the request to proceed
//  *                                    or redirecting the user to the `/` page.
//  */
// export async function middleware(request: NextRequest) {
//   const userInfoUrl = `${request.nextUrl.origin}/api/auth/user-info`;
//   const cookies = request.headers.get("cookie") || "";

//   // Checking login status for request:
//   const loggedIn = await isUserLoggedIn(userInfoUrl, cookies);

//   if (!loggedIn && request.nextUrl.pathname !== "/") {
//     // Redirection to root page /
//     return NextResponse.redirect(new URL("/", request.url));
//   }

//   if (loggedIn && request.nextUrl.pathname == "/") {
//     // Redirection to root page /
//     return NextResponse.redirect(new URL("/home", request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: "/((?!api|_next|static|favicon.ico).*)",
// };
