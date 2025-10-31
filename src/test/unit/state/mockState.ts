import { WorldCerealState } from '@features/state/state.models';

export const mockState: WorldCerealState = {
	downloadOfficialProducts: {
		activeStep: 2,
		backgroundLayer: 'satellite',
		bbox: [12.0, 48.0, 13.0, 49.0],
		collection: 'S2',
		currentJobKey: 'job-123',
		outputFileFormat: 'GTiff',
		product: 'NDVI',
	},
} as WorldCerealState;
