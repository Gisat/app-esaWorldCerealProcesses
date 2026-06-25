import { AppSpecficReducerFunc } from '@gisatcz/ptr-fe-core/client';
import { WorldCerealState } from '../../state.models';
import { OneOfWorldCerealActions } from '../../state.actions';
import { SetCroptypeHeadZipAction_customProducts } from '@features/state/actions/createCustomProducts/action.setCroptypeHeadZip';

export const setCroptypeHeadZipHandler_customProducts: AppSpecficReducerFunc<WorldCerealState, OneOfWorldCerealActions> = (
	state: WorldCerealState,
	action: SetCroptypeHeadZipAction_customProducts
): WorldCerealState => {
	return {
		...state,
		createCustomProducts: {
			...state.createCustomProducts,
			croptypeHeadZip: action.payload,
		},
	};
};
