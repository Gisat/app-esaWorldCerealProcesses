import { AppSpecficReducerFunc } from '@gisatcz/ptr-fe-core/client';
import { WorldCerealState } from '../../state.models';
import { OneOfWorldCerealActions } from '../../state.actions';
import { SetSeasonalModelZipAction_customProducts } from '@features/state/actions/createCustomProducts/action.setSeasonalModelZip';

export const setSeasonalModelZipHandler_customProducts: AppSpecficReducerFunc<WorldCerealState, OneOfWorldCerealActions> = (
	state: WorldCerealState,
	action: SetSeasonalModelZipAction_customProducts
): WorldCerealState => {
	return {
		...state,
		createCustomProducts: {
			...state.createCustomProducts,
			seasonalModelZip: action.payload,
		},
	};
};
