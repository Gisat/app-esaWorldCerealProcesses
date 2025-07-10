import { openDb, dbSaveState, dbNeedAppState } from '@gisatcz/ptr-fe-core/server';
import { handleRouteError, BaseHttpError, ErrorBehavior } from '@gisatcz/ptr-fe-core/globals';
import { randomUUID } from 'crypto';
// Importing necessary modules and utilities

import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

/**
 * Handles GET requests to retrieve place data.
 *
 * @param request - The Next.js request object containing the URL with search parameters
 * @returns A JSON response with the requested state data or an error message
 *
 * @throws {BaseHttpError} When the key parameter is missing (400)
 * @throws {BaseHttpError} When the database file is not found (500)
 * @throws {BaseHttpError} When the requested state is not found (404)
 *
 * @remarks
 * This endpoint requires a 'key' query parameter that identifies the state to retrieve.
 * It connects to the SQLite database specified in the environment variables.
 */
export async function GET(request: NextRequest) {
	try {
		// Parse the search parameters from the request URL
		const { searchParams } = new URL(request.url);
		const stateKey = searchParams.get('key');

		if (!stateKey)
			// Throw an error if the 'key' parameter is missing
			throw new BaseHttpError('Missing key parameter', 400, ErrorBehavior.SSR);

		// Retrieve the database file path from environment variables
		const databaseFile = process.env.DATABASE_FILE;

		if (!databaseFile) {
			// Throw an error if the database file is not found
			throw new BaseHttpError('Database file not found', 500, ErrorBehavior.SSR);
		}

		// Open a connection to the SQLite database
		const db = await openDb(databaseFile);

		// Query the database for the requested state
		const wantedState = (await dbNeedAppState(db, stateKey)) as any;

		if (!wantedState) {
			// Throw an error if the requested state is not found
			throw new BaseHttpError(`State with key ${stateKey} was not found`, 400, ErrorBehavior.SSR);
		}

		// Return the requested state as a JSON response
		return NextResponse.json(wantedState, { status: 200 });
	} catch (error: any) {
		// Handle errors and return an appropriate response
		const { message, status } = handleRouteError(error);
		return NextResponse.json({ error: message }, { status });
	}
}

/**
 * Handles POST requests to save state data to an SQLite database.
 *
 * This function does the following:
 * 1. Retrieves the database file path from environment variables
 * 2. Opens a connection to the SQLite database
 * 3. Parses the request body as JSON
 * 4. Creates the state storage table if it doesn't exist
 * 5. Saves the state data with a UUID and expiration time
 * 6. Returns a success response
 *
 * @param request - The incoming Next.js request object
 * @returns A JSON response with status "ok" if successful, or an error message
 * @throws {BaseHttpError} When the database file is not found or other errors occur
 */
export async function POST(request: NextRequest) {
	try {
		// Retrieve the database file path from environment variables
		const databaseFile = process.env.DATABASE_FILE;

		if (!databaseFile) {
			// Throw an error if the database file is not found
			throw new BaseHttpError('Database file not found', 500, ErrorBehavior.SSR);
		}

		// Retrieve the expiration time for state data from environment variables
		const databaseStateExpirationSec = parseInt(process.env.DATABASE_STATE_EXPIRATION_SEC || '3600');

		// Open a connection to the SQLite database
		const db = await openDb(databaseFile);

		// Parse the request body as JSON
		const body = await request.json();

		// Generate a random UUID for the state key
		const key = randomUUID();

		// TODO: Validation and parsing from body

		// Save the state data with a UUID and expiration time
		await dbSaveState(db, key, body ?? {}, databaseStateExpirationSec);

		// Return a success response
		return NextResponse.json({ key }, { status: 200 });
	} catch (error: any) {
		// Handle errors and return an appropriate response
		const { message, status } = handleRouteError(error);
		return NextResponse.json({ error: message }, { status });
	}
}
