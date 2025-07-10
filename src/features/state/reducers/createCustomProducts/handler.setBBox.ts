import { AppSpecficReducerFunc } from '@gisatcz/ptr-fe-core/client';
import { WorldCerealState } from '../../state.models';
import { OneOfWorldCerealActions } from '../../state.actions';
import { SetBBoxAction_customProducts } from '@features/state/actions/createCustomProducts/action.setBBox';

/**
 * Reducer function to handle the `setBBox` action for the `createCustomProducts` process.
 *
 * This function updates the `bbox` property in the `createCustomProducts` section of the application state.
 *
 * @function setBBoxHandler_customProducts
 * @param {WorldCerealState} state - The current state of the application.
 * @param {SetBBoxAction_customProducts} action - The dispatched action containing the payload to update the bounding box (bbox).
 * @returns {WorldCerealState} - The updated state with the new bounding box.
 */
export const setBBoxHandler_customProducts: AppSpecficReducerFunc<WorldCerealState, OneOfWorldCerealActions> = (
	state: WorldCerealState,
	action: SetBBoxAction_customProducts
): WorldCerealState => {
	return {
		...state,
		createCustomProducts: {
			...state.createCustomProducts,
			bbox: action.payload,
		},
	};
};
