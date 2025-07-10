import { AppSpecficReducerFunc } from '@gisatcz/ptr-fe-core/client';
import { WorldCerealState } from '../../state.models';

export const resetSettingsHandler: AppSpecficReducerFunc<WorldCerealState> = (
	state: WorldCerealState
): WorldCerealState => {
	return {
		...state,
		downloadOfficialProducts: {
			...state.downloadOfficialProducts,
			backgroundLayer: undefined,
			bbox: undefined,
			collection: undefined,
			product: undefined,
			currentJobKey: undefined,
			outputFileFormat: 'GTiff', // Reset to default format
		},
	};
};
