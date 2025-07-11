import { mockState as state } from '../../mockState';
import { getActiveStep } from '@features/state/selectors/downloadOfficialProducts/getActiveStep';

describe('getActiveStep', () => {
	it('returns activeStep if defined', () => {
		expect(getActiveStep(state)).toBe(2);
	});

	it('returns 1 if activeStep is undefined', () => {
		const customState = {
			...state,
			downloadOfficialProducts: { ...state.downloadOfficialProducts, activeStep: undefined },
		};
		expect(getActiveStep(customState)).toBe(1);
	});
});
