import { WorldCerealStateActionType } from '@features/state/state.actionTypes';

/**
 * Interface representing the action to reset settings in the `createCustomProducts` process.
 *
 * This action is dispatched to reset the settings in the `createCustomProducts` section of the application state.
 *
 * @interface ResetSettingsAction_customProducts
 * @property {WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_RESET_SETTINGS} type - The type of the action, indicating a reset of settings in the `createCustomProducts` process.
 */
export interface ResetSettingsAction_customProducts {
	type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_RESET_SETTINGS;
}
