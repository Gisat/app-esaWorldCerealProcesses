import { WorldCerealStateActionType } from '@features/state/state.actionTypes';
import { CreateCustomProductsMaskCroplandModel } from '@features/state/state.models';

/**
 * Action interface for setting the mask cropland flag in createCustomProducts.
 */
export interface SetMaskCroplandAction_customProducts {
	type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_MASK_CROPLAND;
	payload: CreateCustomProductsMaskCroplandModel;
}
