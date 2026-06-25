import { AppSpecficReducerFunc } from '@gisatcz/ptr-fe-core/client';
import { WorldCerealState } from '../../state.models';
import { OneOfWorldCerealActions } from '../../state.actions';
import { SetPostprocessMethodCroplandAction_customProducts } from '@features/state/actions/createCustomProducts/action.setPostprocessMethodCropland';

export const setPostprocessMethodCroplandHandler_customProducts: AppSpecficReducerFunc<WorldCerealState, OneOfWorldCerealActions> = (
	state: WorldCerealState,
	action: SetPostprocessMethodCroplandAction_customProducts
): WorldCerealState => {
	return {
		...state,
		createCustomProducts: {
			...state.createCustomProducts,
			postprocessMethodCropland: action.payload,
		},
	};
};
