import { AppSpecificAction, OneOfStateActions } from '@gisatcz/ptr-fe-core/client';

/**
 * Action types for the fe-core state.
 */
export enum WorldCerealStateActionType {
	WORLD_CEREAL__CUSTOM_ACTION_TYPE = 'worldCerealCustomActionType',
	// ...add more action types as needed
}

/**
 * Custom action for the fe-core state.
 * This is an example of a custom style action that can be dispatched to the state.
 */
export interface WorldCerealCustomAction {
	type: WorldCerealStateActionType.WORLD_CEREAL__CUSTOM_ACTION_TYPE;
	payload: {
		worldCerealCustom: any;
	};
}

/**
 * List of all actions that can be dispatched to the fe-core state.
 * This includes both the standard state actions and the custom actions defined for the fe-core.
 */
export type OneOfCoreActions = AppSpecificAction &
	(
		| OneOfStateActions // from the ptr-fe-core/client as basic of known actions
		| WorldCerealCustomAction
	);
// ...add more custom actions as needed
