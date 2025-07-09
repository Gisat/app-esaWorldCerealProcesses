import { AppSpecficReducerFunc } from '@gisatcz/ptr-fe-core/client';
import { WorldCerealState } from '../../state.models';
import { OneOfWorldCerealActions } from '../../state.actions';
import { SetCurrentJobKeyAction } from '@features/state/actions/downloadOfficialProduct/action.setCurrentJobKey';

export const setCurrentJobKeyHandler: AppSpecficReducerFunc<WorldCerealState, OneOfWorldCerealActions> = (
	state: WorldCerealState,
	action: SetCurrentJobKeyAction
): WorldCerealState => {
	return {
		...state,
		downloadOfficialProducts: {
			...state.downloadOfficialProducts,
			currentJobKey: action.payload,
		},
	};
};
