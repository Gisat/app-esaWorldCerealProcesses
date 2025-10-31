import { WorldCerealStateActionType } from '../../state.actionTypes';
import { CreateCustomProductsPostprocessMethodModel } from '../../state.models';

/**
 * Action interface for setting the postprocess method in createCustomProducts.
 */
export interface SetPostprocessMethod_customProducts {
	type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_POSTPROCESS_METHOD;
	payload: CreateCustomProductsPostprocessMethodModel;
}
