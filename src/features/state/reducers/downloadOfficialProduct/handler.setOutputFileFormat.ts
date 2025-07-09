import { AppSpecficReducerFunc } from '@gisatcz/ptr-fe-core/client';
import { WorldCerealState } from '../../state.models';
import { OneOfWorldCerealActions } from '../../state.actions';
import { SetOutputFileFormatAction } from '@features/state/actions/downloadOfficialProduct/action.setOutputFileFormat';

/**
 * Reducer function to handle the `SetOutputFileFormatAction` for the `downloadOfficialProducts` section of the state.
 *
 * This function updates the `outputFileFormat` property in the application state based on the action payload.
 *
 * @type {AppSpecficReducerFunc<WorldCerealState, OneOfWorldCerealActions>}
 * @param {WorldCerealState} state - The current state of the application.
 * @param {SetOutputFileFormatAction} action - The action containing the new `outputFileFormat` value.
 * @returns {WorldCerealState} The updated state with the new `outputFileFormat` value.
 */
export const setOutputFileFormatHandler: AppSpecficReducerFunc<WorldCerealState, OneOfWorldCerealActions> = (
	state: WorldCerealState,
	action: SetOutputFileFormatAction
): WorldCerealState => {
	return {
		...state,
		downloadOfficialProducts: {
			...state.downloadOfficialProducts,
			outputFileFormat: action.payload,
		},
	};
};
