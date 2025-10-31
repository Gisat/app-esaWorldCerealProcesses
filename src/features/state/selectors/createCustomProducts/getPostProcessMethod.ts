import { WorldCerealState, CreateCustomProductsPostprocessMethodModel } from '@features/state/state.models';

/**
 * Selector function to retrieve the postprocess method in the `createCustomProducts` process.
 *
 * This function accesses the `createCustomProducts` section of the application state and returns
 * the current postprocess method used in the process. If the `postprocessMethod` property is not defined, it returns `undefined`.
 *
 * @function getPostProcessMethod_customProducts
 * @param {WorldCerealState} state - The global application state.
 * @returns {CreateCustomProductsPostprocessMethodModel | undefined} - The postprocess method used in the `createCustomProducts` process, or `undefined` if not defined.
 */
export const getPostProcessMethod_customProducts = (
	state: WorldCerealState
): CreateCustomProductsPostprocessMethodModel | undefined => {
	return state.createCustomProducts?.postprocessMethod;
};
