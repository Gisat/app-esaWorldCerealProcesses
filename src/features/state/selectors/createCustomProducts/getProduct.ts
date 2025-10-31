import { WorldCerealState, CreateCustomProductsProductModel } from '@features/state/state.models';

/**
 * Selector function to retrieve the product in the `createCustomProducts` process.
 *
 * This function accesses the `createCustomProducts` section of the application state and returns
 * the current product used in the process. If the `product` property is not defined, it returns `undefined`.
 *
 * @function getProduct_customProducts
 * @param {WorldCerealState} state - The global application state.
 * @returns {CreateCustomProductsProductModel | undefined} - The product used in the `createCustomProducts` process, or `undefined` if not defined.
 */
export const getProduct_customProducts = (state: WorldCerealState): CreateCustomProductsProductModel => {
	return state.createCustomProducts?.product;
};
