import { WorldCerealState } from '../../../state/state.models';
import { SetPostprocessKernelSize_customProducts } from '../../actions/createCustomProducts/action.setPostprocessKernelSize';

/**
 * Reducer handler for setting the postprocess kernel size in createCustomProducts.
 *
 * @param {WorldCerealState} state - The current application state.
 * @param {SetPostprocessKernelSize_customProducts} action - The dispatched action.
 * @returns {WorldCerealState} The updated application state.
 */
export function setPostprocessKernelSizeHandler_customProducts(
	state: WorldCerealState,
	action: SetPostprocessKernelSize_customProducts
): WorldCerealState {
	return {
		...state,
		createCustomProducts: {
			...state.createCustomProducts,
			postprocessKernelSize: action.payload,
		},
	};
}
