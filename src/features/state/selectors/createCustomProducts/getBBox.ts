import { WorldCerealState, CreateCustomProductsBBoxModel } from '@features/state/state.models';

/**
 * Selector function to retrieve the bounding box (BBox) in the `createCustomProducts` process.
 *
 * This function accesses the `createCustomProducts` section of the application state and returns
 * the current bounding box used in the process. If the `bbox` property is not defined, it returns `undefined`.
 *
 * @function getBBox_customProducts
 * @param {WorldCerealState} state - The global application state.
 * @returns {CreateCustomProductsBBoxModel | undefined} - The bounding box used in the `createCustomProducts` process, or `undefined` if not defined.
 */
export const getBBox_customProducts = (state: WorldCerealState): CreateCustomProductsBBoxModel | undefined => {
	return state.createCustomProducts?.bbox;
};
