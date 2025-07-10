import { SetActiveStepAction } from '@features/state/actions/downloadOfficialProduct/action.setActiveStep';
import { setActiveStepHandler } from '@features/state/reducers/downloadOfficialProduct/handler.setActiveStep';
import { WorldCerealStateActionType } from '@features/state/state.actionTypes';
import { mockState } from '../../mockState';

it('updates activeStep in state when a valid payload is provided', () => {
	const action: SetActiveStepAction = {
		type: WorldCerealStateActionType.DOWNLOAD_OFFICIAL_PRODUCT_SET_ACTIVE_STEP,
		payload: 2,
	};

	const updatedState = setActiveStepHandler(mockState, action);

	expect(updatedState.downloadOfficialProducts?.activeStep).toBe(2);
});

it('does not modify other properties in state', () => {
	const action: SetActiveStepAction = {
		type: WorldCerealStateActionType.DOWNLOAD_OFFICIAL_PRODUCT_SET_ACTIVE_STEP,
		payload: 2,
	};

	const updatedState = setActiveStepHandler(mockState, action);
	expect(updatedState.downloadOfficialProducts?.product).toBe(mockState.downloadOfficialProducts?.product);
});
