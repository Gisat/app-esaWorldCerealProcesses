import { WorldCerealStateActionType } from '@features/state/state.actionTypes';
import { DownloadOfficialProductsBBoxModel } from '@features/state/state.models';

/**
 * Interface representing the action to set the bounding box (BBox) in the `downloadOfficialProducts` section.
 *
 * This action is dispatched to update the `bbox` property in the application state.
 *
 * @interface SetBBoxAction
 * @property {WorldCerealStateActionType.DOWNLOAD_OFFICIAL_PRODUCT_SET_BBOX} type - The type of the action.
 * @property {DownloadOfficialProductsBBoxModel} payload - The new bounding box to be set.
 */
export interface SetBBoxAction {
	type: WorldCerealStateActionType.DOWNLOAD_OFFICIAL_PRODUCT_SET_BBOX;
	payload: DownloadOfficialProductsBBoxModel;
}
