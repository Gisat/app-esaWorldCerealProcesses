import { DownloadOfficialProductsActiveStepModel, WorldCerealState } from '@features/state/state.models';

/**
 * Selector function to retrieve the `activeStep` property from the application state.
 *
 * This function returns the current `activeStep` value from the `downloadOfficialProducts` section
 * of the application state. If `activeStep` is not defined, it defaults to `1`.
 *
 * @param {WorldCerealState} state - The current state of the application.
 * @returns {DownloadOfficialProductsActiveStepModel} The `activeStep` value or `1` if undefined.
 */
export const getActiveStep = (state: WorldCerealState): DownloadOfficialProductsActiveStepModel => {
	// return 1 as default step if activeStep is not defined
	return state.downloadOfficialProducts?.activeStep || 1;
};
