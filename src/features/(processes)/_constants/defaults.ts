/**
 * Single source of truth for all validation default values.
 *
 * These constants are used by:
 *   - validation.ts (Zod schema `.default()` values)
 *   - generate-custom-products/defaults.ts (re-exports for nuqs parsers + UI)
 *   - download-official-products/defaults.ts (re-exports for nuqs parsers + UI)
 *
 * To change a default, update it HERE only. All consumers pick it up automatically.
 */

// ──────────────────────────────────────────────────────────────
// Generate Custom Products — Step 1
// ──────────────────────────────────────────────────────────────

/** Default model type selection. */
export const DEFAULT_CROP_TYPE_MODEL_TYPE = 'default' as const;

/** Empty URL means "use the default model". */
export const DEFAULT_SEASONAL_MODEL_ZIP = '';

/** Cropland head is enabled by default for crop-type flow. */
export const DEFAULT_ENABLE_CROPLAND_HEAD = true;

/** Empty URL means "use the default cropland head". */
export const DEFAULT_LANDCOVER_HEAD_ZIP = '';

/** Empty URL means "use the default crop-type head". */
export const DEFAULT_CROPTYPE_HEAD_ZIP = '';

// ──────────────────────────────────────────────────────────────
// Generate Custom Products — Step 2
// ──────────────────────────────────────────────────────────────

/** Default end date for the season range (YYYY-MM-DD). */
export const DEFAULT_END_DATE = '2025-09-30';

/** Empty season ID means "auto-generate from end date year". */
export const DEFAULT_CUSTOM_SEASON_ID = '';

/** Default output format for generated products. */
export const DEFAULT_FORMAT = 'GTiff' as const;

/** Default orbit direction for Sentinel-1 data. */
export const DEFAULT_ORBIT_STATE = 'DESCENDING' as const;

/** Default postprocessing method for crop-type predictions. */
export const DEFAULT_POSTPROCESS_METHOD_CROPTYPE = 'majority_vote' as const;

/** Default postprocessing method for cropland predictions. */
export const DEFAULT_POSTPROCESS_METHOD_CROPLAND = 'majority_vote' as const;

/** Default kernel size for crop-type postprocessing (must be odd, 1–25). */
export const DEFAULT_POSTPROCESS_KERNEL_SIZE_CROPTYPE = 5;

/** Default kernel size for cropland postprocessing (must be odd, 1–25). */
export const DEFAULT_POSTPROCESS_KERNEL_SIZE_CROPLAND = 3;

/** Apply cropland mask to crop-type predictions by default. */
export const DEFAULT_MASK_CROPLAND = true;

// ──────────────────────────────────────────────────────────────
// Kernel size constraints — Crop Type
// ──────────────────────────────────────────────────────────────

/** Minimum kernel size for crop-type postprocessing (inclusive). */
export const KERNEL_SIZE_CROPTYPE_MIN = 1;

/** Maximum kernel size for crop-type postprocessing (inclusive). */
export const KERNEL_SIZE_CROPTYPE_MAX = 25;

/** Step increment for crop-type kernel size UI slider. */
export const KERNEL_SIZE_CROPTYPE_STEP = 2;

// ──────────────────────────────────────────────────────────────
// Kernel size constraints — Cropland
// ──────────────────────────────────────────────────────────────

/** Minimum kernel size for cropland postprocessing (inclusive). */
export const KERNEL_SIZE_CROPLAND_MIN = 1;

/** Maximum kernel size for cropland postprocessing (inclusive). */
export const KERNEL_SIZE_CROPLAND_MAX = 25;

/** Step increment for cropland kernel size UI slider. */
export const KERNEL_SIZE_CROPLAND_STEP = 2;

// ──────────────────────────────────────────────────────────────
// Download Official Products
// ──────────────────────────────────────────────────────────────

/** Default collection year. */
export const DEFAULT_COLLECTION = '2021' as const;
