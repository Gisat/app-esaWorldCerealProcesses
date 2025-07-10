import { SetActiveStepAction } from '@features/state/actions/downloadOfficialProduct/action.setActiveStep';
import { WorldCerealStateActionType } from '@features/state/state.actionTypes';
import { DownloadOfficialProductsActiveStepModel } from '@features/state/state.models';

it('creates an action with the correct type and payload', () => {
	const payload = 3;
	const action: SetActiveStepAction = {
		type: WorldCerealStateActionType.DOWNLOAD_OFFICIAL_PRODUCT_SET_ACTIVE_STEP,
		payload,
	};
	expect(action.type).toBe(WorldCerealStateActionType.DOWNLOAD_OFFICIAL_PRODUCT_SET_ACTIVE_STEP);
	expect(action.payload).toBe(payload);
});

it('handles undefined payload gracefully', () => {
	const action: SetActiveStepAction = {
		type: WorldCerealStateActionType.DOWNLOAD_OFFICIAL_PRODUCT_SET_ACTIVE_STEP,
		payload: undefined as unknown as DownloadOfficialProductsActiveStepModel,
	};
	expect(action.payload).toBeUndefined();
});
