import { CreateCustomProductsModelModel, WorldCerealState } from '@features/state/state.models';

/**
 * Selector function to retrieve the model in the `createCustomProducts` process.
 *
 * This function accesses the `createCustomProducts` section of the application state and returns
 * the current model used in the process. If the `model` property is not defined, it returns `undefined`.
 *
 * @function getModel_customProducts
 * @param {WorldCerealState} state - The global application state.
 * @returns {CreateCustomProductsModelModel | undefined} - The model used in the `createCustomProducts` process, or `undefined` if not defined.
 */
export const getModel_customProducts = (state: WorldCerealState): CreateCustomProductsModelModel | undefined => {
	return state.createCustomProducts?.model;
};
