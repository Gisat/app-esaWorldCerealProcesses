import { AppSpecficReducerFunc } from '@gisatcz/ptr-fe-core/client';
import { WorldCerealState } from '../../state.models';
import { OneOfWorldCerealActions } from '../../state.actions';
import { SetEnableCroplandHeadAction_customProducts } from '@features/state/actions/createCustomProducts/action.setEnableCroplandHead';

export const setEnableCroplandHeadHandler_customProducts: AppSpecficReducerFunc<WorldCerealState, OneOfWorldCerealActions> = (
	state: WorldCerealState,
	action: SetEnableCroplandHeadAction_customProducts
): WorldCerealState => {
	return {
		...state,
		createCustomProducts: {
			...state.createCustomProducts,
			enableCroplandHead: action.payload,
		},
	};
};
