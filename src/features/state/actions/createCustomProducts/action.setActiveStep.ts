import { WorldCerealStateActionType } from '@features/state/state.actionTypes';
import { CreateCustomProductsActiveStepModel } from '@features/state/state.models';

/**
 * Interface representing the action to set the active step in the `createCustomProducts` process.
 *
 * This action is dispatched to update the `activeStep` property in the application state for the
 * `createCustomProducts` section.
 *
 * @interface SetActiveStepAction_customProducts
 * @property {WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_ACTIVE_STEP} type - The type of the action.
 * @property {CreateCustomProductsActiveStepModel} payload - The new active step to be set in the state.
 */
export interface SetActiveStepAction_customProducts {
	type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_ACTIVE_STEP;
	payload: CreateCustomProductsActiveStepModel;
}
