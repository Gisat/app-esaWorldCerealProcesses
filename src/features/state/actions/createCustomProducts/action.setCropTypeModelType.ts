import { WorldCerealStateActionType } from '@features/state/state.actionTypes';
import { CreateCustomProductsCropTypeModelTypeModel } from '@features/state/state.models';

/**
 * Action interface for setting the crop type model type in createCustomProducts.
 */
export interface SetCropTypeModelTypeAction_customProducts {
	type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_CROP_TYPE_MODEL_TYPE;
	payload: CreateCustomProductsCropTypeModelTypeModel;
}
