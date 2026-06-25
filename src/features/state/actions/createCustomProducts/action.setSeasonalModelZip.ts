import { WorldCerealStateActionType } from '@features/state/state.actionTypes';
import { CreateCustomProductsSeasonalModelZipModel } from '@features/state/state.models';

/**
 * Action interface for setting the seasonal model zip URL in createCustomProducts.
 */
export interface SetSeasonalModelZipAction_customProducts {
	type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_SEASONAL_MODEL_ZIP;
	payload: CreateCustomProductsSeasonalModelZipModel;
}
