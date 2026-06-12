import { NextResponse } from "next/server";
import { UsedAuthCookies } from "./enums.auth";

/**
 * Add session id as same site http only cookie
 * @param sessionId SID value from source
 * @param nextResponse NextJS response
 * @param secure Whether to mark the cookie secure
 */
export const nextSetSessionIdCookie = (sessionId: unknown, nextResponse: NextResponse, secure = true) => {
    if (!sessionId) {
        throw new Error('Missing session ID in cookie setup');
    }
    nextResponse.cookies.delete(UsedAuthCookies.SESSION_ID);
    nextResponse.cookies.set(UsedAuthCookies.SESSION_ID, sessionId as string, {
        httpOnly: true,
        secure,
        sameSite: 'lax',
        path: '/',
    });
}
