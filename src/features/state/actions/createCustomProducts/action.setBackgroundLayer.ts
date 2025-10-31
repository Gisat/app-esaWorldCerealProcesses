import { WorldCerealStateActionType } from '@features/state/state.actionTypes';
import { CreateCustomProductsBackgroundLayerModel } from '@features/state/state.models';

/**
 * Interface representing the action to set the background layer in the `createCustomProducts` process.
 *
 * This action is dispatched to update the background layer settings in the `createCustomProducts` section of the application state.
 *
 * @interface SetBackgroundLayerAction_customProducts
 * @property {WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_BACKGROUND_LAYER} type - The type of the action, indicating an update to the background layer settings.
 * @property {CreateCustomProductsBackgroundLayerModel} payload - The payload containing the background layer model to be set.
 */
export interface SetBackgroundLayerAction_customProducts {
	type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_BACKGROUND_LAYER;
	payload: CreateCustomProductsBackgroundLayerModel;
}
