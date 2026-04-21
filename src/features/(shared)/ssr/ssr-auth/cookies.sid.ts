import { NextResponse } from "next/server";
import { UsedAuthCookies } from "./enums.auth";

/**
 * Add session id as same site http only cookie
 * @param sessionId SID value from source
 * @param nextResponse NextJS response
 */
export const nextSetSessionIdCookie = (sessionId: unknown, nextResponse: NextResponse) => {
    if (!sessionId) {
        throw new Error('Missing session ID in cookie setup');
    }
    nextResponse.cookies.delete(UsedAuthCookies.SESSION_ID);
    nextResponse.cookies.set(UsedAuthCookies.SESSION_ID, sessionId as string, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
    });
}
