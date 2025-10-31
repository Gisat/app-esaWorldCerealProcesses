import { WorldCerealState, CreateCustomProductsOrbitStateModel } from '@features/state/state.models';

/**
 * Selector function to retrieve the orbit state in the `createCustomProducts` process.
 *
 * This function accesses the `createCustomProducts` section of the application state and returns
 * the current orbit state used in the process. If the `orbitState` property is not defined, it returns `undefined`.
 *
 * @function getOrbitState_customProducts
 * @param {WorldCerealState} state - The global application state.
 * @returns {CreateCustomProductsOrbitStateModel | undefined} - The orbit state used in the `createCustomProducts` process, or `undefined` if not defined.
 */
export const getOrbitState_customProducts = (
	state: WorldCerealState
): CreateCustomProductsOrbitStateModel | undefined => {
	return state.createCustomProducts?.orbitState;
};
