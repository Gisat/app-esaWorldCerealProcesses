import { WorldCerealStateActionType } from '@features/state/state.actionTypes';
import { DownloadOfficialProductsActiveStepModel } from '@features/state/state.models';

/**
 * Interface representing the `SetActiveStepAction`.
 *
 * This action is used to update the `activeStep` property in the `downloadOfficialProducts` section
 * of the application state.
 *
 * @interface SetActiveStepAction
 * @property {WorldCerealStateActionType.DOWNLOAD_OFFICIAL_PRODUCT_SET_ACTIVE_STEP} type - The type of the action.
 * @property {DownloadOfficialProductsActiveStepModel} payload - The new value for the `activeStep` property.
 */
export interface SetActiveStepAction {
	type: WorldCerealStateActionType.DOWNLOAD_OFFICIAL_PRODUCT_SET_ACTIVE_STEP;
	payload: DownloadOfficialProductsActiveStepModel;
}
