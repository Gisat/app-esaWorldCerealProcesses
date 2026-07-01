import {
	createSerializer,
	parseAsBoolean,
	parseAsInteger,
	parseAsString,
	parseAsStringLiteral,
} from 'nuqs/server';
import formParams from './formParams';
import {
	DEFAULT_CROP_TYPE_MODEL_TYPE,
	DEFAULT_END_DATE,
	DEFAULT_FORMAT,
	DEFAULT_ORBIT_STATE,
	DEFAULT_POSTPROCESS_KERNEL_SIZE_CROPLAND,
	DEFAULT_POSTPROCESS_KERNEL_SIZE_CROPTYPE,
	DEFAULT_POSTPROCESS_METHOD_CROPLAND,
	DEFAULT_POSTPROCESS_METHOD_CROPTYPE,
} from '@features/(processes)/_constants/defaults';

const processIdValues = formParams.processId.options.filter((o) => !o.disabled).map((o) => o.value) as [string, ...string[]];
const formatValues = formParams.format.options.map((o) => o.value) as [string, ...string[]];
const orbitStateValues = formParams.orbitState.options.map((o) => o.value) as [string, ...string[]];
const postprocessMethodCroptypeValues = formParams.postprocessMethodCroptype.options.map((o) => o.value) as [string, ...string[]];
const cropTypeModelTypeValues = formParams.cropTypeModelType.options.map((o) => o.value) as [string, ...string[]];
const postprocessMethodCroplandValues = formParams.postprocessMethodCropland.options.map((o) => o.value) as [string, ...string[]];

/**
 * Shared parser map for generate-custom-products. Used by:
 *  - useQueryStates (client components)
 *
 * Typing notes:
 *  - format / orbitState / postprocessMethodCroptype / postprocessKernelSizeCroptype use .withDefault(...) -> return concrete type (never null).
 *  - processId / bbox / backgroundLayer / endDate / customSeasonId / selectedPeriodId / jobKey have NO default -> return `string | null`.
 *    `null` means "not set"; setting to null removes the key from the URL.
 */
export const generateCustomProductsSearchParams = {
	processId: parseAsStringLiteral(processIdValues),
	cropTypeModelType: parseAsStringLiteral(cropTypeModelTypeValues).withDefault(DEFAULT_CROP_TYPE_MODEL_TYPE),
	format: parseAsStringLiteral(formatValues).withDefault(DEFAULT_FORMAT),
	bbox: parseAsString,
	backgroundLayer: parseAsString,
	endDate: parseAsString.withDefault(DEFAULT_END_DATE),
	orbitState: parseAsStringLiteral(orbitStateValues).withDefault(DEFAULT_ORBIT_STATE),
	postprocessMethodCroptype: parseAsStringLiteral(postprocessMethodCroptypeValues).withDefault(DEFAULT_POSTPROCESS_METHOD_CROPTYPE),
	postprocessKernelSizeCroptype: parseAsInteger.withDefault(DEFAULT_POSTPROCESS_KERNEL_SIZE_CROPTYPE),
	seasonalModelZip: parseAsString,
	enableCroplandHead: parseAsBoolean.withDefault(true),
	landcoverHeadZip: parseAsString,
	croptypeHeadZip: parseAsString,
	maskCropland: parseAsBoolean.withDefault(true),
	postprocessMethodCropland: parseAsStringLiteral(postprocessMethodCroplandValues).withDefault(DEFAULT_POSTPROCESS_METHOD_CROPLAND),
	postprocessKernelSizeCropland: parseAsInteger.withDefault(DEFAULT_POSTPROCESS_KERNEL_SIZE_CROPLAND),
	customSeasonId: parseAsString,
	selectedPeriodId: parseAsString,
	jobKey: parseAsString,
};

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
