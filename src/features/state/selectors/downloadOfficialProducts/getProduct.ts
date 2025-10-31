import { WorldCerealState, DownloadOfficialProductsProductModel } from '@features/state/state.models';

/**
 * Selector function to retrieve the `product` property from the application state.
 *
 * This function returns the current `product` value from the `downloadOfficialProducts` section
 * of the application state.
 *
 * @param {WorldCerealState} state - The current state of the application.
 * @returns {DownloadOfficialProductsProductModel | undefined} The `product` value or `undefined` if not defined.
 */
export const getProduct = (state: WorldCerealState): DownloadOfficialProductsProductModel => {
	// return the product property from the state
	return state.downloadOfficialProducts?.product;
};
