import { WorldCerealStateActionType } from '@features/state/state.actionTypes';
import { DownloadOfficialProductsCollectionModel } from '@features/state/state.models';

/**
 * Interface representing the `SetCollectionAction`.
 *
 * This action is used to update the `collection` property in the `downloadOfficialProducts` section
 * of the application state.
 *
 * @interface SetCollectionAction
 * @property {WorldCerealStateActionType.DOWNLOAD_OFFICIAL_PRODUCT_SET_COLLECTION} type - The type of the action.
 * @property {DownloadOfficialProductsCollectionModel} payload - The new value for the `collection` property.
 */
export interface SetCollectionAction {
	type: WorldCerealStateActionType.DOWNLOAD_OFFICIAL_PRODUCT_SET_COLLECTION;
	payload: DownloadOfficialProductsCollectionModel;
}
