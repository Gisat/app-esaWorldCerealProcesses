import { AppSpecficReducerFunc } from '@gisatcz/ptr-fe-core/client';
import { WorldCerealState } from '../../state.models';
import { OneOfWorldCerealActions } from '../../state.actions';
import { SetEndDateAction_customProducts } from '@features/state/actions/createCustomProducts/action.setEndDate';

/**
 * Reducer function to handle the `setEndDate` action for the `createCustomProducts` process.
 *
 * This function updates the `endDate` property in the `createCustomProducts` section of the application state.
 *
 * @function setEndDateHandler_customProducts
 * @param {WorldCerealState} state - The current state of the application.
 * @param {SetEndDateAction_customProducts} action - The dispatched action containing the payload to update the end date.
 * @returns {WorldCerealState} - The updated state with the new end date.
 */
export const setEndDateHandler_customProducts: AppSpecficReducerFunc<WorldCerealState, OneOfWorldCerealActions> = (
	state: WorldCerealState,
	action: SetEndDateAction_customProducts
): WorldCerealState => {
	return {
		...state,
		createCustomProducts: {
			...state.createCustomProducts,
			endDate: action.payload,
		},
	};
};
