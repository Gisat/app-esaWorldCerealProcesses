import { NextRequest, NextResponse } from "next/server";
import { authContext } from "../../../_ssr/handlers.auth";
import JWT from "jsonwebtoken";
import { IAM_CONSTANTS } from "../../../_logic/models.auth";
import { pages } from "@/constants/app";

export const dynamic = "force-dynamic";
export async function GET(req: NextRequest) {
  try {
    // environment parameters
    const issuerUrl = process.env.OID_IAM_ISSUER_URL;
    const redirectUrl = process.env.OID_SELF_REDIRECT_URL;
    const clientId = process.env.CLIENT_ID;

    // get auth context and handle tokens from IAM
    const auth = authContext(clientId, issuerUrl, redirectUrl);
    const tokenSet = await auth.handleAuthCallback(req);

    // TODO: save tokens to bakcend and return session ID to return to FE in cookie
    //....
    //

    // TODO: This code just for demo
    const decoded = JWT.decode(tokenSet.access_token as string);
    const emailValue = (decoded as any)["email"];

    // Calculate the expiration date
    const date = new Date();
    date.setTime(date.getTime() + (1 * 24 * 60 * 60 * 1000)); // days to milliseconds
    const expires = date;

    // build redirect back to frontend
    // add auth result as cookie
    const parsedUrl = new URL(process.env.OID_SELF_REDIRECT_URL as string);
    const url = `${parsedUrl.protocol}//${parsedUrl.host}/${pages.processesList.url}`;
    const feRedirect = NextResponse.redirect(url);
    feRedirect.cookies.set(IAM_CONSTANTS.Cookie_Email, emailValue, {
      httpOnly: false, //TODO: Change for token values or sessions
      secure: false,
      expires: expires,
      path: "/"
    });

    return feRedirect;
  } catch (error: any) {
    return NextResponse.json({ error: error["message"] });
  }
}
