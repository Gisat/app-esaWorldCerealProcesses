import { loggyError, loggyInfo, messageFromError, SSROnlyError, Unsure } from '@gisatcz/ptr-be-core/node';
import * as openid from 'openid-client';

type AuthRequestChecks = {
	pkceCodeVerifier: string;
	state: string;
	nonce: string;
};

type AuthCallbackParams = {
	currentUrl: URL;
	query?: URLSearchParams;
	pkceCodeVerifier?: string;
	expectedState?: string;
	expectedNonce?: string;
};

type AuthCodeResult = {
	authorizationUrl: URL;
	checks: AuthRequestChecks;
};

export type OpenidResultBundle = {
	access_token: string;
	refresh_token: string;
	id_token: string;
	client_id: string;
	issuer_url: string;
};

/**
 * OpenID Connect functional context (as server side JS closure)
 * @returns Set of functions to handle OpenID (OAuth2) operations using official openid library with server side environments
 */
export const ssrOpenidContext = (clientId: string, issuerUrl: string, redirectUrl: string, clientSecret?: string) => {

	function logOpenidError(label: string, error: unknown, detail?: Record<string, unknown>) {
		loggyError(label, error instanceof Error ? error : String(error), {
			message: messageFromError(error),
			stack: (error instanceof Error) ? error.stack : 'no stack',
			cause: (error instanceof Error) ? error.cause : 'no cause',
			...detail,
		});
	}

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

			console.debug('OIDC Config Complete:');

			// return configuration
			return config;
		} catch (error: unknown) {
			logOpenidError('OIDC Setup Error', error);
			throw new SSROnlyError(`OIDC Config Setup: Failed to setup OID client: ${messageFromError(error)}`);
		}
	}

	async function handleUserOpenID(): Promise<AuthCodeResult> {
		try {
			console.debug('OIDC Handle User OpenID');

			// Setup OpenID configuration by context
			const oidConfig = await oidSetupIssuerConfiguration();

			// Check if the OID provider supprots PCKE
			const supportsPkce = oidConfig.serverMetadata().supportsPKCE();

			// PKCE request protection
			// 1. Random code from client app 
			const pkceCodeVerifier = openid.randomPKCECodeVerifier();

			// 2. Create a Hash Challenge from the random code
			const codeChallenge = await openid.calculatePKCECodeChallenge(pkceCodeVerifier);

			// generate random state for CSFR request protection
			const state = openid.randomState();

			// generate random OpenID nonce to pair with OpenID Identity Token
			const nonce = openid.randomNonce();

			// prepare parameters for OAuth2
			const parameters: Record<string, string> = {
				redirect_uri: redirectUrl,
				scope: 'openid email',
				code_challenge: codeChallenge,
				code_challenge_method: 'S256',
				state,
				nonce
			}

			console.debug('OIDC Authorization URL params before build:', parameters);

			console.debug('OIDC PKCE Support:', supportsPkce ? 'advertised by issuer metadata' : 'not advertised by issuer metadata');

			console.debug('OIDC Build Authorization URL:', parameters);

			// build authorisation URL to provider
			const authorizationUrl = openid.buildAuthorizationUrl(oidConfig, parameters)

			console.debug('OIDC Auth URL:', authorizationUrl.toString());

			// return authorisation URL and other outputs
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

	/**
	 * Try to obtain tokens from OpenID provider using authorization code grant flow, 
	 * with detailed error logging in case of failure to help with debugging issues with OpenID provider responses 
	 * and callback URL parsing
	 * @param oidConfig 
	 * @param callbackUrl 
	 * @param checks 
	 * @returns 
	 */
	async function tryAuthorisationCode(
		oidConfig: openid.Configuration,
		callbackUrl: URL,
		checks: openid.AuthorizationCodeGrantChecks
	) {

		/**
		 * Build detailed string for logging in case of error in authorization code grant step, 
		 * to help with debugging issues with OpenID provider responses and callback URL parsing
		 * @param callbackUrl 
		 * @param checks 
		 * @returns 
		 */
		function buildAuthorizationCodeGrantErrorDetail(
			callbackUrl: URL,
			checks: openid.AuthorizationCodeGrantChecks
		): string {
			return JSON.stringify({
				callbackUrl: callbackUrl.toString(),
				hasCode: callbackUrl.searchParams.has('code'),
				hasError: callbackUrl.searchParams.has('error'),
				hasPkceCodeVerifier: typeof checks.pkceCodeVerifier === 'string',
				hasExpectedState: typeof checks.expectedState === 'string',
				hasExpectedNonce: typeof checks.expectedNonce === 'string',
				idTokenExpected: checks.idTokenExpected === true,
			});
		}

		try {
			return await openid.authorizationCodeGrant(oidConfig, callbackUrl, checks);
		} catch (error: unknown) {
			const detail = buildAuthorizationCodeGrantErrorDetail(callbackUrl, checks);

			logOpenidError('OID Code Grant Error', error, { detail });

			throw new SSROnlyError(`OIDC Authorization Code Grant failed: ${messageFromError(error)}; detail: ${detail}`);
		}
	}

	/**
	 * Handle the OpenID callback to obtain tokens and related information, 
	 * with detailed error logging to help with debugging issues with OpenID provider responses and callback URL parsing
	 * @param params 
	 * @returns 
	 */
	async function handleAuthCallback(params: AuthCallbackParams): Promise<OpenidResultBundle> {

		/**
		 * Parse URL inyside the callback
		 * @param params URL containing the params
		 * @returns 
		 */
		function parseUrlInCallback(params: AuthCallbackParams): URL {
			console.debug('OIDC Callback: Parsing callback URL and params', { params });
			const callbackUrl = new URL(params.currentUrl.toString());

			if (params.query) {
				for (const [key, value] of params.query.entries()) {
					if (value.length > 0)
						callbackUrl.searchParams.set(key, value);
				}
			}

			if (!callbackUrl.searchParams.has('code') && !callbackUrl.searchParams.has('error'))
				throw new SSROnlyError('Missing OpenID callback query param `code`');

			console.debug('OIDC Callback: Parsed callback URL', { callbackUrl: callbackUrl.toString() });
			return callbackUrl;
		}

		// setup OpenID configuration from context
		const oidConfig = await oidSetupIssuerConfiguration();

		// Parse URL from callback 
		const currentCallbackUrl = parseUrlInCallback(params);
		loggyInfo('OIDC Callback', "Parsed callback URL and Params", { url: currentCallbackUrl.toString() });
		console.log('OIDC Callback URL:', currentCallbackUrl.toString());

		// Prepare Callback checks settings from the URL params
		const checks: openid.AuthorizationCodeGrantChecks = { idTokenExpected: true };

		if (typeof params.pkceCodeVerifier === 'string')
			checks.pkceCodeVerifier = params.pkceCodeVerifier;
		if (typeof params.expectedState === 'string')
			checks.expectedState = params.expectedState;
		if (typeof params.expectedNonce === 'string')
			checks.expectedNonce = params.expectedNonce;

		// Ask for tokens using OAuth2 Code flow step
		const tokens = await tryAuthorisationCode(oidConfig, currentCallbackUrl, checks);

		// do we have tokens and all values?
		if (!tokens.access_token)
			throw new SSROnlyError('Callback Handler: Missing OID information');
		if (!tokens.refresh_token)
			throw new SSROnlyError('Callback Handler: Missing OID information');
		if (!tokens.id_token)
			throw new SSROnlyError('Callback Handler: Missing OID information');
		if (!clientId)
			throw new SSROnlyError('Callback Handler: Missing client ID');
		if (!issuerUrl)
			throw new SSROnlyError('Callback Handler: Missing issuer URL');

		// prepare OpenID output for route
		return {
			access_token: tokens.access_token,
			refresh_token: tokens.refresh_token,
			id_token: tokens.id_token,
			client_id: clientId,
			issuer_url: issuerUrl
		}
	};

	async function handleLogout(logoutUrl: Unsure<string>) {
		if (!logoutUrl)
			throw new SSROnlyError('Missing URL for logout');

		return { logoutUrl };
	}

	return {
		handleUserOpenID,
		handleAuthCallback,
		handleLogout,
	};
}
