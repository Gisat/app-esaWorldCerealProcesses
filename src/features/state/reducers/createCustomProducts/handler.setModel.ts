import { AppSpecficReducerFunc } from '@gisatcz/ptr-fe-core/client';
import { WorldCerealState } from '../../state.models';
import { OneOfWorldCerealActions } from '../../state.actions';
import { SetModelAction_customProducts } from '@features/state/actions/createCustomProducts/action.setModel';

/**
 * Reducer function to handle the `setModel` action for the `createCustomProducts` process.
 *
 * This function updates the `model` property in the `createCustomProducts` section of the application state.
 *
 * @function setModelHandler_customProducts
 * @param {WorldCerealState} state - The current state of the application.
 * @param {SetModelAction_customProducts} action - The dispatched action containing the payload to update the model.
 * @returns {WorldCerealState} - The updated state with the new model.
 */
export const setModelHandler_customProducts: AppSpecficReducerFunc<WorldCerealState, OneOfWorldCerealActions> = (
	state: WorldCerealState,
	action: SetModelAction_customProducts
): WorldCerealState => {
	return {
		...state,
		createCustomProducts: {
			...state.createCustomProducts,
			model: action.payload,
		},
	};
};
