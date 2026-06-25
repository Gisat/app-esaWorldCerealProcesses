import { WorldCerealStateActionType } from '@features/state/state.actionTypes';
import { CreateCustomProductsCroptypeHeadZipModel } from '@features/state/state.models';

/**
 * Action interface for setting the croptype head zip URL in createCustomProducts.
 */
export interface SetCroptypeHeadZipAction_customProducts {
	type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_CROPTYPE_HEAD_ZIP;
	payload: CreateCustomProductsCroptypeHeadZipModel;
}
