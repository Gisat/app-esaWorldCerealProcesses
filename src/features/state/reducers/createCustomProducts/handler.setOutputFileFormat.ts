import { AppSpecficReducerFunc } from '@gisatcz/ptr-fe-core/client';
import { WorldCerealState } from '../../state.models';
import { OneOfWorldCerealActions } from '../../state.actions';
import { SetOutputFileFormatAction_customProducts } from '@features/state/actions/createCustomProducts/action.setOutputFileFormat';

/**
 * Reducer function to handle the `setOutputFileFormat` action for the `createCustomProducts` process.
 *
 * This function updates the `outputFileFormat` property in the `createCustomProducts` section of the application state.
 *
 * @function setOutputFileFormatHandler_customProducts
 * @param {WorldCerealState} state - The current state of the application.
 * @param {SetOutputFileFormatAction_customProducts} action - The dispatched action containing the payload to update the output file format.
 * @returns {WorldCerealState} - The updated state with the new output file format.
 */
export const setOutputFileFormatHandler_customProducts: AppSpecficReducerFunc<
	WorldCerealState,
	OneOfWorldCerealActions
> = (state: WorldCerealState, action: SetOutputFileFormatAction_customProducts): WorldCerealState => {
	return {
		...state,
		createCustomProducts: {
			...state.createCustomProducts,
			outputFileFormat: action.payload,
		},
	};
};
