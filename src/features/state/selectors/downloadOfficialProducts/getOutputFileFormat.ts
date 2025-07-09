import { WorldCerealState, DownloadOfficialProductsOutputFileFormatModel } from '@features/state/state.models';

/**
 * Selector function to retrieve the `outputFileFormat` property from the application state.
 *
 * This function returns the current `outputFileFormat` value from the `downloadOfficialProducts` section
 * of the application state.
 *
 * @param {WorldCerealState} state - The current state of the application.
 * @returns {DownloadOfficialProductsOutputFileFormatModel | undefined} The `outputFileFormat` value or `undefined` if not defined.
 */
export const getOutputFileFormat = (state: WorldCerealState): DownloadOfficialProductsOutputFileFormatModel => {
	return state.downloadOfficialProducts?.outputFileFormat;
};
