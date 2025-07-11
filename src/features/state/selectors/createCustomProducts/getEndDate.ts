import { WorldCerealState, CreateCustomProductsEndDateModel } from '@features/state/state.models';

/**
 * Selector function to retrieve the end date in the `createCustomProducts` process.
 *
 * This function accesses the `createCustomProducts` section of the application state and returns
 * the current end date used in the process. If the `endDate` property is not defined, it returns `undefined`.
 *
 * @function getEndDate_customProducts
 * @param {WorldCerealState} state - The global application state.
 * @returns {CreateCustomProductsEndDateModel | undefined} - The end date used in the `createCustomProducts` process, or `undefined` if not defined.
 */
export const getEndDate_customProducts = (state: WorldCerealState): CreateCustomProductsEndDateModel => {
	return state.createCustomProducts?.endDate;
};
