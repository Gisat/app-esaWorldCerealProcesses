import { WorldCerealStateActionType } from '@features/state/state.actionTypes';

/**
 * Interface representing the action to reset settings in the "Download Official Products" process.
 *
 * This action is dispatched to reset all settings related to the download official products state.
 */
export interface ResetSettingsAction {
	/**
	 * The type of the action, indicating a reset of settings.
	 * @type {WorldCerealStateActionType.DOWNLOAD_OFFICIAL_PRODUCT_RESET_SETTINGS}
	 */
	type: WorldCerealStateActionType.DOWNLOAD_OFFICIAL_PRODUCT_RESET_SETTINGS;
}
