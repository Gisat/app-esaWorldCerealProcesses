export type BBoxModel = [number, number, number, number] | undefined;

export function parseBbox(value: string | null | undefined): BBoxModel {
	if (!value) return undefined;
	const parts = value.split(',').map(Number);
	if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) return undefined;
	return parts as [number, number, number, number];
}

export function stringifyBbox(bbox: BBoxModel): string | null {
	if (!bbox || bbox.length !== 4) return null;
	return bbox.join(',');
}

/** @deprecated Use BBoxModel instead */
export type DownloadOfficialProductsBBoxModel = BBoxModel;
