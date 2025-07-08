import { AppSharedState } from '@gisatcz/ptr-fe-core/client';

/**
 * Application shared state for the fe-core documentation app
 * All shared state properties should be defined here.
 * This state is used to manage the application state across different components.
 */
export interface WorldCerealState extends AppSharedState {
	worldCereal?: any; // Define the type of styleDefinitions if known
}
