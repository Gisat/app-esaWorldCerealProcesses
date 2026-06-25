import { WorldCerealStateActionType } from '@features/state/state.actionTypes';
import { CreateCustomProductsPostprocessMethodCroplandModel } from '@features/state/state.models';

/**
 * Action interface for setting the postprocess method for cropland in createCustomProducts.
 */
export interface SetPostprocessMethodCroplandAction_customProducts {
	type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_POSTPROCESS_METHOD_CROPLAND;
	payload: CreateCustomProductsPostprocessMethodCroplandModel;
}
