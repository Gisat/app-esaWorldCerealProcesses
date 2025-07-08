import { AppSpecficReducerFunc, AppSpecificReducerMap } from '@gisatcz/ptr-fe-core/client';
import { WorldCerealState } from './state.models';
import { WorldCerealStateActionType, OneOfCoreActions } from './state.actions';
import { worldCerealCustomReduceHandler } from './state.handlers';

/**
 * Creates and returns a JS Map of reducer functions specific to the core application state management.
 * This map is used to extend or override the default reducer behavior from the NPM package.
 * Key is always the action type as a string, and value is a reducer function that handles the state transformation.
 *
 * @returns {AppSpecificReducerMap<WorldCerealState>} A map where keys are action types and values are reducer functions
 *                                               that handle specific state transformations for the core application.
 *
 * @example
 * const reducerMap = stateReducerMapForCoreApplication();
 * // reducerMap contains custom reducer handlers for core state actions
 */
export const stateReducerMapForWorldCerealApplication = (): AppSpecificReducerMap<
	WorldCerealState,
	OneOfCoreActions
> => {
	// instead of switch we have a map that will be merged with the default map in NPM package
	// this allows us to extend the default behavior without modifying the original code
	// and also to override the default behavior if needed
	// the map is used to map action types to reducer functions
	const map = new Map<string, AppSpecficReducerFunc<WorldCerealState, OneOfCoreActions>>();

	// each action type is mapped to a handler function
	map.set(WorldCerealStateActionType.WORLD_CEREAL__CUSTOM_ACTION_TYPE as string, worldCerealCustomReduceHandler);

	// return the map for the reducer inside the ptr-fe-core
	return map;
};
