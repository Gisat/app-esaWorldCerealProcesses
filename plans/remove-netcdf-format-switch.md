# Plan: Remove NetCDF Format Selection

## Context

GitHub issue #243 reports that official-product downloads do not proceed when NetCDF is selected. The backend no longer supports NetCDF, so format selection must be removed rather than restyled.

The visible switch is rendered in `src/features/pages/processes/download-official-products/steps/2/DownloadStep2Client.tsx:228`, but `NETCDF` is also accepted by both workflows through nuqs URL state and Zod request schemas. A stale or handcrafted URL can therefore still send the unsupported value to either job-creation endpoint.

## Changes

1. Remove the output-format control and all `format` URL-state propagation from the official-download and custom-product workflows.
2. Remove format options and format validation from client form definitions, step validation, API parameter schemas, and stepper navigation gates.
3. Define GeoTIFF as the single backend-supported output format and set it server-side in both job-creation routes, preventing stale query parameters from selecting NetCDF.
4. Preserve output-format display for created and historical jobs without depending on selectable form options.
5. Remove the unused segmented-control component, its dedicated type, and its unused CSS rule.
6. Add unit coverage proving job-creation schemas no longer expose a client-supplied format and the supported backend format remains GeoTIFF.

## Files Modified

| File | Change |
|------|--------|
| `src/features/pages/processes/download-official-products/steps/2/DownloadStep2Client.tsx` | Remove the format switch, state, validation input, and request parameter |
| `src/app/(processes)/download-official-products/steps/2/page.tsx` | Update the step description |
| `src/features/pages/processes/download-official-products/steps/3/DownloadStep3Client.tsx` | Resolve the display label without selectable options |
| `src/features/pages/processes/DownloadOfficialProductsStepper.tsx` | Remove format gating and propagation |
| `src/features/(processes)/_constants/download-official-products/searchParams.ts` | Remove the format query parser |
| `src/features/(processes)/_constants/download-official-products/formParams.ts` | Remove selectable output formats |
| `src/features/pages/processes/create-custom-products/steps/2/CreateProductsStep2Client.tsx` | Remove hidden format state, validation, and request propagation |
| `src/features/pages/processes/CreateCustomProductsStepper.tsx` | Remove format gating and propagation |
| `src/features/(processes)/_constants/generate-custom-products/searchParams.ts` | Remove the format query parser |
| `src/features/(processes)/_constants/generate-custom-products/formParams.ts` | Remove obsolete format options |
| `src/features/(processes)/_constants/defaults.ts` | Replace the format default with the fixed supported format constant |
| `src/features/(processes)/_constants/validation.ts` | Remove NetCDF enum and format fields from client/server schemas |
| `src/app/(processes)/api/jobs/create/from-collection/route.ts` | Always send GeoTIFF to the backend |
| `src/app/(processes)/api/jobs/create/from-process/route.ts` | Always send GeoTIFF to the backend |
| `src/app/index.css` | Remove unused segmented-control styling |
| `src/features/(processes)/_components/SelectOutput/index.tsx` | Delete unused switch component |
| `src/features/(processes)/_types/outputFormats.ts` | Delete unused switch type |
| `src/test/unit/outputFormat.test.ts` | Verify fixed GeoTIFF behavior and schema boundaries |

## Verification

- `npm test -- --watchAll=false`
- `npm run lint`
- `npm run build`
- Confirm `NETCDF`, `OutputFormat`, and `worldCereal-SegmentedControl` have no remaining runtime references.
- Manually verify both creation flows at `http://localhost:3000` while the dev server remains running.
