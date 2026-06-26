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

const processIdValues = formParams.processId.options.filter((o) => !o.disabled).map((o) => o.value) as [string, ...string[]];
const formatValues = formParams.format.options.map((o) => o.value) as [string, ...string[]];
const orbitStateValues = formParams.orbitState.options.map((o) => o.value) as [string, ...string[]];
const postprocessMethodCroptypeValues = formParams.postprocessMethodCroptype.options.map((o) => o.value) as [string, ...string[]];
const cropTypeModelTypeValues = formParams.cropTypeModelType.options.map((o) => o.value) as [string, ...string[]];
const postprocessMethodCroplandValues = formParams.postprocessMethodCropland.options.map((o) => o.value) as [string, ...string[]];

/**
 * Shared parser map for generate-custom-products. Used by:
 *  - createSearchParamsCache (server hydration)
 *  - useQueryStates (client components)
 *
 * Typing notes:
 *  - format / orbitState / postprocessMethodCroptype / postprocessKernelSizeCroptype use .withDefault(...) -> return concrete type (never null).
 *  - processId / bbox / backgroundLayer / endDate / customSeasonId / selectedPeriodId / jobKey have NO default -> return `string | null`.
 *    `null` means "not set"; setting to null removes the key from the URL.
 */
export const generateCustomProductsSearchParams = {
	processId: parseAsStringLiteral(processIdValues),
	cropTypeModelType: parseAsStringLiteral(cropTypeModelTypeValues).withDefault(defaults.cropTypeModelType ?? 'default'),
	format: parseAsStringLiteral(formatValues).withDefault(defaults.format!),
	bbox: parseAsString,
	backgroundLayer: parseAsString,
	endDate: parseAsString.withDefault(defaults.endDate ?? '2025-09-30'),
	orbitState: parseAsStringLiteral(orbitStateValues).withDefault(defaults.orbitState!),
	postprocessMethodCroptype: parseAsStringLiteral(postprocessMethodCroptypeValues).withDefault(defaults.postprocessMethodCroptype!),
	postprocessKernelSizeCroptype: parseAsInteger.withDefault(3),
	seasonalModelZip: parseAsString,
	enableCroplandHead: parseAsBoolean.withDefault(true),
	landcoverHeadZip: parseAsString,
	croptypeHeadZip: parseAsString,
	maskCropland: parseAsBoolean.withDefault(true),
	postprocessMethodCropland: parseAsStringLiteral(postprocessMethodCroplandValues).withDefault(defaults.postprocessMethodCropland!),
	postprocessKernelSizeCropland: parseAsInteger.withDefault(3),
	customSeasonId: parseAsString,
	selectedPeriodId: parseAsString,
	jobKey: parseAsString,
};

export const generateCustomProductsSearchParamsCache = createSearchParamsCache(generateCustomProductsSearchParams);

/**
 * Serializes a partial set of generate-custom-products URL state values into
 * a path + query string for a given route. Honours the same `clearOnDefault`
 * rules as `useQueryStates`, so values equal to their default are omitted.
 *
 * Usage:
 *   serializeGenerateCustomProductsSearchParams('/path', { processId: 'X', format: 'Y' })
 *   // => '/path?processId=X&format=Y'
 */
export const serializeGenerateCustomProductsSearchParams = createSerializer(generateCustomProductsSearchParams);
