import { WorldCerealState, DownloadOfficialProductsBackgroundLayerModel } from '@features/state/state.models';

/**
 * Selector function to retrieve the background layer from the `downloadOfficialProducts` section of the state.
 *
 * This function accesses the application state and returns the `backgroundLayer` property if it exists.
 *
 * @param {WorldCerealState} state - The current state of the application.
 * @returns {DownloadOfficialProductsBackgroundLayerModel | undefined} The background layer model or `undefined` if not present.
 */
export const getBackgroundLayer = (
	state: WorldCerealState
): DownloadOfficialProductsBackgroundLayerModel | undefined => {
	return state.downloadOfficialProducts?.backgroundLayer;
};
