import { CreateCustomProductsActiveStepModel, WorldCerealState } from '@features/state/state.models';

/**
 * Selector function to retrieve the active step in the `createCustomProducts` process.
 *
 * This function accesses the `createCustomProducts` section of the application state and returns
 * the current active step. If the `activeStep` property is not defined, it defaults to `1`.
 *
 * @function getActiveStep_customProducts
 * @param {WorldCerealState} state - The global application state.
 * @returns {CreateCustomProductsActiveStepModel} - The current active step in the `createCustomProducts` process.
 */
export const getActiveStep_customProducts = (state: WorldCerealState): CreateCustomProductsActiveStepModel => {
	return state.createCustomProducts?.activeStep || 1;
};
