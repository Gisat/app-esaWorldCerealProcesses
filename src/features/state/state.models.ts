import { AppSharedState } from '@gisatcz/ptr-fe-core/client';

/**
 * Type representing the possible values for the `activeStep` property.
 *
 * This type defines the steps in the `downloadOfficialProducts` process, which can be `1`, `2`, or `3`.
 */
export type DownloadOfficialProductsActiveStepModel = 1 | 2 | 3;

/**
 * Type representing the `collection` property in the `downloadOfficialProducts` section.
 *
 * This type can either be a `string` or `undefined`, indicating the current collection or its absence.
 */
export type DownloadOfficialProductsCollectionModel = string | undefined;

/**
 * Type representing the `product` property in the `downloadOfficialProducts` section.
 *
 * This type can either be a `string` or `undefined`, indicating the current product or its absence.
 */
export type DownloadOfficialProductsProductModel = string | undefined;

export type DownloadOfficialProductsOutputFileFormatModel = 'GTiff' | 'NETCDF';

export type DownloadOfficialProductsBackgroundLayerModel = string;
export type DownloadOfficialProductsBBoxModel = [number, number, number, number] | undefined;
export type DownloadOfficialProductsCurrentJobKeyModel = string | undefined;

/**
 * Interface representing the `downloadOfficialProducts` section of the application state.
 *
 * This interface includes properties for managing the active step, collection, and product
 * in the `downloadOfficialProducts` process.
 *
 * @interface DownloadOfficialProductsModel
 * @property {DownloadOfficialProductsActiveStepModel} activeStep - The current step in the process.
 * @property {DownloadOfficialProductsCollectionModel} [collection] - The current collection, if defined.
 * @property {DownloadOfficialProductsProductModel} [product] - The current product, if defined.
 */
export interface DownloadOfficialProductsModel {
	activeStep: DownloadOfficialProductsActiveStepModel;
	collection?: DownloadOfficialProductsCollectionModel;
	product?: DownloadOfficialProductsProductModel;
	outputFileFormat: DownloadOfficialProductsOutputFileFormatModel;
	backgroundLayer?: DownloadOfficialProductsBackgroundLayerModel;
	bbox?: DownloadOfficialProductsBBoxModel;
	currentJobKey?: DownloadOfficialProductsCurrentJobKeyModel;
}

/**
 * Interface representing the global application state.
 *
 * This interface extends the shared application state and includes the `downloadOfficialProducts` section.
 *
 * @interface WorldCerealState
 * @extends AppSharedState
 * @property {DownloadOfficialProductsModel} downloadOfficialProducts - The state related to downloading official products.
 */
export interface WorldCerealState extends AppSharedState {
	downloadOfficialProducts: DownloadOfficialProductsModel;
}
