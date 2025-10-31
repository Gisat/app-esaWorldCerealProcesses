import { WorldCerealState, DownloadOfficialProductsCurrentJobKeyModel } from '@features/state/state.models';

/**
 * Selector function to retrieve the current job key from the `downloadOfficialProducts` section of the state.
 *
 * This function accesses the application state and returns the `currentJobKey` property if it exists.
 *
 * @param {WorldCerealState} state - The current state of the application.
 * @returns {DownloadOfficialProductsCurrentJobKeyModel | undefined} The current job key model or `undefined` if not present.
 */
export const getCurrentJobKey = (state: WorldCerealState): DownloadOfficialProductsCurrentJobKeyModel | undefined => {
	return state.downloadOfficialProducts?.currentJobKey;
};
