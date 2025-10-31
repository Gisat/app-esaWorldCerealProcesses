import { AppSpecficReducerFunc } from '@gisatcz/ptr-fe-core/client';
import { SetCurrentJobKeyAction } from '@features/state/actions/downloadOfficialProduct/action.setCurrentJobKey';
import { WorldCerealState } from '../../state.models';
import { OneOfWorldCerealActions } from '../../state.actions';

/**
 * Reducer function to handle the "Set Current Job Key" action.
 *
 * This function updates the `currentJobKey` property in the `downloadOfficialProducts` state
 * based on the payload of the dispatched action.
 *
 * @type {AppSpecficReducerFunc<WorldCerealState, OneOfWorldCerealActions>}
 * @param {WorldCerealState} state - The current state of the application.
 * @param {SetCurrentJobKeyAction} action - The dispatched action containing the new job key.
 * @returns {WorldCerealState} The updated state with the new `currentJobKey`.
 */
export const setCurrentJobKeyHandler: AppSpecficReducerFunc<WorldCerealState, OneOfWorldCerealActions> = (
	state: WorldCerealState,
	action: SetCurrentJobKeyAction
): WorldCerealState => {
	return {
		...state,
		downloadOfficialProducts: {
			...state.downloadOfficialProducts,
			currentJobKey: action.payload,
		},
	};
};
