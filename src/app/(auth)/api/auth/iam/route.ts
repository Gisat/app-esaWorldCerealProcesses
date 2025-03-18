import { NextResponse } from "next/server";
import { authContext } from "@features/(auth)/_ssr/handlers.auth";
import { handleRouteError } from "@features/(shared)/errors/handlers.errorInRoute";

export const dynamic = "force-dynamic";
export async function GET() {
  try {
    // environment parameters
    const issuerUrl = process.env.OID_IAM_ISSUER_URL;
    const redirectUrl = process.env.OID_SELF_REDIRECT_URL;
    const clientId = process.env.OID_CLIENT_ID;

    // get auth context and handle tokens from IAM
    const auth = authContext(clientId, issuerUrl, redirectUrl);

    // redirect to authorisation
    const authorizationReadyUrl = await auth.handleInternalKeycloak();
    return NextResponse.redirect(authorizationReadyUrl);
  } catch (error: any) {
    const { message, status } = handleRouteError(error)
    const response = NextResponse.json({ error: message }, { status })

    if (status === 401)
      response.cookies.delete("sid")

    return response

  }
}
