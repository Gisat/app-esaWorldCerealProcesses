import { WorldCerealStateActionType } from '../../state.actionTypes';
import { CreateCustomProductsOrbitStateModel } from '../../state.models';

/**
 * Action interface for setting the orbit state in createCustomProducts.
 */
export interface SetOrbitState_customProducts {
	type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_ORBIT_STATE;
	payload: CreateCustomProductsOrbitStateModel;
}
