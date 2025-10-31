import { WorldCerealState, CreateCustomProductsBackgroundLayerModel } from '@features/state/state.models';

/**
 * Selector function to retrieve the background layer in the `createCustomProducts` process.
 *
 * This function accesses the `createCustomProducts` section of the application state and returns
 * the current background layer used in the process. If the `backgroundLayer` property is not defined,
 * it returns `undefined`.
 *
 * @function getBackgroundLayer_customProducts
 * @param {WorldCerealState} state - The global application state.
 * @returns {CreateCustomProductsBackgroundLayerModel | undefined} - The background layer used in the `createCustomProducts` process, or `undefined` if not defined.
 */
export const getBackgroundLayer_customProducts = (
	state: WorldCerealState
): CreateCustomProductsBackgroundLayerModel | undefined => {
	return state.createCustomProducts?.backgroundLayer;
};
