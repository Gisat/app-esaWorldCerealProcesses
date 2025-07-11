import { AppSpecficReducerFunc } from '@gisatcz/ptr-fe-core/client';
import { WorldCerealState } from '../../state.models';
import { OneOfWorldCerealActions } from '../../state.actions';
import { SetBackgroundLayerAction_customProducts } from '@features/state/actions/createCustomProducts/action.setBackgroundLayer';

/**
 * Reducer function to handle the `setBackgroundLayer` action for the `createCustomProducts` process.
 *
 * This function updates the `backgroundLayer` property in the `createCustomProducts` section of the application state.
 *
 * @function setBackgroundLayerHandler_customProducts
 * @param {WorldCerealState} state - The current state of the application.
 * @param {SetBackgroundLayerAction_customProducts} action - The dispatched action containing the payload to update the background layer.
 * @returns {WorldCerealState} - The updated state with the new background layer.
 */
export const setBackgroundLayerHandler_customProducts: AppSpecficReducerFunc<
	WorldCerealState,
	OneOfWorldCerealActions
> = (state: WorldCerealState, action: SetBackgroundLayerAction_customProducts): WorldCerealState => {
	return {
		...state,
		createCustomProducts: {
			...state.createCustomProducts,
			backgroundLayer: action.payload,
		},
	};
};
