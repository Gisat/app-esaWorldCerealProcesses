import { WorldCerealStateActionType } from '@features/state/state.actionTypes';
import { DownloadOfficialProductsBackgroundLayerModel } from '@features/state/state.models';

/**
 * Interface representing the action to set the background layer in the `downloadOfficialProducts` section.
 *
 * This action is dispatched to update the `backgroundLayer` property in the application state.
 *
 * @interface SetBackgroundLayerAction
 * @property {WorldCerealStateActionType.DOWNLOAD_OFFICIAL_PRODUCT_SET_BACKGROUND_LAYER} type - The type of the action.
 * @property {DownloadOfficialProductsBackgroundLayerModel} payload - The new background layer to be set.
 */
export interface SetBackgroundLayerAction {
	type: WorldCerealStateActionType.DOWNLOAD_OFFICIAL_PRODUCT_SET_BACKGROUND_LAYER;
	payload: DownloadOfficialProductsBackgroundLayerModel;
}
