import { GeoJsonLayer } from "@deck.gl/layers";
import { FeatureCollection, Geometry } from 'geojson';
import { LAYER_ID_BBOX_LINES } from "../constants";
import {
    BBOX_LAYER_ID,
    BBOX_LAYER_FEATURE_COLLECTION_TYPE,
    BBOX_LAYER_FEATURE_TYPE,
    BBOX_LAYER_FEATURE_NAME_POLYGON,
    BBOX_LAYER_FEATURE_NAME_POINT,
    BBOX_LAYER_GEOMETRY_TYPE_POLYGON,
    BBOX_LAYER_GEOMETRY_TYPE_POINT,
    BBOX_LAYER_GEOMETRY_TYPE_MULTILINESTRING,
    BBOX_LAYER_FILLED,
    BBOX_LAYER_POINT_TYPE,
    BBOX_LAYER_POINT_RADIUS_MIN_PIXELS,
    BBOX_LAYER_POINT_RADIUS_MAX_PIXELS,
    BBOX_LAYER_PICKABLE,
    BBOX_LAYER_JUSTIFIED,
    BBOX_LAYER_LINE_WIDTH_MIN_PIXELS_EDIT_MODE,
    BBOX_LAYER_LINE_WIDTH_MIN_PIXELS_DEFAULT,
    BBOX_LAYER_LINE_WIDTH_MAX_PIXELS,
    BBOX_LAYER_POINT_RADIUS,
    BBOX_LAYER_DASH_ARRAY_EDIT_MODE,
    BBOX_LAYER_DASH_ARRAY_DEFAULT,
    BBOX_LAYER_DASH_JUSTIFIED,
    BBOX_LAYER_DASH_GAP_PICKABLE,
    BBOX_LAYER_EXTENSIONS,
		BBOX_LAYER_LINE_WIDTH_DEFAULT,
		BBOX_LAYER_LINE_WIDTH_EDIT_MODE
} from "./config";

const createPolygonFeature = (points: Array<Array<number>>) => ({
	type: BBOX_LAYER_FEATURE_TYPE,
	properties: { name: BBOX_LAYER_FEATURE_NAME_POLYGON },
	geometry: { type: BBOX_LAYER_GEOMETRY_TYPE_POLYGON, coordinates: [points] }
});

const createLineFeature = (firstPoint: Array<number>, secondPoint: Array<number>) => ({
	type: BBOX_LAYER_FEATURE_TYPE,
	properties: { name: LAYER_ID_BBOX_LINES },
	geometry: { type: BBOX_LAYER_GEOMETRY_TYPE_MULTILINESTRING, coordinates: [[firstPoint, secondPoint]] }
});

const createPointFeature = (point: Array<number>) => ({
	type: BBOX_LAYER_FEATURE_TYPE,
	properties: { name: BBOX_LAYER_FEATURE_NAME_POINT },
	geometry: { type: BBOX_LAYER_GEOMETRY_TYPE_POINT, coordinates: point }
});

const createPredictedPolygonFeature = (points: Array<Array<number>>) => ({
	type: BBOX_LAYER_FEATURE_TYPE,
	properties: { name: BBOX_LAYER_FEATURE_NAME_POLYGON },
	geometry: { type: BBOX_LAYER_GEOMETRY_TYPE_POLYGON, coordinates: [points] }
});

/**
 * Creates a bounding box layer for visualization.
 * 
 * @param {Array} activeBboxPoints - An array of coordinates representing the bounding box points.
 * @param {String} bboxIsHovered - Indicates whether the bounding box is currently hovered.
 * @param {boolean} editModeIsActive - Indicates whether the edit mode is active.
 * @param {Array} predictedHoveredPoints - An array of predicted points that may be hovered.
 * @param {Object} config - Custom configuration for bbox. 
 * @returns a GeoJsonLayer representing the bounding box.
 */

export const bboxLayer = (
    activeBboxPoints: Array<Array<number>>,
    bboxIsHovered: String | Boolean,
    editModeIsActive: boolean,
    predictedHoveredPoints: Array<Array<number> | undefined> | null,
		config?: Object,
) => {

    const BBOX_LAYER_FEATURES = activeBboxPoints.length > 1 
        ? [
            createPolygonFeature([...activeBboxPoints, activeBboxPoints[0]]),
            ...activeBboxPoints.map((activePoint: Array<number>, index: number) => {
                const firstPoint = activePoint;
                const secondPoint = activeBboxPoints?.[index + 1] || activeBboxPoints?.[0];
                return createLineFeature(firstPoint, secondPoint);
            })
        ]
        : [
            createPointFeature(activeBboxPoints?.[0]),
            ...(predictedHoveredPoints && predictedHoveredPoints.length > 0 
                ? [createPredictedPolygonFeature([...predictedHoveredPoints.filter(point => point !== undefined), predictedHoveredPoints[0]!])]
                : [])
        ];

    // Create and return a new GeoJsonLayer
    return new GeoJsonLayer({
        id: BBOX_LAYER_ID,
        data: {
            type: BBOX_LAYER_FEATURE_COLLECTION_TYPE,
            features: BBOX_LAYER_FEATURES // Include features only if there are active bounding box points 
        } as FeatureCollection<Geometry>,
        filled: BBOX_LAYER_FILLED,
        pointType: BBOX_LAYER_POINT_TYPE,
        pointRadiusMinPixels: BBOX_LAYER_POINT_RADIUS_MIN_PIXELS,
        pointRadiusMaxPixels: BBOX_LAYER_POINT_RADIUS_MAX_PIXELS,
        pickable: BBOX_LAYER_PICKABLE,
        justified: BBOX_LAYER_JUSTIFIED,
				// For some reason - it doesnt allow me to put constants here, I would have to specify the type of every constant
        getFillColor: () => editModeIsActive ? ([190, 190, 190, 60]) : ([190, 190, 190, 40]),
				getLineColor: (info: { properties: { name?: string } }) => {
            if (bboxIsHovered === "blocked" && predictedHoveredPoints) {
                return [255, 0, 0]; // Red color when blocked
            } else if (info.properties.name === "bboxLayer-lines") {
                return [0, 0, 0, 0]; // Transparent for lines
            } else {
                return editModeIsActive ? [0, 127, 255] : [0, 0, 0]; // Blue in edit mode, black otherwise
            }
        },
        lineWidthMinPixels: editModeIsActive ? BBOX_LAYER_LINE_WIDTH_MIN_PIXELS_EDIT_MODE : BBOX_LAYER_LINE_WIDTH_MIN_PIXELS_DEFAULT,
        lineWidthMaxPixels: BBOX_LAYER_LINE_WIDTH_MAX_PIXELS,
        getLineWidth: (info: { properties: { name?: string } }) => {
					return info.properties.name === LAYER_ID_BBOX_LINES
							? (editModeIsActive ? BBOX_LAYER_LINE_WIDTH_EDIT_MODE : BBOX_LAYER_LINE_WIDTH_DEFAULT)
							: BBOX_LAYER_LINE_WIDTH_DEFAULT;
				},
        getPointRadius: BBOX_LAYER_POINT_RADIUS,
        getDashArray: editModeIsActive ? BBOX_LAYER_DASH_ARRAY_EDIT_MODE : BBOX_LAYER_DASH_ARRAY_DEFAULT,
        dashJustified: BBOX_LAYER_DASH_JUSTIFIED,
        dashGapPickable: BBOX_LAYER_DASH_GAP_PICKABLE,
        extensions: BBOX_LAYER_EXTENSIONS,
				...config
    });
};