import { AppSpecficReducerFunc } from '@gisatcz/ptr-fe-core/client';
import { WorldCerealState } from '../../state.models';
import { OneOfWorldCerealActions } from '../../state.actions';
import { SetActiveStepAction } from '../../actions/downloadOfficialProduct/action.setActiveStep';

/**
 * Reducer function to handle the `setActiveStep` action.
 *
 * This function updates the `activeStep` property in the `downloadOfficialProducts` section
 * of the application state based on the payload of the provided action.
 *
 * @type {AppSpecficReducerFunc<WorldCerealState, OneOfWorldCerealActions>}
 * @param {WorldCerealState} state - The current state of the application.
 * @param {SetActiveStepAction} action - The action containing the new `activeStep` value.
 * @returns {WorldCerealState} The updated application state.
 */
export const setActiveStepHandler: AppSpecficReducerFunc<WorldCerealState, OneOfWorldCerealActions> = (
	state: WorldCerealState,
	action: SetActiveStepAction
): WorldCerealState => {
	return {
		...state,
		downloadOfficialProducts: {
			...state.downloadOfficialProducts,
			activeStep: action.payload,
		},
	};
};
