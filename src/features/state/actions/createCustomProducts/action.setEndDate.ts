import { WorldCerealStateActionType } from '@features/state/state.actionTypes';
import { CreateCustomProductsEndDateModel } from '@features/state/state.models';

/**
 * Interface representing the action to set the end date in the `createCustomProducts` process.
 *
 * This action is dispatched to update the end date settings in the `createCustomProducts` section of the application state.
 *
 * @interface SetEndDateAction_customProducts
 * @property {WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_END_DATE} type - The type of the action, indicating an update to the end date settings.
 * @property {CreateCustomProductsEndDateModel} payload - The payload containing the end date model to be set.
 */
export interface SetEndDateAction_customProducts {
	type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_END_DATE;
	payload: CreateCustomProductsEndDateModel;
}
