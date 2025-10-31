import { WorldCerealStateActionType } from '../../state.actionTypes';
import { CreateCustomProductsPostprocessKernelSizeModel } from '../../state.models';

/**
 * Action interface for setting the postprocess kernel size in createCustomProducts.
 */
export interface SetPostprocessKernelSize_customProducts {
	type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_POSTPROCESS_KERNEL_SIZE;
	payload: CreateCustomProductsPostprocessKernelSizeModel;
}
