import { WorldCerealStateActionType } from '@features/state/state.actionTypes';
import { CreateCustomProductsCurrentJobKeyModel } from '@features/state/state.models';

/**
 * Interface representing the action to set the current job key in the `createCustomProducts` process.
 *
 * This action is dispatched to update the current job key in the `createCustomProducts` section of the application state.
 *
 * @interface SetCurrentJobKeyAction_customProducts
 * @property {WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_CURRENT_JOB_KEY} type - The type of the action, indicating an update to the current job key.
 * @property {CreateCustomProductsCurrentJobKeyModel} payload - The payload containing the current job key model to be set.
 */
export interface SetCurrentJobKeyAction_customProducts {
	type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_CURRENT_JOB_KEY;
	payload: CreateCustomProductsCurrentJobKeyModel;
}
