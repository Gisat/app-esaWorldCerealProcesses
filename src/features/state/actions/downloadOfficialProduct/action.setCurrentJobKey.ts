import { WorldCerealStateActionType } from '@features/state/state.actionTypes';
import { DownloadOfficialProductsCurrentJobKeyModel } from '@features/state/state.models';

/**
 * Interface representing the action to set the current job key in the `downloadOfficialProducts` section of the state.
 *
 * This action is dispatched to update the `currentJobKey` property in the application state.
 *
 * @interface SetCurrentJobKeyAction
 * @property {WorldCerealStateActionType.DOWNLOAD_OFFICIAL_PRODUCT_SET_CURRENT_JOB_KEY} type - The type of the action.
 * @property {DownloadOfficialProductsCurrentJobKeyModel} payload - The payload containing the new `currentJobKey` value.
 */
export interface SetCurrentJobKeyAction {
	type: WorldCerealStateActionType.DOWNLOAD_OFFICIAL_PRODUCT_SET_CURRENT_JOB_KEY;
	payload: DownloadOfficialProductsCurrentJobKeyModel;
}
