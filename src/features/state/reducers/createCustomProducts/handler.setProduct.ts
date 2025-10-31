import { AppSpecficReducerFunc } from '@gisatcz/ptr-fe-core/client';
import { WorldCerealState } from '../../state.models';
import { OneOfWorldCerealActions } from '../../state.actions';
import { SetProductAction_customProducts } from '@features/state/actions/createCustomProducts/action.setProduct';

/**
 * Reducer function to handle the `setProduct` action for the `createCustomProducts` process.
 *
 * This function updates the `product` property in the `createCustomProducts` section of the application state.
 *
 * @function setProductHandler_customProducts
 * @param {WorldCerealState} state - The current state of the application.
 * @param {SetProductAction_customProducts} action - The dispatched action containing the payload to update the product.
 * @returns {WorldCerealState} - The updated state with the new product.
 */
export const setProductHandler_customProducts: AppSpecficReducerFunc<WorldCerealState, OneOfWorldCerealActions> = (
	state: WorldCerealState,
	action: SetProductAction_customProducts
): WorldCerealState => {
	return {
		...state,
		createCustomProducts: {
			...state.createCustomProducts,
			product: action.payload,
		},
	};
};
