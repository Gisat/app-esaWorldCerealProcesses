import { WorldCerealStateActionType } from '@features/state/state.actionTypes';
import { CreateCustomProductsEnableCroplandHeadModel } from '@features/state/state.models';

/**
 * Action interface for setting the enable cropland head flag in createCustomProducts.
 */
export interface SetEnableCroplandHeadAction_customProducts {
	type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_ENABLE_CROPLAND_HEAD;
	payload: CreateCustomProductsEnableCroplandHeadModel;
}
