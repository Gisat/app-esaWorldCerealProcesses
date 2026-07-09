# Plan: Add Zod Validation as Single Source of Truth

## Context

The codebase has validation logic scattered across multiple layers:
- **Client-side**: Manual regex checks, typeof guards, button-disable gates in 6+ component files
- **Server-side**: Manual `if (!param)` checks in 3 API routes
- **URL state**: `parseAsStringLiteral` enum constraints in nuqs parsers

There is **no validation library** installed. All validation is hand-rolled, leading to:
- Duplicated logic (kernel size checks duplicated verbatim, ZIP URL regex applied 3x identically)
- Gaps (server-side missing validation for `processId`, `format`, bbox ranges, ZIP URLs, kernel sizes)
- Inconsistent boundary checks (`>` vs `>=` for bbox area)
- Dead code (`useStepValidation` hook is unused)

**Goal**: Introduce Zod as the single source of truth for all validation, eliminating duplication and closing gaps.

---

## Changes

### Step 1: Install Zod

```bash
npm install zod
```

### Step 2: Create Zod Schemas — Single Source of Truth

Create `src/features/(processes)/_constants/validation.ts` with all schemas.

**Primitives (shared across flows):**

```typescript
import { z } from 'zod';

// --- Enum values (derived from existing formParams/app.ts constants) ---

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

const zipUrl = z.string().regex(/^https?:\/\/.+\.zip$/i, 'URL must be a valid HTTP(S) URL ending with .zip');

const seasonId = z.string().regex(/^[a-zA-Z0-9_-]+$/, 'Only letters, numbers, underscores, and hyphens are allowed');

const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be a valid date (YYYY-MM-DD)');

const kernelSize = z.number().int().min(1).max(25).refine(n => n % 2 === 1, 'Must be an odd integer');

// --- BBox (used by both flows, validated as comma-separated string) ---

export const bboxString = z.string().refine(val => {
  const parts = val.split(',').map(Number);
  if (parts.length !== 4 || parts.some(p => !Number.isFinite(p))) return false;
  const [west, south, east, north] = parts;
  return west >= -180 && west <= 180 && south >= -90 && south <= 90 &&
         east >= -180 && east <= 180 && north >= -90 && north <= 90;
}, 'Must be 4 comma-separated numbers: west,south,east,north within valid coordinate ranges');
```

**Flow 1: Generate Custom Products (Step 1)**

```typescript
export const generateStep1Schema = z.object({
  processId: ProcessId,
  cropTypeModelType: CropTypeModelType.default('default'),
  seasonalModelZip: z.union([z.literal(''), zipUrl]).default(''),
  enableCroplandHead: z.boolean().default(true),
  landcoverHeadZip: z.union([z.literal(''), zipUrl]).default(''),
  croptypeHeadZip: z.union([z.literal(''), zipUrl]).default(''),
}).refine(data => {
  // Conditional: landcoverHeadZip required when custom model + cropType + croplandHead enabled
  if (data.cropTypeModelType === 'custom' && data.processId === 'worldcereal_crop_type' && data.enableCroplandHead) {
    return data.landcoverHeadZip !== '';
  }
  // Conditional: landcoverHeadZip required when custom model + cropExtent
  if (data.cropTypeModelType === 'custom' && data.processId === 'worldcereal_crop_extent') {
    return data.landcoverHeadZip !== '';
  }
  return true;
}, { message: 'Cropland Head Override URL is required', path: ['landcoverHeadZip'] })
.refine(data => {
  // Conditional: croptypeHeadZip required when custom model + cropType
  if (data.cropTypeModelType === 'custom' && data.processId === 'worldcereal_crop_type') {
    return data.croptypeHeadZip !== '';
  }
  return true;
}, { message: 'Crop Type Head Override URL is required', path: ['croptypeHeadZip'] });
```

**Flow 1: Generate Custom Products (Step 2)**

```typescript
export const generateStep2Schema = z.object({
  processId: ProcessId,
  bbox: bboxString,
  endDate: dateString.default('2025-09-30'),
  customSeasonId: z.union([z.literal(''), seasonId]).default(''),
  format: OutputFormat.default('GTiff'),
  orbitState: OrbitState.default('DESCENDING'),
  postprocessMethodCroptype: PostprocessMethod.default('majority_vote'),
  postprocessKernelSizeCroptype: kernelSize.default(5),
  postprocessMethodCropland: PostprocessMethod.default('majority_vote'),
  postprocessKernelSizeCropland: kernelSize.default(3),
  maskCropland: z.boolean().default(true),
  enableCroplandHead: z.boolean().default(true),
}).refine(data => {
  // When majority_vote, kernel size is required
  if (data.postprocessMethodCroptype === 'majority_vote') {
    return data.postprocessKernelSizeCroptype !== null;
  }
  return true;
}, { message: 'Kernel size is required for majority vote method', path: ['postprocessKernelSizeCroptype'] })
.refine(data => {
  if (data.postprocessMethodCropland === 'majority_vote' && data.enableCroplandHead) {
    return data.postprocessKernelSizeCropland !== null;
  }
  return true;
}, { message: 'Kernel size is required for majority vote method', path: ['postprocessKernelSizeCropland'] });
```

**Flow 2: Download Official Products (Step 1)**

```typescript
export const downloadStep1Schema = z.object({
  collection: DownloadCollection.default('2021'),
  product: DownloadProduct,
});
```

**Flow 2: Download Official Products (Step 2)**

```typescript
export const downloadStep2Schema = z.object({
  collection: DownloadCollection.default('2021'),
  product: DownloadProduct,
  bbox: bboxString,
  format: OutputFormat.default('GTiff'),
});
```

**Server-side: from-process API route**

```typescript
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
  postprocessKernelSizeCroptype: kernelSize.optional(),
  postprocessMethodCropland: PostprocessMethod.optional(),
  postprocessKernelSizeCropland: kernelSize.optional(),
  enableCroplandHead: z.enum(['true', 'false']).transform(v => v === 'true').optional(),
  maskCropland: z.enum(['true', 'false']).transform(v => v === 'true').optional(),
  customProperties: z.string().optional().transform((val, ctx) => {
    if (!val) return undefined;
    try {
      return JSON.parse(val);
    } catch {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Must be valid JSON' });
      return z.NEVER;
    }
  }),
});
```

**Server-side: from-collection API route**

```typescript
export const fromCollectionParamsSchema = z.object({
  collection: DownloadCollection,
  product: DownloadProduct,
  bbox: bboxString,
  format: OutputFormat,
  customProperties: z.string().optional().transform((val, ctx) => {
    if (!val) return undefined;
    try {
      return JSON.parse(val);
    } catch {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Must be valid JSON' });
      return z.NEVER;
    }
  }),
});
```

**Server-side: Seasons API**

```typescript
export const seasonsParamsSchema = z.object({
  bbox: bboxString,
  epsg: z.coerce.number().int(),
});
```

### Step 3: Integrate Zod into Client Components

**`CreateProductsStep1Client.tsx`:**
- Remove: `const zipUrlRegex = /^https?:\/\/.+\.zip$/i;`
- Remove: `isSeasonalModelZipValid`, `isLandcoverHeadZipValid`, `isCroptypeHeadZipValid` manual checks
- Remove: `hasValidationErrors` manual composition
- Add: Import `generateStep1Schema` from `validation.ts`
- Add: `const validation = generateStep1Schema.safeParse({ processId, cropTypeModelType, seasonalModelZip, ... });`
- Use: `const nextStepDisabled = !validation.success;`
- Show errors from `validation.error.flatten().fieldErrors`

**`CreateProductsStep2Client.tsx`:**
- Remove: `isCroplandKernelValid`, `isCroptypeKernelValid`, `isCropExtentKernelValid` (3 duplicated blocks)
- Remove: `SEASON_ID_PATTERN` regex and `isSeasonIdValid` check
- Remove: Manual `nextStepDisabled` composition (lines 169-177)
- Add: Import `generateStep2Schema` from `validation.ts`
- Add: Zod validation using `safeParse`
- Use: `const nextStepDisabled = !validation.success;`

**`DownloadStep1Client.tsx`:**
- Add: Import `downloadStep1Schema`
- Add: Zod validation for `collection` and `product`
- Use validated result for `nextStepDisabled`

**`DownloadStep2Client.tsx`:**
- Add: Import `downloadStep2Schema`
- Add: Zod validation for `collection`, `product`, `bbox`, `format`
- Use validated result for `nextStepDisabled`

### Step 4: Integrate Zod into API Routes

**`from-process/route.ts`:**
- Remove: All manual `if (!param)` checks (lines 48-103)
- Remove: Manual `JSON.parse` for seasonWindows and customProperties
- Remove: Manual `postprocessKernelSizeCroptype` range/parity check
- Add: Import `fromProcessParamsSchema`
- Add: `const result = fromProcessParamsSchema.safeParse(Object.fromEntries(searchParams));`
- Add: `if (!result.success) throw new BaseHttpError(result.error.issues[0].message, 400, ErrorBehavior.SSR);`
- Use `result.data` (fully typed, parsed, validated) for building the request body

**`from-collection/route.ts`:**
- Remove: All manual `if (!param)` and `formParams.options.some()` checks (lines 39-72)
- Remove: Manual `startDate`/`endDate` derivation with `formParams.find()`
- Add: Import `fromCollectionParamsSchema`
- Add: Zod validation
- Derive `startDate`/`endDate` from the validated `collection` value using formParams lookup

**`seasons/get/route.ts`:**
- Remove: Manual `if (!bboxStr || !epsgStr)` and `isNaN(epsg)` checks
- Add: Import `seasonsParamsSchema`
- Add: Zod validation

### Step 5: Clean Up Unused Code

| Item | File | Action |
|------|------|--------|
| `useStepValidation` hook | `src/features/(processes)/_hooks/_url/useStepValidation.ts` | **Delete** — unused, replaced by Zod schemas |
| `useUrlParamCheck` hook | `src/features/(processes)/_hooks/_url/useUrlParamCheck.ts` | **Delete** — unused utility |
| `DownloadOfficialProductsBBoxModel` type | `src/features/(processes)/_utils/bbox.ts:15-16` | **Delete** — marked `@deprecated`, replaced by `BBoxModel` |
| `zipUrlRegex` const | `CreateProductsStep1Client.tsx:17` | **Delete** — replaced by Zod `zipUrl` schema |
| `SEASON_ID_PATTERN` const | `CreateProductsStep2Client.tsx:158` | **Delete** — replaced by Zod `seasonId` schema |
| `isCroplandKernelValid` | `CreateProductsStep2Client.tsx:137-142` | **Delete** — replaced by Zod |
| `isCroptypeKernelValid` | `CreateProductsStep2Client.tsx:144-149` | **Delete** — replaced by Zod |
| `isCropExtentKernelValid` | `CreateProductsStep2Client.tsx:151-156` | **Delete** — replaced by Zod |
| `isSeasonIdValid` | `CreateProductsStep2Client.tsx:160` | **Delete** — replaced by Zod |
| `isSeasonalModelZipValid` | `CreateProductsStep1Client.tsx:40` | **Delete** — replaced by Zod |
| `isLandcoverHeadZipValid` | `CreateProductsStep1Client.tsx:41` | **Delete** — replaced by Zod |
| `isCroptypeHeadZipValid` | `CreateProductsStep1Client.tsx:42` | **Delete** — replaced by Zod |
| `hasValidationErrors` | `CreateProductsStep1Client.tsx:44-48` | **Delete** — replaced by Zod |

---

## Files Modified

| File | Change |
|------|--------|
| `package.json` | Add `zod` dependency |
| `src/features/(processes)/_constants/validation.ts` | **New file** — all Zod schemas |
| `src/features/pages/processes/create-custom-products/steps/1/CreateProductsStep1Client.tsx` | Replace manual validation with Zod |
| `src/features/pages/processes/create-custom-products/steps/2/CreateProductsStep2Client.tsx` | Replace manual validation with Zod, remove duplicated kernel checks |
| `src/features/pages/processes/download-official-products/steps/1/DownloadStep1Client.tsx` | Add Zod validation |
| `src/features/pages/processes/download-official-products/steps/2/DownloadStep2Client.tsx` | Add Zod validation |
| `src/app/(processes)/api/jobs/create/from-process/route.ts` | Replace manual validation with Zod |
| `src/app/(processes)/api/jobs/create/from-collection/route.ts` | Replace manual validation with Zod |
| `src/app/(processes)/api/seasons/get/route.ts` | Replace manual validation with Zod |
| `src/features/(processes)/_utils/bbox.ts` | Remove deprecated `DownloadOfficialProductsBBoxModel` type |
| `src/features/(processes)/_hooks/_url/useStepValidation.ts` | **Delete** |
| `src/features/(processes)/_hooks/_url/useUrlParamCheck.ts` | **Delete** |

---

## Verification

1. `npm run build` — ensure no type errors from schema changes
2. `npm run lint` — ensure no lint errors
3. Manual testing:
   - Navigate through both flows (Generate Custom Products, Download Official Products)
   - Test invalid URL params (e.g., `?processId=invalid`) — should fall back to defaults
   - Test API routes with missing/invalid params — should return 400 with descriptive error
   - Test conditional validation (ZIP URLs required only for custom model)
   - Test kernel size edge cases (even numbers, out of range)
   - Test bbox with out-of-range coordinates
   - Test season ID with special characters
