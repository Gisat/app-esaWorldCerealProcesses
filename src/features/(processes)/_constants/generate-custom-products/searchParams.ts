import {
	createSearchParamsCache,
	createSerializer,
	parseAsBoolean,
	parseAsInteger,
	parseAsString,
	parseAsStringLiteral,
} from 'nuqs/server';
import formParams from './formParams';
import { generateCustomProductsDefaults as defaults } from './defaults';

const productValues = formParams.product.options.filter((o) => !o.disabled).map((o) => o.value) as [string, ...string[]];
const outputFileFormatValues = formParams.outputFileFormat.options.map((o) => o.value) as [string, ...string[]];
const orbitStateValues = formParams.orbitState.options.map((o) => o.value) as [string, ...string[]];
const postprocessMethodValues = formParams.postprocessMethod.options.map((o) => o.value) as [string, ...string[]];
const cropTypeModelTypeValues = formParams.cropTypeModelType.options.map((o) => o.value) as [string, ...string[]];
const postprocessMethodCroplandValues = formParams.postprocessMethodCropland.options.map((o) => o.value) as [string, ...string[]];

/**
 * Shared parser map for generate-custom-products. Used by:
 *  - createSearchParamsCache (server hydration)
 *  - useQueryStates (client components)
 *
 * Typing notes:
 *  - outputFileFormat / orbitState / postprocessMethod / postprocessKernelSize use .withDefault(...) -> return concrete type (never null).
 *  - product / model / bbox / backgroundLayer / endDate / jobKey have NO default -> return `string | null`.
 *    `null` means "not set"; setting to null removes the key from the URL.
 */
export const generateCustomProductsSearchParams = {
	product: parseAsStringLiteral(productValues),
	model: parseAsString.withDefault(defaults.model ?? 'default'),
	cropTypeModelType: parseAsStringLiteral(cropTypeModelTypeValues).withDefault(defaults.cropTypeModelType ?? 'default'),
	outputFileFormat: parseAsStringLiteral(outputFileFormatValues).withDefault(defaults.outputFileFormat!),
	bbox: parseAsString,
	backgroundLayer: parseAsString,
	endDate: parseAsString.withDefault(defaults.endDate ?? '2025-09-30'),
	orbitState: parseAsStringLiteral(orbitStateValues).withDefault(defaults.orbitState!),
	postprocessMethod: parseAsStringLiteral(postprocessMethodValues).withDefault(defaults.postprocessMethod!),
	postprocessKernelSize: parseAsInteger.withDefault(5),
	seasonalModelZip: parseAsString,
	enableCroplandHead: parseAsBoolean.withDefault(true),
	landcoverHeadZip: parseAsString,
	croptypeHeadZip: parseAsString,
	maskCropland: parseAsBoolean.withDefault(true),
	postprocessMethodCropland: parseAsStringLiteral(postprocessMethodCroplandValues).withDefault(defaults.postprocessMethodCropland!),
	postprocessKernelSizeCropland: parseAsInteger.withDefault(3),
	jobKey: parseAsString,
};

export const generateCustomProductsSearchParamsCache = createSearchParamsCache(generateCustomProductsSearchParams);

/**
 * Serializes a partial set of generate-custom-products URL state values into
 * a path + query string for a given route. Honours the same `clearOnDefault`
 * rules as `useQueryStates`, so values equal to their default are omitted.
 *
 * Usage:
 *   serializeGenerateCustomProductsSearchParams('/path', { product: 'X', model: 'Y' })
 *   // => '/path?product=X&model=Y'
 */
export const serializeGenerateCustomProductsSearchParams = createSerializer(generateCustomProductsSearchParams);
