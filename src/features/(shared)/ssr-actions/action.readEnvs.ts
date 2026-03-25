'use server';
import { DEFAULT_DB_NAME, DEFAULT_DB_STATE_EXPIRATION_SEC } from '@features/(shared)/ssr-constants/db.constants';

// This directive tells the transpiler to use server-side rendering (SSR) for this module.

/**
 * Interface for the App Environments.
 */
export interface AppEnvironments {
	ENV: string;
	CUSTOM_ENV: string | undefined;
	OID_CLIENT_ID: string | undefined;
	OID_IAM_ISSUER_URL: string | undefined;
	OID_SELF_REDIRECT_URL: string | undefined;
	METADATA_URL: string | undefined;
	PID_URL: string | undefined;
	FARO_URL: string | undefined;
	DATABASE_FILE: string;
	DATABASE_STATE_EXPIRATION_SEC: number;
	INSTANCE_WARNING_HIDDEN: boolean | undefined;
	INSTANCE_WARNING_COLOR: string | undefined; // Example: "#D81B1B"
	INSTANCE_WARNING_TEXT: string | undefined; // Example: "DEV version"
}

/**
 * Function to read the environment variables.
 *
 * @returns {AppEnvironments} The app environments.
 */
export const ssrUseEnvironments = async (): Promise<AppEnvironments> => {
	// TODO: Add a check to ensure that the environment variables are set or has defaults

	return {
		ENV: process.env.ENV ?? 'prod',
		CUSTOM_ENV: process.env.CUSTOM_ENV,
		OID_CLIENT_ID: process.env.OID_CLIENT_ID,
		OID_IAM_ISSUER_URL: process.env.OID_IAM_ISSUER_URL,
		OID_SELF_REDIRECT_URL: process.env.OID_SELF_REDIRECT_URL,
		METADATA_URL: process.env.METADATA_URL,
		PID_URL: process.env.PID_URL,
		FARO_URL: process.env.FARO_URL,
		DATABASE_FILE: process.env.DATABASE_FILE ?? DEFAULT_DB_NAME,
		DATABASE_STATE_EXPIRATION_SEC: parseInt(
			process.env.DATABASE_STATE_EXPIRATION_SEC ?? DEFAULT_DB_STATE_EXPIRATION_SEC.toString()
		),
		INSTANCE_WARNING_HIDDEN:
			process.env.INSTANCE_WARNING_HIDDEN === undefined ? undefined : process.env.INSTANCE_WARNING_HIDDEN === 'true',
		INSTANCE_WARNING_COLOR: process.env.INSTANCE_WARNING_COLOR,
		INSTANCE_WARNING_TEXT: process.env.INSTANCE_WARNING_TEXT,
	};
};
