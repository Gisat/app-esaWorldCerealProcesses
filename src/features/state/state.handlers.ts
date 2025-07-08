import { AppSpecficReducerFunc } from '@gisatcz/ptr-fe-core/client';
import { WorldCerealState } from './state.models';
import { WorldCerealCustomAction, OneOfCoreActions } from './state.actions';

/**
 * Reducer handler for custom style updates in the application state.
 *
 * @param state - The current state of the application of type WorldCerealState
 * @param action - The dispatched action containing custom style data of type WorldCerealWorldCerealCustomAction
 * @returns A new state object with updated style definition
 */
export const worldCerealCustomReduceHandler: AppSpecficReducerFunc<WorldCerealState, OneOfCoreActions> = (
	state: WorldCerealState,
	action: WorldCerealCustomAction
): WorldCerealState => {
	return {
		...state,
		worldCereal: action.payload.worldCerealCustom, // Assuming customData is a property in the state
	};
};
