import { AppSpecficReducerFunc } from '@gisatcz/ptr-fe-core/client';
import { WorldCerealState } from '../../state.models';
import { OneOfWorldCerealActions } from '../../state.actions';
import { SetLandcoverHeadZipAction_customProducts } from '@features/state/actions/createCustomProducts/action.setLandcoverHeadZip';

export const setLandcoverHeadZipHandler_customProducts: AppSpecficReducerFunc<WorldCerealState, OneOfWorldCerealActions> = (
	state: WorldCerealState,
	action: SetLandcoverHeadZipAction_customProducts
): WorldCerealState => {
	return {
		...state,
		createCustomProducts: {
			...state.createCustomProducts,
			landcoverHeadZip: action.payload,
		},
	};
};
