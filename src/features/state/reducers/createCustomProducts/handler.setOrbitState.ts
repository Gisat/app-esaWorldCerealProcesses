import { WorldCerealState } from '../../../state/state.models';
import { SetOrbitState_customProducts } from '../../actions/createCustomProducts/action.setOrbitState';

/**
 * Reducer handler for setting the orbit state in createCustomProducts.
 *
 * @param {WorldCerealState} state - The current application state.
 * @param {SetOrbitState_customProducts} action - The dispatched action.
 * @returns {WorldCerealState} The updated application state.
 */
export function setOrbitStateHandler_customProducts(
	state: WorldCerealState,
	action: SetOrbitState_customProducts
): WorldCerealState {
	return {
		...state,
		createCustomProducts: {
			...state.createCustomProducts,
			orbitState: action.payload,
		},
	};
}
