import { z } from 'zod';
import {
	DEFAULT_COLLECTION,
	DEFAULT_CROPTYPE_HEAD_ZIP,
	DEFAULT_CUSTOM_SEASON_ID,
	DEFAULT_ENABLE_CROPLAND_HEAD,
	DEFAULT_END_DATE,
	DEFAULT_FORMAT,
	DEFAULT_LANDCOVER_HEAD_ZIP,
	DEFAULT_MASK_CROPLAND,
	DEFAULT_ORBIT_STATE,
	DEFAULT_POSTPROCESS_KERNEL_SIZE_CROPLAND,
	DEFAULT_POSTPROCESS_KERNEL_SIZE_CROPTYPE,
	DEFAULT_POSTPROCESS_METHOD_CROPLAND,
	DEFAULT_POSTPROCESS_METHOD_CROPTYPE,
	DEFAULT_SEASONAL_MODEL_ZIP,
	DEFAULT_CROP_TYPE_MODEL_TYPE,
	KERNEL_SIZE_CROPTYPE_MIN,
	KERNEL_SIZE_CROPTYPE_MAX,
} from './defaults';

// --- Null-safe parsing helper ---
// nuqs returns `null` for unset params, but Zod `.default()` only applies to `undefined`.
// This converts all null values to undefined so Zod defaults apply consistently.

export function nullsToUndefined<T extends Record<string, unknown>>(obj: T): { [K in keyof T]: T[K] extends null ? undefined : T[K] } {
	const result = {} as Record<string, unknown>;
	for (const [key, value] of Object.entries(obj)) {
		result[key] = value === null ? undefined : value;
	}
	return result as { [K in keyof T]: T[K] extends null ? undefined : T[K] };
}

// --- Enum values (mirrored from formParams/app.ts constants) ---

export const OutputFormat = z.enum(['GTiff', 'NETCDF']);

export const OrbitState = z.enum(['ASCENDING', 'DESCENDING']);

export const PostprocessMethod = z.enum(['smooth_probabilities', 'majority_vote']);

export const CropTypeModelType = z.enum(['default', 'custom']);

export const ProcessId = z.enum(['worldcereal_crop_extent', 'worldcereal_crop_type']);

export const DownloadCollection = z.enum(['2021']);

export const DownloadProduct = z.enum([
	'ESA_WORLDCEREAL_ACTIVECROPLAND',
	'ESA_WORLDCEREAL_IRRIGATION',
	'ESA_WORLDCEREAL_TEMPORARYCROPS',
	'ESA_WORLDCEREAL_WINTERCEREALS',
	'ESA_WORLDCEREAL_MAIZE',
	'ESA_WORLDCEREAL_SPRINGCEREALS',
]);

// --- Shared field schemas ---

const zipUrl = z
	.string()
	.regex(/^https?:\/\/.+\.zip$/i, 'URL not valid (must end with .zip)');

const seasonId = z
	.string()
	.regex(/^[a-zA-Z0-9_-]+$/, 'Only letters, numbers, underscores, and hyphens are allowed');

const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be a valid date (YYYY-MM-DD)');

const kernelSize = z
	.number()
	.int()
	.min(KERNEL_SIZE_CROPTYPE_MIN)
	.max(KERNEL_SIZE_CROPTYPE_MAX)
	.refine((n) => n % 2 === 1, 'Must be an odd integer');

// Server-side variant: URL search params arrive as strings, so coerce to number first.
const serverKernelSize = z
	.coerce.number()
	.int()
	.min(KERNEL_SIZE_CROPTYPE_MIN)
	.max(KERNEL_SIZE_CROPTYPE_MAX)
	.refine((n) => n % 2 === 1, 'Must be an odd integer');

// --- BBox (validated as comma-separated string) ---

export const bboxString = z
	.string()
	.refine(
		(val) => {
			const parts = val.split(',').map(Number);
			if (parts.length !== 4 || parts.some((p) => !Number.isFinite(p))) return false;
			const [west, south, east, north] = parts;
			return (
				west >= -180 &&
				west <= 180 &&
				south >= -90 &&
				south <= 90 &&
				east >= -180 &&
				east <= 180 &&
				north >= -90 &&
				north <= 90
			);
		},
		'Must be 4 comma-separated numbers: west,south,east,north within valid coordinate ranges'
	);

// --- Flow 1: Generate Custom Products (Step 1) ---

export const generateStep1Schema = z
	.object({
		processId: ProcessId,
		cropTypeModelType: CropTypeModelType.default(DEFAULT_CROP_TYPE_MODEL_TYPE),
		seasonalModelZip: z.union([z.literal(''), zipUrl]).default(DEFAULT_SEASONAL_MODEL_ZIP),
		enableCroplandHead: z.boolean().default(DEFAULT_ENABLE_CROPLAND_HEAD),
		landcoverHeadZip: z.union([z.literal(''), zipUrl]).default(DEFAULT_LANDCOVER_HEAD_ZIP),
		croptypeHeadZip: z.union([z.literal(''), zipUrl]).default(DEFAULT_CROPTYPE_HEAD_ZIP),
	});

// --- Flow 1: Generate Custom Products (Step 2) ---

export const generateStep2Schema = z.object({
	processId: ProcessId,
	bbox: bboxString,
	endDate: dateString.default(DEFAULT_END_DATE),
	customSeasonId: z.union([z.literal(''), seasonId]).default(DEFAULT_CUSTOM_SEASON_ID),
	format: OutputFormat.default(DEFAULT_FORMAT),
	orbitState: OrbitState.default(DEFAULT_ORBIT_STATE),
	postprocessMethodCroptype: PostprocessMethod.default(DEFAULT_POSTPROCESS_METHOD_CROPTYPE),
	postprocessKernelSizeCroptype: kernelSize.default(DEFAULT_POSTPROCESS_KERNEL_SIZE_CROPTYPE),
	postprocessMethodCropland: PostprocessMethod.default(DEFAULT_POSTPROCESS_METHOD_CROPLAND),
	postprocessKernelSizeCropland: kernelSize.default(DEFAULT_POSTPROCESS_KERNEL_SIZE_CROPLAND),
	maskCropland: z.boolean().default(DEFAULT_MASK_CROPLAND),
	enableCroplandHead: z.boolean().default(DEFAULT_ENABLE_CROPLAND_HEAD),
});

// --- Flow 2: Download Official Products (Step 1) ---

export const downloadStep1Schema = z.object({
	collection: DownloadCollection.default(DEFAULT_COLLECTION),
	product: DownloadProduct,
});

// --- Flow 2: Download Official Products (Step 2) ---

export const downloadStep2Schema = z.object({
	collection: DownloadCollection.default(DEFAULT_COLLECTION),
	product: DownloadProduct,
	bbox: bboxString,
	format: OutputFormat.default(DEFAULT_FORMAT),
});

// --- Server-side: from-process API route ---

export const fromProcessParamsSchema = z.object({
	processId: ProcessId,
	bbox: bboxString,
	format: OutputFormat,
	endDate: dateString,
	seasonWindows: z.string().transform((val, ctx) => {
		try {
			const parsed = JSON.parse(val);
			if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
				ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Must be a JSON object' });
				return z.NEVER;
			}
			return parsed;
		} catch {
			ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Must be valid JSON' });
			return z.NEVER;
		}
	}),
	seasonalModelZip: z.union([z.literal(''), zipUrl]).optional(),
	landcoverHeadZip: z.union([z.literal(''), zipUrl]).optional(),
	croptypeHeadZip: z.union([z.literal(''), zipUrl]).optional(),
	orbitState: OrbitState.optional(),
	postprocessMethodCroptype: PostprocessMethod.optional(),
	postprocessKernelSizeCroptype: serverKernelSize.optional(),
	postprocessMethod: PostprocessMethod.optional(),
	postprocessKernelSize: serverKernelSize.optional(),
	postprocessMethodCropland: PostprocessMethod.optional(),
	postprocessKernelSizeCropland: serverKernelSize.optional(),
	enableCroplandHead: z
		.enum(['true', 'false'])
		.transform((v) => v === 'true')
		.optional(),
	maskCropland: z
		.enum(['true', 'false'])
		.transform((v) => v === 'true')
		.optional(),
	customProperties: z
		.string()
		.optional()
		.transform((val, ctx) => {
			if (!val) return undefined;
			try {
				return JSON.parse(val);
			} catch {
				ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Must be valid JSON' });
				return z.NEVER;
			}
		}),
});

// --- Server-side: from-collection API route ---

export const fromCollectionParamsSchema = z.object({
	collection: DownloadCollection,
	product: DownloadProduct,
	bbox: bboxString,
	format: OutputFormat,
	customProperties: z
		.string()
		.optional()
		.transform((val, ctx) => {
			if (!val) return undefined;
			try {
				return JSON.parse(val);
			} catch {
				ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Must be valid JSON' });
				return z.NEVER;
			}
		}),
});

// --- Server-side: Seasons API ---

export const seasonsParamsSchema = z.object({
	bbox: bboxString,
	epsg: z.coerce.number().int(),
});
