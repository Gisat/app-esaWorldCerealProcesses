import { AppSpecficReducerFunc } from '@gisatcz/ptr-fe-core/client';
import { WorldCerealState } from '../../state.models';

export const resetSettingsHandler_customProducts: AppSpecficReducerFunc<WorldCerealState> = (
	state: WorldCerealState
): WorldCerealState => {
	return {
		...state,
		createCustomProducts: {
			...state.createCustomProducts,
			activeStep: state.createCustomProducts?.activeStep || 1,
			backgroundLayer: undefined,
			bbox: undefined,
			product: undefined,
			// currentJobKey: undefined,
			outputFileFormat: 'GTiff', // Reset to default format
			model: undefined,
			endDate: undefined,
		},
	};
};
