import { WorldCerealState } from '../../../state/state.models';
import { SetPostprocessMethod_customProducts } from '../../actions/createCustomProducts/action.setPostprocessMethod';

/**
 * Reducer handler for setting the postprocess method in createCustomProducts.
 *
 * @param {WorldCerealState} state - The current application state.
 * @param {SetPostprocessMethod_customProducts} action - The dispatched action.
 * @returns {WorldCerealState} The updated application state.
 */
export function setPostprocessMethodHandler_customProducts(
	state: WorldCerealState,
	action: SetPostprocessMethod_customProducts
): WorldCerealState {
	return {
		...state,
		createCustomProducts: {
			...state.createCustomProducts,
			postprocessMethod: action.payload,
		},
	};
}
