import { WorldCerealStateActionType } from '@features/state/state.actionTypes';
import { CreateCustomProductsPostprocessKernelSizeCroplandModel } from '@features/state/state.models';

/**
 * Action interface for setting the postprocess kernel size for cropland in createCustomProducts.
 */
export interface SetPostprocessKernelSizeCroplandAction_customProducts {
	type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_POSTPROCESS_KERNEL_SIZE_CROPLAND;
	payload: CreateCustomProductsPostprocessKernelSizeCroplandModel;
}
