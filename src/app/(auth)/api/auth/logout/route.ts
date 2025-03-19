import { fetchLogoutNotification } from "@features/(auth)/_ssr/handlers.logoutFetch";
import { handleRouteError } from "@features/(shared)/errors/handlers.errorInRoute";
import { NextRequest, NextResponse } from "next/server";

// NextJS Cache controls
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET(req: NextRequest) {
  try {

    // fetch logout notification for BE
    await fetchLogoutNotification({
      identityServiceUrl: process.env.PID_URL as string,
      browserCookies: req.cookies,
    })

    // url back to FE
    const parsedUrl = new URL(process.env.OID_SELF_REDIRECT_URL as string);
    const selfUrl = `${parsedUrl.protocol}//${parsedUrl.host}/`;

    // prepare redirect back to FE
    const feRedirect = NextResponse.redirect(selfUrl as string);

    // delete cookies from logout
    feRedirect.cookies.delete("sid");

    return feRedirect;

  } catch (error: any) {
      const { message, status } = handleRouteError(error)
      const response = NextResponse.json({ error: message }, { status })
      
      if(status === 401) 
        response.cookies.delete("sid")

      return response
  }
}
