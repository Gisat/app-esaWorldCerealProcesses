import { WorldCerealStateActionType } from '@features/state/state.actionTypes';
import { DownloadOfficialProductsOutputFileFormatModel } from '@features/state/state.models';

/**
 * Interface representing the action to set the output file format in the `downloadOfficialProducts` section.
 *
 * This action is dispatched to update the `outputFileFormat` property in the application state.
 *
 * @interface SetOutputFileFormatAction
 * @property {WorldCerealStateActionType.DOWNLOAD_OFFICIAL_PRODUCT_SET_OUTPUT_FILE_FORMAT} type - The type of the action.
 * @property {DownloadOfficialProductsOutputFileFormatModel} payload - The new output file format to be set.
 */
export interface SetOutputFileFormatAction {
	type: WorldCerealStateActionType.DOWNLOAD_OFFICIAL_PRODUCT_SET_OUTPUT_FILE_FORMAT;
	payload: DownloadOfficialProductsOutputFileFormatModel;
}
