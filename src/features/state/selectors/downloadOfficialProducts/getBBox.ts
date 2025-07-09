import { WorldCerealState, DownloadOfficialProductsBBoxModel } from '@features/state/state.models';

/**
 * Selector function to retrieve the bounding box (BBox) from the `downloadOfficialProducts` section of the state.
 *
 * This function accesses the application state and returns the `bbox` property if it exists.
 *
 * @param {WorldCerealState} state - The current state of the application.
 * @returns {DownloadOfficialProductsBBoxModel | undefined} The bounding box model or `undefined` if not present.
 */
export const getBBox = (state: WorldCerealState): DownloadOfficialProductsBBoxModel | undefined => {
	return state.downloadOfficialProducts?.bbox;
};
