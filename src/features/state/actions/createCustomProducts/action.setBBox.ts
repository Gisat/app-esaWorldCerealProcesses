import { WorldCerealStateActionType } from '@features/state/state.actionTypes';
import { CreateCustomProductsBBoxModel } from '@features/state/state.models';

/**
 * Interface representing the action to set the bounding box (BBox) in the `createCustomProducts` process.
 *
 * This action is dispatched to update the bounding box settings in the `createCustomProducts` section of the application state.
 *
 * @interface SetBBoxAction_customProducts
 * @property {WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_BBOX} type - The type of the action, indicating an update to the bounding box settings.
 * @property {CreateCustomProductsBBoxModel} payload - The payload containing the bounding box model to be set.
 */
export interface SetBBoxAction_customProducts {
	type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_BBOX;
	payload: CreateCustomProductsBBoxModel;
}
