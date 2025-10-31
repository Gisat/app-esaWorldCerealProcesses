import { WorldCerealState, DownloadOfficialProductsCollectionModel } from '@features/state/state.models';

/**
 * Selector function to retrieve the `collection` property from the application state.
 *
 * This function returns the current `collection` value from the `downloadOfficialProducts` section
 * of the application state.
 *
 * @param {WorldCerealState} state - The current state of the application.
 * @returns {DownloadOfficialProductsCollectionModel | undefined} The `collection` value or `undefined` if not defined.
 */
export const getCollection = (state: WorldCerealState): DownloadOfficialProductsCollectionModel => {
	// return the collection property from the state
	return state.downloadOfficialProducts?.collection;
};
