import { WorldCerealStateActionType } from '@features/state/state.actionTypes';
import { CreateCustomProductsProductModel } from '@features/state/state.models';

/**
 * Interface representing the action to set the product in the `createCustomProducts` process.
 *
 * This action is dispatched to update the product settings in the `createCustomProducts` section of the application state.
 *
 * @interface SetProductAction_customProducts
 * @property {WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_PRODUCT} type - The type of the action, indicating an update to the product settings.
 * @property {CreateCustomProductsProductModel} payload - The payload containing the product model to be set.
 */
export interface SetProductAction_customProducts {
	type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_PRODUCT;
	payload: CreateCustomProductsProductModel;
}
