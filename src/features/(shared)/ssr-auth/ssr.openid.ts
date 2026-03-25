import { messageFromError, SSROnlyError, Unsure } from '@gisatcz/ptr-be-core/node';
import * as openid from 'openid-client';

type AuthRequestChecks = {
	pkceCodeVerifier: string;
	state: string;
	nonce: string;
};

type AuthCallbackParams = {
	currentUrl?: URL | string;
	query?: Record<string, unknown>;
	pkceCodeVerifier?: string;
	expectedState?: string;
	expectedNonce?: string;
} | URL | string | undefined;

type AuthCodeResult = {
	authorizationUrl: URL;
	checks: AuthRequestChecks;
};

/**
 * OpenID Connect functional context (as server side JS closure)
 * @param clientId - OpenID Client ID
 * @param issuerUrl - OpenID Issuer URL
 * @param redirectUrl - Redirect URL for callback
 * @param clientSecret - Optional OpenID Client Secret
 * @returns Set of functions to handle OpenID (OAuth2) operations using official openid library with server side environments
 */
export const ssrOpenidContext = (clientId: string, issuerUrl: string, redirectUrl: string, clientSecret?: string) => {

	/**
	 * Creates the active client for OpenID operations
	 * @returns OpenID set up client ready to be used
	 */
	async function oidSetupIssuerConfiguration(): Promise<openid.Configuration> {
		try {

			console.debug('OIDC Setup Issuer Configuration:', { clientId, issuerUrl, redirectUrl });

			// validate environment variables
			if (!issuerUrl)
				throw new SSROnlyError('OIDC ENV: Missing OID issuer URL');

			if (!clientId)
				throw new SSROnlyError('OIDC ENV: Missing OID client ID');

			if (!redirectUrl)
				throw new SSROnlyError('OIDC ENV: Missing OID redirect url back to this app (OAuth2 callback path)');

			// prepare Open ID Issuer client
			const url = new URL(issuerUrl)

			console.debug('OIDC Discovering from URL:', url.toString());

			const config = await openid.discovery(url, clientId, clientSecret);

			console.debug('OIDC Config Complete:', config);

			// return configuration
			return config;
		} catch (error: unknown) {
			console.error('OIDC Setup Error:', error);
			console.error('OIDC Setup Error Message:', messageFromError(error));
			console.error('OIDC Setup Error Stack:', (error instanceof Error) ? error.stack : 'no stack');
			console.error('OIDC Setup Error Type:', (error instanceof Error) ? error.cause : 'no cause');
			throw new SSROnlyError(`OIDC Config Setup: Failed to setup OID client: ${messageFromError(error)}`);
		}
	}

	/**
	 * Handles the initiation of the OpenID flow
	 * @returns Object containing the authorization URL and PKCE checks
	 */
	async function handleUserOpenID(): Promise<AuthCodeResult> {
		try {
			console.debug('OIDC Handle User OpenID');

			const oidConfig = await oidSetupIssuerConfiguration();
			const pkceCodeVerifier = openid.randomPKCECodeVerifier();
			const codeChallenge = await openid.calculatePKCECodeChallenge(pkceCodeVerifier);
			const state = openid.randomState();
			const nonce = openid.randomNonce();

			const parameters: Record<string, string> = {
				redirect_uri: redirectUrl,
				scope: 'openid email',
				code_challenge: codeChallenge,
				code_challenge_method: 'S256',
				state,
				nonce
			}

			console.debug('OIDC Build Authorization URL:', parameters);
			const authorizationUrl = openid.buildAuthorizationUrl(oidConfig, parameters)

			console.debug('OIDC Auth URL:', authorizationUrl.toString());

			return {
				authorizationUrl,
				checks: {
					pkceCodeVerifier,
					state,
					nonce
				}
			};
		} catch (error: unknown) {
			throw new SSROnlyError(`OIDC Build Authorization: Failed to build authorisation URL: ${messageFromError(error)}`);
		}
	}

	function parseCurrentCallbackUrl(params: AuthCallbackParams): URL {
		if (params instanceof URL)
			return params;

		if (typeof params === 'string')
			return new URL(params, redirectUrl);

		if (params && typeof params === 'object' && 'currentUrl' in params && params.currentUrl) {
			const currentUrl = params.currentUrl;
			if (currentUrl instanceof URL)
				return currentUrl;
			if (typeof currentUrl === 'string')
				return new URL(currentUrl, redirectUrl);
		}

		const queryInput = (params && typeof params === 'object')
			? ('query' in params && params.query ? params.query : params)
			: undefined;

		if (!queryInput || typeof queryInput !== 'object')
			throw new SSROnlyError('Missing callback URL or query params from OpenID callback');

		const callbackUrl = new URL(redirectUrl);

		for (const [key, value] of Object.entries(queryInput)) {
			if (typeof value === 'string' && value.length > 0)
				callbackUrl.searchParams.set(key, value);
		}

		if (!callbackUrl.searchParams.has('code') && !callbackUrl.searchParams.has('error'))
			throw new SSROnlyError('Missing OpenID callback query param `code`');

		return callbackUrl;
	}

	/**
	 * Handles the callback from the OpenID provider
	 * @param params - Callback parameters (URL, string, or object)
	 * @param tokenExchangeUrl - URL to exchange the code for tokens
	 * @returns Object containing tokens and configuration for the client
	 */
	async function handleAuthCallback(params: AuthCallbackParams, tokenExchangeUrl: Unsure<string>) {

		const oidConfig = await oidSetupIssuerConfiguration();
		const currentCallbackUrl = parseCurrentCallbackUrl(params);
		const checks: openid.AuthorizationCodeGrantChecks = { idTokenExpected: true };

		if (params && typeof params === 'object' && !(params instanceof URL)) {
			if (typeof params.pkceCodeVerifier === 'string')
				checks.pkceCodeVerifier = params.pkceCodeVerifier;
			if (typeof params.expectedState === 'string')
				checks.expectedState = params.expectedState;
			if (typeof params.expectedNonce === 'string')
				checks.expectedNonce = params.expectedNonce;
		}

		const tokens = await openid.authorizationCodeGrant(oidConfig, currentCallbackUrl, checks);

		// do we have tokens and all values?
		if (!tokens.access_token)
			throw new SSROnlyError('Missing OID information');
		if (!tokens.refresh_token)
			throw new SSROnlyError('Missing OID information');
		if (!tokens.id_token)
			throw new SSROnlyError('Missing OID information');
		if (!clientId)
			throw new SSROnlyError('Missing client ID');
		if (!tokenExchangeUrl)
			throw new SSROnlyError('Missing URL for excgange');
		if (!issuerUrl)
			throw new SSROnlyError('Missing issuer URL');

		// prepare output for route
		return {
			tokens: {
				access_token: tokens.access_token,
				refresh_token: tokens.refresh_token,
				id_token: tokens.id_token,
			},
			clientId,
			issuerUrl,
			tokenExchangeUrl,
		};
	}

	/**
	 * Handles logout preparation
	 * @param tokenExchangeUrl - URL for token exchange (used for consistency check)
	 * @returns Object containing the token exchange URL
	 */
	async function handleLogout(tokenExchangeUrl: Unsure<string>) {
		if (!tokenExchangeUrl)
			throw new SSROnlyError('Missing URL for exchange');

		return { tokenExchangeUrl };
	}

	return {
		handleUserOpenID,
		handleAuthCallback,
		handleLogout,
	};
}
