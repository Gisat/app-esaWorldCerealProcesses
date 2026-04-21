/**
 * Enum for authentication-related cookie names used throughout the application.
 */
export enum UsedAuthCookies {
	/** State parameter for OIDC flow validation */
	OIDC_STATE = 'oidc_state',
	/** PKCE code verifier for OAuth2 authorization code flow */
	OIDC_PKCE_CODE_VERIFIER = 'oidc_pkce_code_verifier',
	/** Nonce parameter for OIDC flow validation */
	OIDC_NONCE = 'oidc_nonce',
	/** URL to return to after successful authentication */
	AUTH_RETURN_URL = 'auth_return_url',
	/** Session ID cookie from the Panther backend */
	SESSION_ID = 'sid',
}

export enum UsedAuthHeaders {
	/** Session ID propagated from Next server handlers to backend services */
	SESSION_ID = 'x-session-id',
}
