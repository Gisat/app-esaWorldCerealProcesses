import { AppSpecficReducerFunc } from '@gisatcz/ptr-fe-core/client';
import { WorldCerealState } from '../../state.models';
import { OneOfWorldCerealActions } from '../../state.actions';
import { SetBackgroundLayerAction } from '@features/state/actions/downloadOfficialProduct/action.setBackgroundLayer';

/**
 * Reducer function to handle the `SetBackgroundLayerAction` for the `downloadOfficialProducts` section of the state.
 *
 * This function updates the `backgroundLayer` property in the application state based on the action payload.
 *
 * @type {AppSpecficReducerFunc<WorldCerealState, OneOfWorldCerealActions>}
 * @param {WorldCerealState} state - The current state of the application.
 * @param {SetBackgroundLayerAction} action - The action containing the new `backgroundLayer` value.
 * @returns {WorldCerealState} The updated state with the new `backgroundLayer` value.
 */
export const setBackgroundLayerHandler: AppSpecficReducerFunc<WorldCerealState, OneOfWorldCerealActions> = (
	state: WorldCerealState,
	action: SetBackgroundLayerAction
): WorldCerealState => {
	return {
		...state,
		downloadOfficialProducts: {
			...state.downloadOfficialProducts,
			backgroundLayer: action.payload,
		},
	};
};
