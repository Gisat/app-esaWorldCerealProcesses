import { WorldCerealState, CreateCustomProductsOutputFileFormatModel } from '@features/state/state.models';

/**
 * Selector function to retrieve the output file format in the `createCustomProducts` process.
 *
 * This function accesses the `createCustomProducts` section of the application state and returns
 * the current output file format used in the process. If the `outputFileFormat` property is not defined,
 * it returns `undefined`.
 *
 * @function getOutputFileFormat_customProducts
 * @param {WorldCerealState} state - The global application state.
 * @returns {CreateCustomProductsOutputFileFormatModel | undefined} - The output file format used in the `createCustomProducts` process, or `undefined` if not defined.
 */
export const getOutputFileFormat_customProducts = (
	state: WorldCerealState
): CreateCustomProductsOutputFileFormatModel | undefined => {
	return state.createCustomProducts?.outputFileFormat;
};
