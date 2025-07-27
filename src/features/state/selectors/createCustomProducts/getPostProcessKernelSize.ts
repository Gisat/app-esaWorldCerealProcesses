import { WorldCerealState, CreateCustomProductsPostprocessKernelSizeModel } from '@features/state/state.models';

/**
 * Selector function to retrieve the postprocess kernel size in the `createCustomProducts` process.
 *
 * This function accesses the `createCustomProducts` section of the application state and returns
 * the current postprocess kernel size used in the process. If the `postprocessKernelSize` property is not defined, it returns `undefined`.
 *
 * @function getPostProcessKernelSize_customProducts
 * @param {WorldCerealState} state - The global application state.
 * @returns {CreateCustomProductsPostprocessKernelSizeModel | undefined} - The postprocess kernel size used in the `createCustomProducts` process, or `undefined` if not defined.
 */
export const getPostProcessKernelSize_customProducts = (
	state: WorldCerealState
): CreateCustomProductsPostprocessKernelSizeModel | undefined => {
	return state.createCustomProducts?.postprocessKernelSize;
};
