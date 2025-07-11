/**
 * Action types for the world cereal app state.
 */
export enum WorldCerealStateActionType {
	DOWNLOAD_OFFICIAL_PRODUCT_SET_ACTIVE_STEP = 'downloadOfficialProductSetActiveStep',
	DOWNLOAD_OFFICIAL_PRODUCT_SET_COLLECTION = 'downloadOfficialProductSetCollection',
	DOWNLOAD_OFFICIAL_PRODUCT_SET_PRODUCT = 'downloadOfficialProductSetProduct',
	DOWNLOAD_OFFICIAL_PRODUCT_SET_OUTPUT_FILE_FORMAT = 'downloadOfficialProductSetOutputFileFormat',
	DOWNLOAD_OFFICIAL_PRODUCT_SET_BACKGROUND_LAYER = 'downloadOfficialProductSetBackgroundLayer',
	DOWNLOAD_OFFICIAL_PRODUCT_SET_BBOX = 'downloadOfficialProductSetBBox',
	DOWNLOAD_OFFICIAL_PRODUCT_SET_CURRENT_JOB_KEY = 'downloadOfficialProductSetCurrentJobKey',
	DOWNLOAD_OFFICIAL_PRODUCT_RESET_SETTINGS = 'downloadOfficialProductResetSettings',

	CREATE_CUSTOM_PRODUCTS_SET_ACTIVE_STEP = 'createCustomProductsSetActiveStep',
	CREATE_CUSTOM_PRODUCTS_SET_PRODUCT = 'createCustomProductsSetProduct',
	CREATE_CUSTOM_PRODUCTS_SET_MODEL = 'createCustomProductsSetModel',
	CREATE_CUSTOM_PRODUCTS_SET_BACKGROUND_LAYER = 'createCustomProductsSetBackgroundLayer',
	CREATE_CUSTOM_PRODUCTS_SET_OUTPUT_FILE_FORMAT = 'createCustomProductsSetOutputFileFormat',
	CREATE_CUSTOM_PRODUCTS_SET_BBOX = 'createCustomProductsSetBBox',
	CREATE_CUSTOM_PRODUCTS_SET_END_DATE = 'createCustomProductsSetEndDate',
	CREATE_CUSTOM_PRODUCTS_SET_CURRENT_JOB_KEY = 'createCustomProductsSetCurrentJobKey',
	CREATE_CUSTOM_PRODUCTS_RESET_SETTINGS = 'createCustomProductsResetSettings',
}
