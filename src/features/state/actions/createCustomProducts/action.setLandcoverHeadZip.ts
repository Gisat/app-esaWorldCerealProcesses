import { WorldCerealStateActionType } from '@features/state/state.actionTypes';
import { CreateCustomProductsLandcoverHeadZipModel } from '@features/state/state.models';

/**
 * Action interface for setting the landcover head zip URL in createCustomProducts.
 */
export interface SetLandcoverHeadZipAction_customProducts {
	type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_LANDCOVER_HEAD_ZIP;
	payload: CreateCustomProductsLandcoverHeadZipModel;
}
