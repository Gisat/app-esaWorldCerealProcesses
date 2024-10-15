
import { Issuer } from "openid-client";
import { Unsure } from "../../(shared)/_logic/types.universal";

/**
 * OpenID Connect functional context (as server side JS closure)
 * @returns Set of functions to handle OpenID (OAuth2) operations using official openid library with server side environments
 */
export function authContext(clientId: Unsure<string>, issuerUrl: Unsure<string>, redirectUrl: Unsure<string>) {
    /**
     * Read server side environment values and validate them
     * @returns 
     */
    const oidAuthEvironments = () => {

        if (!issuerUrl)
            throw new Error("Missing OID issuer URL");


        if (!clientId)
            throw new Error("Missing OID client ID");


        if (!redirectUrl)
            throw new Error("Missing OID redirect url back to this app (OAuth2 callback path)")

        return {
            issuerUrl,
            clientId,
            redirectUrl
        }
    }

    /**
     * Creates the active client for OpenID operations
     * @returns OpenID set up client ready to be used
     */
    async function oidSetupClient() {
        const oidEnvironments = oidAuthEvironments()
        const oidIssuer = await Issuer.discover(oidEnvironments.issuerUrl)

        const oidClient = new oidIssuer.Client({
            client_id: oidEnvironments.clientId,
            redirect_uris: [oidEnvironments.redirectUrl],
            response_types: ["code"],
            token_endpoint_auth_method: "none"
        })

        return oidClient
    }

    /**
     * Exported handler for authorisation process usinf OpenID Connect code flow
     */
    async function handleInternalKeycloak() {
        const oidClient = await oidSetupClient()
        const url = oidClient.authorizationUrl({
            scope: "email",
        })
        return url
    }

    /**
     * Obtain tokens from redirect by sending OAuth2 code back to issuer
     * @param params Use NextRequest
     * @param urlOrigin Origin of the URL from callback route
     * @returns Tokens from the IAM
     */
    async function handleAuthCallback(params: any) {
        const oidClient = await oidSetupClient()

        const callbackParams = oidClient.callbackParams(params)

        const tokens = await oidClient.oauthCallback(oidAuthEvironments().redirectUrl, callbackParams)

        return tokens
    }

    return {
        handleInternalKeycloak,
        handleAuthCallback
    }
}
