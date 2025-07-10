import { AppSpecficReducerFunc } from '@gisatcz/ptr-fe-core/client';
import { WorldCerealState } from '../../state.models';
import { OneOfWorldCerealActions } from '../../state.actions';
import { SetCurrentJobKeyAction_customProducts } from '@features/state/actions/createCustomProducts/action.setCurrentJobKey';

/**
 * Reducer function to handle the `setCurrentJobKey` action for the `createCustomProducts` process.
 *
 * This function updates the `currentJobKey` property in the `createCustomProducts` section of the application state.
 *
 * @function setCurrentJobKeyHandler_customProducts
 * @param {WorldCerealState} state - The current state of the application.
 * @param {SetCurrentJobKeyAction_customProducts} action - The dispatched action containing the payload to update the current job key.
 * @returns {WorldCerealState} - The updated state with the new current job key.
 */
export const setCurrentJobKeyHandler_customProducts: AppSpecficReducerFunc<
	WorldCerealState,
	OneOfWorldCerealActions
> = (state: WorldCerealState, action: SetCurrentJobKeyAction_customProducts): WorldCerealState => {
	return {
		...state,
		createCustomProducts: {
			...state.createCustomProducts,
			currentJobKey: action.payload,
		},
	};
};
