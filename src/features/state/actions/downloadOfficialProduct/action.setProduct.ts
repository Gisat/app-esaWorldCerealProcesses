import { WorldCerealStateActionType } from '@features/state/state.actionTypes';
import { DownloadOfficialProductsProductModel } from '@features/state/state.models';

/**
 * Interface representing the `SetProductAction`.
 *
 * This action is used to update the `product` property in the `downloadOfficialProducts` section
 * of the application state.
 *
 * @interface SetProductAction
 * @property {WorldCerealStateActionType.DOWNLOAD_OFFICIAL_PRODUCT_SET_PRODUCT} type - The type of the action.
 * @property {DownloadOfficialProductsProductModel} payload - The new value for the `product` property.
 */
export interface SetProductAction {
	type: WorldCerealStateActionType.DOWNLOAD_OFFICIAL_PRODUCT_SET_PRODUCT;
	payload: DownloadOfficialProductsProductModel;
}
