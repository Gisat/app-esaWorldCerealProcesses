import { AppSharedState } from '@gisatcz/ptr-fe-core/client';

export type DownloadOfficialProductsActiveStepModel = 1 | 2 | 3;
export type DownloadOfficialProductsCollectionModel = string | undefined;
export type DownloadOfficialProductsProductModel = string | undefined;
export type DownloadOfficialProductsOutputFileFormatModel = 'GTiff' | 'NETCDF';
export type DownloadOfficialProductsBackgroundLayerModel = string;
export type DownloadOfficialProductsBBoxModel = [number, number, number, number] | undefined;
export type DownloadOfficialProductsCurrentJobKeyModel = string | undefined;

export type CreateCustomProductsActiveStepModel = 1 | 2 | 3;
export type CreateCustomProductsProductModel = string | undefined;
export type CreateCustomProductsModelModel = string | null;
export type CreateCustomProductsBackgroundLayerModel = string;
export type CreateCustomProductsOutputFileFormatModel = 'GTiff' | 'NETCDF';
export type CreateCustomProductsBBoxModel = [number, number, number, number] | undefined;
export type CreateCustomProductsEndDateModel = string | undefined;
export type CreateCustomProductsCurrentJobKeyModel = string | undefined;
export type CreateCustomProductsOrbitStateModel = 'ASCENDING' | 'DESCENDING';
export type CreateCustomProductsPostprocessMethodModel = 'smooth_probabilities' | 'majority_vote';
export type CreateCustomProductsPostprocessKernelSizeModel = number;

/**
 * Interface representing the `downloadOfficialProducts` section of the application state.
 *
 * This interface includes properties for managing the active step, collection, product, and other details
 * in the `downloadOfficialProducts` process.
 *
 * @interface DownloadOfficialProductsModel
 * @property {DownloadOfficialProductsActiveStepModel} [activeStep] - The current step in the process.
 * @property {DownloadOfficialProductsCollectionModel} [collection] - The current collection, if defined.
 * @property {DownloadOfficialProductsProductModel} [product] - The current product, if defined.
 * @property {DownloadOfficialProductsOutputFileFormatModel} [outputFileFormat] - The format of the output file.
 * @property {DownloadOfficialProductsBackgroundLayerModel} [backgroundLayer] - The background layer used in the process.
 * @property {DownloadOfficialProductsBBoxModel} [bbox] - The bounding box for the process, if defined.
 * @property {DownloadOfficialProductsCurrentJobKeyModel} [currentJobKey] - The key of the current job, if defined.
 */
export interface DownloadOfficialProductsModel {
	activeStep?: DownloadOfficialProductsActiveStepModel;
	collection?: DownloadOfficialProductsCollectionModel;
	product?: DownloadOfficialProductsProductModel;
	outputFileFormat?: DownloadOfficialProductsOutputFileFormatModel;
	backgroundLayer?: DownloadOfficialProductsBackgroundLayerModel;
	bbox?: DownloadOfficialProductsBBoxModel;
	currentJobKey?: DownloadOfficialProductsCurrentJobKeyModel;
}

/**
 * Type representing the `createCustomProducts` section of the application state.
 *
 * This type includes properties for managing the active step, product, model, and other details
 * in the `createCustomProducts` process.
 *
 * @typedef {Object} CreateCustomProductsModel
 * @property {CreateCustomProductsActiveStepModel} [activeStep] - The current step in the process.
 * @property {CreateCustomProductsProductModel} [product] - The current product, if defined.
 * @property {CreateCustomProductsModelModel} [model] - The model used in the process, typically an URL.
 * @property {CreateCustomProductsBackgroundLayerModel} [backgroundLayer] - The background layer used in the process.
 * @property {CreateCustomProductsOutputFileFormatModel} [outputFileFormat] - The format of the output file.
 * @property {CreateCustomProductsBBoxModel} [bbox] - The bounding box for the process, if defined.
 * @property {CreateCustomProductsEndDateModel} [endDate] - The end date for the process, if defined.
 * @property {CreateCustomProductsCurrentJobKeyModel} [currentJobKey] - The key of the current job, if defined.
 * @property {CreateCustomProductsOrbitStateModel} [orbitState] - The orbit state ("ASCENDING" or "DESCENDING").
 * @property {CreateCustomProductsPostprocessMethodModel} [postprocessMethod] - The postprocess method ("smooth_probabilities" or "majority_vote").
 * @property {CreateCustomProductsPostprocessKernelSizeModel} [postprocessKernelSize] - The kernel size for majority_vote postprocessing.
 
 */
export type CreateCustomProductsModel = {
	activeStep?: CreateCustomProductsActiveStepModel;
	product?: CreateCustomProductsProductModel;
	model?: CreateCustomProductsModelModel;
	backgroundLayer?: CreateCustomProductsBackgroundLayerModel;
	outputFileFormat?: CreateCustomProductsOutputFileFormatModel;
	bbox?: CreateCustomProductsBBoxModel;
	endDate?: CreateCustomProductsEndDateModel;
	currentJobKey?: CreateCustomProductsCurrentJobKeyModel;
	orbitState?: CreateCustomProductsOrbitStateModel;
	postprocessMethod?: CreateCustomProductsPostprocessMethodModel;
	postprocessKernelSize?: CreateCustomProductsPostprocessKernelSizeModel;
};

/**
 * Interface representing the global application state.
 *
 * This interface extends the shared application state and includes sections for managing
 * both official product downloads and custom product creation processes.
 *
 * @interface WorldCerealState
 * @extends AppSharedState
 * @property {DownloadOfficialProductsModel} [downloadOfficialProducts] - The state related to downloading official products.
 * @property {CreateCustomProductsModel} [createCustomProducts] - The state related to creating custom products.
 */
export interface WorldCerealState extends AppSharedState {
	downloadOfficialProducts?: DownloadOfficialProductsModel;
	createCustomProducts?: CreateCustomProductsModel;
}
