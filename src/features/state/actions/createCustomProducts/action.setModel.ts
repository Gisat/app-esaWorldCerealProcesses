import { WorldCerealStateActionType } from '@features/state/state.actionTypes';
import { CreateCustomProductsModelModel } from '@features/state/state.models';

/**
 * Interface representing the action to set the model in the `createCustomProducts` process.
 *
 * This action is dispatched to update the model settings in the `createCustomProducts` section of the application state.
 *
 * @interface SetModelAction_customProducts
 * @property {WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_MODEL} type - The type of the action, indicating an update to the model settings.
 * @property {CreateCustomProductsModelModel} payload - The payload containing the model to be set.
 */
export interface SetModelAction_customProducts {
	type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_MODEL;
	payload: CreateCustomProductsModelModel;
}
