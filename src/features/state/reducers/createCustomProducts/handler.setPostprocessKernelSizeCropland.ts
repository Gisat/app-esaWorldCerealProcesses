import { AppSpecficReducerFunc } from '@gisatcz/ptr-fe-core/client';
import { WorldCerealState } from '../../state.models';
import { OneOfWorldCerealActions } from '../../state.actions';
import { SetPostprocessKernelSizeCroplandAction_customProducts } from '@features/state/actions/createCustomProducts/action.setPostprocessKernelSizeCropland';

export const setPostprocessKernelSizeCroplandHandler_customProducts: AppSpecficReducerFunc<WorldCerealState, OneOfWorldCerealActions> = (
	state: WorldCerealState,
	action: SetPostprocessKernelSizeCroplandAction_customProducts
): WorldCerealState => {
	return {
		...state,
		createCustomProducts: {
			...state.createCustomProducts,
			postprocessKernelSizeCropland: action.payload,
		},
	};
};
