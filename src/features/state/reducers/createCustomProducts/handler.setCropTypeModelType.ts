import { AppSpecficReducerFunc } from '@gisatcz/ptr-fe-core/client';
import { WorldCerealState } from '../../state.models';
import { OneOfWorldCerealActions } from '../../state.actions';
import { SetCropTypeModelTypeAction_customProducts } from '@features/state/actions/createCustomProducts/action.setCropTypeModelType';

export const setCropTypeModelTypeHandler_customProducts: AppSpecficReducerFunc<WorldCerealState, OneOfWorldCerealActions> = (
	state: WorldCerealState,
	action: SetCropTypeModelTypeAction_customProducts
): WorldCerealState => {
	return {
		...state,
		createCustomProducts: {
			...state.createCustomProducts,
			cropTypeModelType: action.payload,
		},
	};
};
