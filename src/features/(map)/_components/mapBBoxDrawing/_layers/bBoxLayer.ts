import { GeoJsonLayer } from "@deck.gl/layers";
import { PathStyleExtension } from "@deck.gl/extensions";
import { LAYER_ID_BBOX_LINES } from "../constants";

/**
 * Creates a bounding box layer for visualization.
 * 
 * @param {Array} activeBboxPoints - An array of coordinates representing the bounding box points.
 * @param {String} bboxIsHovered - Indicates whether the bounding box is currently hovered.
 * @param {boolean} editModeIsActive - Indicates whether the edit mode is active.
 * @param {Array} predictedHoveredPoints - An array of predicted points that may be hovered.
 * @returns a GeoJsonLayer representing the bounding box.
 */

export const bboxLayer = (
	activeBboxPoints: Array<Array<number>>,
	bboxIsHovered: String | Boolean,
	editModeIsActive: boolean,
	predictedHoveredPoints: Array<Array<number> | undefined> | null
) => {
    // Construct features based on the number of active bounding box points
    const features = activeBboxPoints.length > 1 
        ? [
            {
                "type": "Feature",
                "properties": { "name": "bboxLayer-polygon" },
                "geometry": { "type": "Polygon", "coordinates": [[...activeBboxPoints, activeBboxPoints[0]]] }
            },
			...activeBboxPoints.map((activePoint: Array<number>, index: number) => {
				const firstPoint = activePoint;
                // Get the next point or loop back to the first point
                const secondPoint = activeBboxPoints?.[index + 1] || activeBboxPoints?.[0];
                return {
                    "type": "Feature",
                    "properties": { "name": LAYER_ID_BBOX_LINES },
                    "geometry": { "type": "MultiLineString", "coordinates": [[firstPoint, secondPoint]] }
                };
			})
		]
		: [
            {
                "type": "Feature",
                "properties": { "name": "bboxLayer-point" },
                "geometry": { "type": "Point", "coordinates": activeBboxPoints?.[0] }
            },
            predictedHoveredPoints && predictedHoveredPoints.length > 0 
                ? {
                    "type": "Feature",
                    "properties": { "name": "bboxLayer-polygon" },
                    "geometry": { "type": "Polygon", "coordinates": [[...predictedHoveredPoints, predictedHoveredPoints[0]]] }
                } 
                : {}
			];

    // Create and return a new GeoJsonLayer
    return new GeoJsonLayer<{}>({
		id: 'bboxLayer',
		data: {
            "type": "FeatureCollection",
						// @ts-ignore
            "features": activeBboxPoints.length > 0 ? features : [] // Include features only if there are active bounding box points 
		},
	
		filled: true,
		pointType: 'circle',
		pointRadiusMinPixels: 4,
		pointRadiusMaxPixels: 8,
		pickable: true,
		// @ts-ignore
		justified: true,

		getFillColor: editModeIsActive ? [190, 190, 190, 60] : [190, 190, 190, 40],
        getLineColor: (info: { properties: { name?: string } }) => {
			if (bboxIsHovered === "blocked" && predictedHoveredPoints) {
                return [255, 0, 0]; // Red color when blocked
			} else if (info.properties.name === "bboxLayer-lines") {
                return [0, 0, 0, 0]; // Transparent for lines
			} else {
                return editModeIsActive ? [0, 127, 255] : [0, 0, 0]; // Blue in edit mode, black otherwise
            }
		},
		lineWidthMinPixels: editModeIsActive ? 4.5 : 1,
		lineWidthMaxPixels: 16,
		getLineWidth: (info: { properties: { name?: string } }) => {
			return info.properties.name === "bboxLayer-lines"
					? (editModeIsActive ? 100000 : 1)
					: 1;
		},
		getPointRadius: 1000,
        getDashArray: editModeIsActive ? [10, 3] : [0, 0], // Dashed lines in edit mode
		dashJustified: true,
		dashGapPickable: true,
        extensions: [new PathStyleExtension({ dash: true })] // Enable dash extension
	});
};