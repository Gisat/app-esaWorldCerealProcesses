# Plan: Simplify ProductResultsInfo and fix text visibility

> **Superseded by [`dynamic-product-descriptions-and-year-relative-season.md`](./dynamic-product-descriptions-and-year-relative-season.md)**
>
> The simplification from this plan is preserved (band-only descriptions, no file headers). The new plan replaces the "simplify to one static description" step with a richer, per-variant description block driven by `oeoProcessId` / `enableCroplandHead` / `maskCropland` (per kvantricht's request in WorldCereal/worldcereal-vdm issue #31, comment 4980928666). The text-visibility CSS fix is unchanged and still applies.

## Context

Issue [#233](https://github.com/Gisat/app-esaWorldCerealProcesses/issues/233)

Two problems:
1. `ProductResultsInfo` shows detailed file descriptions that are not process-type-specific. Per OP feedback, simplify to band descriptions only.
2. The text "Each raster contains at least three bands:" is hardly visible — missing explicit color assignments. The app uses CSS custom properties (`--textPrimaryColor`, `--textSecondaryColor`) for text colors on dark backgrounds, but `ProductResultsInfo` relies on Mantine defaults.

## Changes

### 1. Simplify `ProductResultsInfo` content

**File:** `src/features/(processes)/_components/ProcessesTable/ProductResultsInfo/index.tsx`

Remove the "Four GeoTiff images will be generated" header (line 9), the "Each raster contains at least three bands:" sub-header (line 11-12), and the entire "The following files will be generated" section (lines 22-73). Keep only the band list:

```tsx
const ProductResultsInfo = () => {
    return (
        <Stack gap="sm" className="worldCereal-ProductResultsInfo">
            <Text fw={500} mt="sm" mb={4} c="var(--textPrimaryColor)">
                Each raster contains at least three bands:
            </Text>
            <List type="unordered" spacing="xs" withPadding>
                <List.Item>Band 1: classification – The classification label of the pixel.</List.Item>
                <List.Item>Band 2: confidence – The class-specific probability of the winning class.</List.Item>
                <List.Item>
                    Band 3 and beyond: probability_xxx – Class-specific probabilities. The "xxx" indicates the associated class.
                </List.Item>
            </List>
        </Stack>
    );
};
```

### 2. Fix text visibility with explicit color

**File:** `src/features/(processes)/_components/ProcessesTable/ProductResultsInfo/style.css`

Add CSS rules matching the pattern used in `Details/style.css`:

```css
.worldCereal-ProductResultsInfo {
    color: var(--textPrimaryColor);
}

.worldCereal-ProductResultsInfo .mantine-List-item {
    color: var(--textPrimaryColor);
    font-size: var(--font-size-sm);
}
```

This ensures all text inside the component inherits the correct theme color, consistent with how `Details/style.css` handles `--textPrimaryColor` and `--textSecondaryColor`.

## Files Modified

| File | Change |
|------|--------|
| `src/features/(processes)/_components/ProcessesTable/ProductResultsInfo/index.tsx` | Remove file descriptions, keep only band info |
| `src/features/(processes)/_components/ProcessesTable/ProductResultsInfo/style.css` | Add explicit text color rules |

## Verification

1. `npm run build` — no type errors
2. `npm run lint` — no lint errors
3. Manual: click info button on a Product job → band text should be clearly visible with correct theme colors
