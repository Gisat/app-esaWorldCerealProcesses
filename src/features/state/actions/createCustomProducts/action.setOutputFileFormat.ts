import { WorldCerealStateActionType } from '@features/state/state.actionTypes';
import { CreateCustomProductsOutputFileFormatModel } from '@features/state/state.models';

/**
 * Interface representing the action to set the output file format in the `createCustomProducts` process.
 *
 * This action is dispatched to update the output file format settings in the `createCustomProducts` section of the application state.
 *
 * @interface SetOutputFileFormatAction_customProducts
 * @property {WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_OUTPUT_FILE_FORMAT} type - The type of the action, indicating an update to the output file format settings.
 * @property {CreateCustomProductsOutputFileFormatModel} payload - The payload containing the output file format model to be set.
 */
export interface SetOutputFileFormatAction_customProducts {
	type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_OUTPUT_FILE_FORMAT;
	payload: CreateCustomProductsOutputFileFormatModel;
}
