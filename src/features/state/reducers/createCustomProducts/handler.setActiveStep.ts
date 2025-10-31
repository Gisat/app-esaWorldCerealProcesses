import { AppSpecficReducerFunc } from '@gisatcz/ptr-fe-core/client';
import { WorldCerealState } from '../../state.models';
import { OneOfWorldCerealActions } from '../../state.actions';
import { SetActiveStepAction_customProducts } from '@features/state/actions/createCustomProducts/action.setActiveStep';

/**
 * Reducer function to handle the action for setting the active step in the `createCustomProducts` process.
 *
 * This function updates the `activeStep` property in the `createCustomProducts` section of the application state
 * based on the payload of the dispatched action.
 *
 * @function setActiveStepHandler_customProducts
 * @param {WorldCerealState} state - The current global application state.
 * @param {SetActiveStepAction_customProducts} action - The dispatched action containing the new active step.
 * @returns {WorldCerealState} - The updated application state with the new active step.
 */
export const setActiveStepHandler_customProducts: AppSpecficReducerFunc<WorldCerealState, OneOfWorldCerealActions> = (
	state: WorldCerealState,
	action: SetActiveStepAction_customProducts
): WorldCerealState => {
	return {
		...state,
		createCustomProducts: {
			...state.createCustomProducts,
			activeStep: action.payload,
		},
	};
};
