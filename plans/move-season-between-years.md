# Plan: Add "move season between years" slider mode

## Context
On the custom-products create page (`CreateProductsStep2Client.tsx`), users set a season range with a two-thumb `RangeSlider`. Once they have chosen a custom start/end month, they currently have no easy way to shift that exact range to another year without recreating it thumb by thumb.

## Changes
1. Add a mode state (`sliderMode: 'edit' | 'move'`) and a `SegmentedControl` above the slider to switch modes.
2. In **edit** mode keep the existing two-thumb `RangeSlider` behavior unchanged.
3. In **move** mode render a single-thumb `Slider` whose value is the year of the end month.
4. Compute the current month span from `startDate`/`endDate`.
5. When the user drags the single thumb to a new end year, reconstruct:
   - `newEndDate` = same end month, new end year
   - `newStartDate` = `newEndDate` minus the preserved month span
6. Clamp results inside `[0, SLIDER_MAX]` and update `startDate`/`endDate` state/params.
7. Add a short description so users understand the two modes.

## Files Modified
| File | Change |
|------|--------|
| `src/features/pages/processes/create-custom-products/steps/2/CreateProductsStep2Client.tsx` | Add mode state, segmented control, single-year slider logic |

## Verification
- `npm run lint`
- `npm test -- --watchAll=false`
- Start dev server via `background_process`
