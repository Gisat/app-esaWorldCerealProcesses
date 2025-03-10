import { isUserLoggedIn } from "@features/(shared)/_utils/auth";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Middleware function to check the login status of a user.
 *
 * This function intercepts incoming requests and verifies if the user is logged in
 * by making a request to the `/api/auth/user-info` endpoint. If the user is not logged in
 * and the request is not for the `/` page, the user is redirected to the `/` page.
 *
 * @param {NextRequest} request - The incoming request object.
 * @returns {Promise<NextResponse>} - The response object, either allowing the request to proceed
 *                                    or redirecting the user to the `/` page.
 */
export async function middleware(request: NextRequest) {
  const userInfoUrl = `${request.nextUrl.origin}/api/auth/user-info`;
  const cookies = request.headers.get("cookie") || "";

  // Checking login status for request:
  const loggedIn = await isUserLoggedIn(userInfoUrl, cookies);

  if (!loggedIn && request.nextUrl.pathname !== "/") {
    // Redirection to root page /
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (loggedIn && request.nextUrl.pathname == "/") {
    // Redirection to home page
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|_next|static|favicon.ico).*)",
};
