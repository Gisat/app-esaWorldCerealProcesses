# Plan: Dynamic product descriptions & year-relative season selection

## Context

GitHub comment [#4980928666](https://github.com/WorldCereal/worldcereal-vdm/issues/31#issuecomment-4980928666) and the three following comments on issue #31 in `WorldCereal/worldcereal-vdm`.

### 1. Product description must be dynamic (comment 4980928666)

The current `ProductResultsInfo` (in `src/features/(processes)/_components/ProcessesTable/ProductResultsInfo/index.tsx`) shows a single static band description for every product. KVantricht (comment 4980928666) provided four distinct descriptions, one per product variant. The component should render the variant that matches the job that was launched.

The four variants (driven by `oeoProcessId`, `enableCroplandHead`, `maskCropland`):

1. **Cropland Extent** — always 3 bands: `cropland_classification`, `probability_cropland`, `probability_other`.
2. **Crop Type, Cropland Head disabled** — only croptype bands, no cropland bands. Bands use `<season_id>` placeholder.
3. **Crop Type, Cropland Head enabled, Cropland masking disabled** — cropland bands + croptype bands; no masking note.
4. **Crop Type, Cropland Head enabled, Cropland masking enabled** — cropland bands + croptype bands; non-cropland pixels get `NoCrop` (value 254) in the croptype classification & confidence bands.

### 2. Season suggestions should be year-relative (comments 4990762248 + 4991015885 + 4991092120)

Currently in `src/features/pages/processes/create-custom-products/steps/2/CreateProductsStep2Client.tsx`:

- `shiftRangeByYear()` (line 289) explicitly sets `selectedPeriodId: null` on every arrow click, so the suggested-season radio bullet disappears as soon as the user shifts the year. KVantricht asked (comment 4933350749) that the bullet stay highlighted as long as the *period* (start/end month-day) has not been manually edited — only the year has changed.
- The default selected range (`DEFAULT_END_IDX = SLIDER_MAX - 6`) is hard-coded to end at July 2025 even though the calendar has moved to 2026. KVantricht (comment 4933350749) suggested the default should be the *latest fully available season*; mbabic84 agreed (comment 4990762248) and asked for clarification on "latest available year" (comment 4991015885). KVantricht clarified: the latest year is the most recent year whose season end month-day has *fully passed*. mbabic84 replied (comment 4991092120) that this is already partially implemented via slider bounds, but the actual default and the slider cap still hardcode 2025 and prevent selecting 2026 seasons even when they are fully past.

## Changes

### 1. Make `ProductResultsInfo` accept props and render one of four descriptions

**File:** `src/features/(processes)/_components/ProcessesTable/ProductResultsInfo/index.tsx`

- Accept props `{ oeoProcessId?: string; enableCroplandHead?: boolean; maskCropland?: boolean }`.
- Render one of the four description blocks from comment 4980928666, using `<season_id>` as a literal placeholder (we do not have class names per band available client-side).
- When `oeoProcessId` is unknown or not product-type, fall back to the current static band list (so the component never crashes).

**File:** `src/features/(processes)/_components/ProcessesTable/Record/index.tsx`

- `OpenInfoButton` (line 212) currently takes only `descriptionType`. Extend it (or the call sites) to forward `oeoProcessId`, `enableCroplandHead`, `maskCropland` so `ProductResultsInfo` can pick the right variant.
- Update both call sites in `getDetails()` (the `case processTypes.product` branch, lines 359-393) and the `OpenInfoButton` invocation (line 426) to forward these fields.

**File:** `src/features/(processes)/_components/ProcessesTable/ProductResultsInfo/style.css`

- No CSS change required (existing rules already cover `<ul>`/`<li>` text colour and font size; the new variant blocks will inherit the same rules).

### 2. Year-relative season selection in `CreateProductsStep2Client.tsx`

**File:** `src/features/pages/processes/create-custom-products/steps/2/CreateProductsStep2Client.tsx`

- Refactor `shiftRangeByYear()` (line 289):
  - After computing the new end/start month-day combo, look up a suggested period in `suggestedPeriods` whose start/end `YYYY-MM-DD` month-day matches the new month-day.
  - If a match is found, set `selectedPeriodId` to that period's `id`; otherwise set it to `null` (as today).
- Update the default range to "latest fully available season" (comment 4991015885):
  - `DEFAULT_END_IDX` is currently `SLIDER_MAX - 6`. Replace with logic that, when the user has not picked a suggested period yet, defaults the range so its end month-day equals the latest suggested period's month-day, and the year is the latest year in which that end month-day has fully passed (i.e. `today`'s month > season end month, or `today`'s month == season end month and `today`'s day >= last-day-of-season-month).
  - Since we have no `suggestedPeriods` data before the user draws a bbox, fall back to the current hard-coded default (`SLIDER_MAX - 6`) when no periods are available.
- Extend `SLIDER_MAX` so the user can select a season ending in the current year, not just up to January of the current year. Today `SLIDER_MAX = (CURRENT_YEAR - START_YEAR) * 12` (e.g. 96 for 2018-2026, last index = January 2026). Change to `(CURRENT_YEAR - START_YEAR + 1) * 12` so the slider can hold a full extra year.

### 3. Update existing `make-product-results-info-process-type-specific` plan

Mark the previous plan (`plans/make-product-results-info-process-type-specific.md`) as superseded, or add a follow-up note at the top — the new implementation is a strict superset.

## Files Modified

| File | Change |
|------|--------|
| `src/features/(processes)/_components/ProcessesTable/ProductResultsInfo/index.tsx` | Accept props; render 1 of 4 dynamic descriptions |
| `src/features/(processes)/_components/ProcessesTable/Record/index.tsx` | Forward `oeoProcessId`/`enableCroplandHead`/`maskCropland` to `OpenInfoButton` → `ProductResultsInfo` |
| `src/features/pages/processes/create-custom-products/steps/2/CreateProductsStep2Client.tsx` | Year-relative season matching in `shiftRangeByYear`; latest-fully-available default; extend `SLIDER_MAX` |
| `plans/make-product-results-info-process-type-specific.md` | Add note that this plan supersedes it |

## Verification

1. `npm run build` — no type errors
2. `npm run lint` — no lint errors
3. `npm test` — existing unit tests still pass
4. Manual: open `/processes-list`, click the info button on each variant:
   - A cropland-extent job → 3 cropland bands shown
   - A croptype job (no cropland head) → croptype bands only
   - A croptype job (cropland head on, mask off) → cropland + croptype bands, no masking note
   - A croptype job (cropland head on, mask on) → cropland + croptype bands, "NoCrop (254)" masking note
5. Manual: in step 2, pick a suggested season, then click the year-shift arrows. The radio bullet should remain highlighted as long as month-day hasn't changed.
6. Manual: in step 2, draw a bbox. The default range should end at the latest fully past month for the latest suggested season.
