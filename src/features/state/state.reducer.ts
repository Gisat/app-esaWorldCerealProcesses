import { AppSpecficReducerFunc, AppSpecificReducerMap } from '@gisatcz/ptr-fe-core/client';
import { WorldCerealState } from './state.models';
import { OneOfWorldCerealActions } from './state.actions';
import { WorldCerealStateActionType } from './state.actionTypes';
import { setCollectionHandler } from '@features/state/reducers/downloadOfficialProduct/handler.setCollection';
import { setProductHandler } from '@features/state/reducers/downloadOfficialProduct/handler.setProduct';
import { setOutputFileFormatHandler } from '@features/state/reducers/downloadOfficialProduct/handler.setOutputFileFormat';
import { setBBoxHandler } from '@features/state/reducers/downloadOfficialProduct/handler.setBBox';
import { setBackgroundLayerHandler } from '@features/state/reducers/downloadOfficialProduct/handler.setBackgroundLayer';
import { setCurrentJobKeyHandler } from '@features/state/reducers/downloadOfficialProduct/handler.setCurrentJobKey';
import { resetSettingsHandler } from '@features/state/reducers/downloadOfficialProduct/handler.resetSettings';
import { setActiveStepHandler } from '@features/state/reducers/downloadOfficialProduct/handler.setActiveStep';
import { setActiveStepHandler_customProducts } from '@features/state/reducers/createCustomProducts/handler.setActiveStep';
import { resetSettingsHandler_customProducts } from '@features/state/reducers/createCustomProducts/handler.resetSettings';
import { setBackgroundLayerHandler_customProducts } from '@features/state/reducers/createCustomProducts/handler.setBackgroundLayer';
import { setBBoxHandler_customProducts } from '@features/state/reducers/createCustomProducts/handler.setBBox';
import { setCurrentJobKeyHandler_customProducts } from '@features/state/reducers/createCustomProducts/handler.setCurrentJobKey';
import { setOutputFileFormatHandler_customProducts } from '@features/state/reducers/createCustomProducts/handler.setOutputFileFormat';
import { setProductHandler_customProducts } from '@features/state/reducers/createCustomProducts/handler.setProduct';
import { setModelHandler_customProducts } from '@features/state/reducers/createCustomProducts/handler.setModel';
import { setEndDateHandler_customProducts } from '@features/state/reducers/createCustomProducts/handler.setEndDate';
import { setOrbitStateHandler_customProducts } from './reducers/createCustomProducts/handler.setOrbitState';
import { setPostprocessMethodHandler_customProducts } from './reducers/createCustomProducts/handler.setPostprocessMethod';
import { setPostprocessKernelSizeHandler_customProducts } from './reducers/createCustomProducts/handler.setPostprocessKernelSize';

/**
 * Creates and returns a map of reducer functions specific to the WorldCereal application state management.
 *
 * This map is used to extend or override the default reducer behavior provided by the NPM package.
 * Each key in the map corresponds to an action type, and the value is a reducer function that handles
 * the state transformation for that action type.
 *
 * @returns {AppSpecificReducerMap<WorldCerealState, OneOfWorldCerealActions>} A map where keys are action types
 *                                                                             and values are reducer functions
 *                                                                             for specific state transformations.
 *
 * @example
 * const reducerMap = stateReducerMapForWorldCerealApplication();
 * // reducerMap contains custom reducer handlers for WorldCereal state actions
 */
export const stateReducerMapForWorldCerealApplication = (): AppSpecificReducerMap<
	WorldCerealState,
	OneOfWorldCerealActions
> => {
	// Create a map to associate action types with their corresponding reducer functions.
	const map = new Map<string, AppSpecficReducerFunc<WorldCerealState, OneOfWorldCerealActions>>();

	// Map each action type to its handler function.
	// Download official products handlers
	map.set(WorldCerealStateActionType.DOWNLOAD_OFFICIAL_PRODUCT_SET_ACTIVE_STEP as string, setActiveStepHandler);
	map.set(WorldCerealStateActionType.DOWNLOAD_OFFICIAL_PRODUCT_SET_COLLECTION as string, setCollectionHandler);
	map.set(WorldCerealStateActionType.DOWNLOAD_OFFICIAL_PRODUCT_SET_PRODUCT as string, setProductHandler);
	map.set(
		WorldCerealStateActionType.DOWNLOAD_OFFICIAL_PRODUCT_SET_OUTPUT_FILE_FORMAT as string,
		setOutputFileFormatHandler
	);
	map.set(WorldCerealStateActionType.DOWNLOAD_OFFICIAL_PRODUCT_SET_BBOX as string, setBBoxHandler);
	map.set(
		WorldCerealStateActionType.DOWNLOAD_OFFICIAL_PRODUCT_SET_BACKGROUND_LAYER as string,
		setBackgroundLayerHandler
	);
	map.set(WorldCerealStateActionType.DOWNLOAD_OFFICIAL_PRODUCT_SET_CURRENT_JOB_KEY as string, setCurrentJobKeyHandler);
	map.set(WorldCerealStateActionType.DOWNLOAD_OFFICIAL_PRODUCT_RESET_SETTINGS as string, resetSettingsHandler);

	// Create custom products handlers
	map.set(
		WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_ACTIVE_STEP as string,
		setActiveStepHandler_customProducts
	);
	map.set(
		WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_RESET_SETTINGS as string,
		resetSettingsHandler_customProducts
	);
	map.set(
		WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_BACKGROUND_LAYER as string,
		setBackgroundLayerHandler_customProducts
	);
	map.set(WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_BBOX as string, setBBoxHandler_customProducts);
	map.set(
		WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_CURRENT_JOB_KEY as string,
		setCurrentJobKeyHandler_customProducts
	);
	map.set(
		WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_OUTPUT_FILE_FORMAT as string,
		setOutputFileFormatHandler_customProducts
	);
	map.set(WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_PRODUCT as string, setProductHandler_customProducts);
	map.set(WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_MODEL as string, setModelHandler_customProducts);
	map.set(WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_END_DATE as string, setEndDateHandler_customProducts);
	map.set(
		WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_ORBIT_STATE as string,
		setOrbitStateHandler_customProducts
	);
	map.set(
		WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_POSTPROCESS_METHOD as string,
		setPostprocessMethodHandler_customProducts
	);
	map.set(
		WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_POSTPROCESS_KERNEL_SIZE as string,
		setPostprocessKernelSizeHandler_customProducts
	);

	// Return the map to be merged with the default reducer map in the ptr-fe-core package.
	return map;
};
