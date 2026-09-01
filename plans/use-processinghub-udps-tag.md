# Plan: Point processing hub to latest UDPs via `processinghub-udps` tag

## Context
The processing hub sends a `namespace` (UDP URL) in the job-creation request to `/openeo/jobs/create/from-process`. The URLs are hardcoded to the `main` branch of `WorldCereal/worldcereal-classification`, so a breaking change on `main` would break the hub.

A new upstream tag `processinghub-udps` points to the latest hub-compatible public UDPs (containing a new global model) and is updated whenever needed. This change points the two hardcoded namespaces at that tag.

Referenced issue: Gisat/app-esaWorldCerealProcesses#252 (mirrors WorldCereal/worldcereal-vdm#50).

## Changes
1. In `src/features/(processes)/_constants/generate-custom-products/formParams.ts`, replace the `namespace` URL for the crop extent option (line 64):
   - `https://raw.githubusercontent.com/WorldCereal/worldcereal-classification/refs/heads/main/scripts/udp/worldcereal_crop_extent.json`
   - → `https://raw.githubusercontent.com/WorldCereal/worldcereal-classification/refs/tags/processinghub-udps/scripts/udp/worldcereal_crop_extent.json`
2. Replace the `namespace` URL for the crop type option (line 69):
   - `https://raw.githubusercontent.com/WorldCereal/worldcereal-classification/refs/heads/main/scripts/udp/worldcereal_crop_type.json`
   - → `https://raw.githubusercontent.com/WorldCereal/worldcereal-classification/refs/tags/processinghub-udps/scripts/udp/worldcereal_crop_type.json`

The namespaces are forwarded unchanged to the job-creation endpoint via `getNamespaceByProcessId` (`src/features/(processes)/_utils/namespaceByProcessId.ts`). No other code paths reference these URLs (verified: no matches in tests or other sources).

## Files Modified
| File | Change |
|------|--------|
| `src/features/(processes)/_constants/generate-custom-products/formParams.ts` | Replace `refs/heads/main` with `refs/tags/processinghub-udps` in the two UDP namespace URLs |

## Verification
- `npm run lint`
- Optionally: both new URLs return HTTP 200 (confirmed during planning):
  - crop extent → `https://raw.githubusercontent.com/WorldCereal/worldcereal-classification/refs/tags/processinghub-udps/scripts/udp/worldcereal_crop_extent.json`
  - crop type → `https://raw.githubusercontent.com/WorldCereal/worldcereal-classification/refs/tags/processinghub-udps/scripts/udp/worldcereal_crop_type.json`
