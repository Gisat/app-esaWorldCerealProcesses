import { GeoJsonLayer } from "@deck.gl/layers";
import { PathStyleExtension } from "@deck.gl/extensions";

/**
 * Creates a GeoJson layer for displaying the available area on the map.
 * 
 * @param {Array} availableArea - An array of coordinates defining the available area.
 * @param {boolean} editModeIsActive - Indicates whether the edit mode is active.
 * @returns a GeoJsonLayer if availableArea and editModeIsActive are valid; otherwise, returns undefined.
 */

export const availableAreaLayer = (
	availableArea: Array<Array<number>> | null,
	editModeIsActive: boolean,
) => {
    // Check if availableArea is provided and edit mode is active
	if (availableArea && editModeIsActive) {
        // Create and return a new GeoJsonLayer
		return new GeoJsonLayer<{}>({
			id: 'mapBBoxDrawing-availableArea',
			data: {
                "type": "FeatureCollection",
                "features": [
                    {
                        "type": "Feature",
                        "properties": { "name": "availableArea-lines" },
                        "geometry": {
                            "type": "Polygon",
                            "coordinates": [availableArea] // Coordinates defining the polygon
                        }
                    }
                ]
			},
		
			stroked: true,
			filled: true,
			pointRadiusMinPixels: 4,
			pointRadiusMaxPixels: 8,
			pickable: true,
		
			getFillColor: [0, 128, 0, 0],
			getLineColor: [0, 0, 0],
			lineWidthMinPixels: 0.8,
			lineWidthMaxPixels: 2,
			getLineWidth: 100,
		
			// @ts-ignore
			getDashArray: [200, 500],
			dashJustified: true,
			dashGapPickable: true,
			extensions: [new PathStyleExtension({dash: true})]
		})
	};
}