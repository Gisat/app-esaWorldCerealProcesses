import { WorldCerealState, CreateCustomProductsCurrentJobKeyModel } from '@features/state/state.models';

/**
 * Selector function to retrieve the current job key in the `createCustomProducts` process.
 *
 * This function accesses the `createCustomProducts` section of the application state and returns
 * the current job key used in the process. If the `currentJobKey` property is not defined, it returns `undefined`.
 *
 * @function getCurrentJobKey_customProducts
 * @param {WorldCerealState} state - The global application state.
 * @returns {CreateCustomProductsCurrentJobKeyModel | undefined} - The current job key used in the `createCustomProducts` process, or `undefined` if not defined.
 */
export const getCurrentJobKey_customProducts = (
	state: WorldCerealState
): CreateCustomProductsCurrentJobKeyModel | undefined => {
	return state.createCustomProducts?.currentJobKey;
};
