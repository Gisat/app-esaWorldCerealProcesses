# Plan: Display Job ID in Process Details View

## Context
Users currently have no way to find the job ID (`jobKey`) from the process list UI. It is only available indirectly via the result download link. Users need this value for support requests (e.g., forum posts on CDSE). The `jobKey` is already available in the `Record` component (`ProcessesTable/Record/index.tsx:36`) but is never forwarded to the `Details` component.

## Changes

### 1. `Details/index.tsx` — Accept and display `jobKey`
- Add `jobKey?: string` to the `DetailsProps` type
- Destructure `jobKey` in the component
- Render a `<DetailsItem label={'Job ID'}>{jobKey}</DetailsItem>` line in the metadata section (column 2), after the Title line

### 2. `Record/index.tsx` — Forward `jobKey` to all `<Details>` usages
Three `<Details>` render sites need the prop:

| Location in `Record/index.tsx` | Lines | Currently passes `jobKey`? |
|---|---|---|
| `getDetails()` — `processTypes.download` branch | 331–345 | No |
| `getDetails()` — `processTypes.product` branch | 349–375 | No |
| `RemoveJobButton` — delete confirmation modal | 155–165 | No |

Add `jobKey={jobKey}` to each.

## Files Modified
| File | Change |
|------|--------|
| `src/features/(processes)/_components/ProcessesTable/Details/index.tsx` | Add `jobKey` prop; render it in metadata section |
| `src/features/(processes)/_components/ProcessesTable/Record/index.tsx` | Pass `jobKey` to all 3 `<Details>` usages |

## Verification
1. `npm run lint` — no new lint errors
2. `npm run build` — TypeScript compilation passes (no type errors from the new prop)
3. Manual: open the process list, expand a record, confirm "Job ID" appears in the details metadata section
