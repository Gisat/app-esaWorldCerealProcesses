import { AppSpecficReducerFunc } from '@gisatcz/ptr-fe-core/client';
import { WorldCerealState } from '../../state.models';
import { OneOfWorldCerealActions } from '../../state.actions';
import { SetBBoxAction } from '@features/state/actions/downloadOfficialProduct/action.setBBox';

/**
 * Reducer function to handle the `SetBBoxAction` for the `downloadOfficialProducts` section of the state.
 *
 * This function updates the `bbox` property in the application state based on the action payload.
 *
 * @type {AppSpecficReducerFunc<WorldCerealState, OneOfWorldCerealActions>}
 * @param {WorldCerealState} state - The current state of the application.
 * @param {SetBBoxAction} action - The action containing the new `bbox` value.
 * @returns {WorldCerealState} The updated state with the new `bbox` value.
 */
export const setBBoxHandler: AppSpecficReducerFunc<WorldCerealState, OneOfWorldCerealActions> = (
	state: WorldCerealState,
	action: SetBBoxAction
): WorldCerealState => {
	return {
		...state,
		downloadOfficialProducts: {
			...state.downloadOfficialProducts,
			bbox: action.payload,
		},
	};
};
