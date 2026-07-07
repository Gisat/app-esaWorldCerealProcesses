# Plan: Change job title prefix to "WorldCereal Processing Hub"

## Context
Job titles currently use the format `Processing: Crop type`. Users with large job lists cannot easily identify which jobs were launched from the WorldCereal Processing Hub. This is a simple string change to improve UX.

**Issue:** https://github.com/Gisat/app-esaWorldCerealProcesses/issues/232  
**Priority:** High  
**Assigned:** mbabic84

## Changes

### 1. Update job title format

**File:** `src/features/pages/processes/create-custom-products/steps/2/CreateProductsStep2Client.tsx:309`

```typescript
// Before
const title = productLabel ? `Processing: ${productLabel}` : undefined;

// After
const title = productLabel ? `WorldCereal Processing Hub: ${productLabel}` : undefined;
```

## Files Modified

| File | Change |
|------|--------|
| `src/features/pages/processes/create-custom-products/steps/2/CreateProductsStep2Client.tsx:309` | Change title prefix from `Processing:` to `WorldCereal Processing Hub:` |

## Verification
- Run `npm run lint` to check for any linting issues
- Run `npm run build` to verify the build succeeds
- Visually verify by creating a product to confirm the job title displays correctly
