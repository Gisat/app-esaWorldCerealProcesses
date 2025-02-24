import { PathStyleExtension } from "@deck.gl/extensions";

// Define individual configuration properties for availableAreaLayer
export const AVAILABLE_AREA_LAYER_ID = 'mapBBoxDrawing-availableArea';
export const AVAILABLE_AREA_LAYER_FEATURE_COLLECTION_TYPE = "FeatureCollection";
export const AVAILABLE_AREA_LAYER_FEATURE_TYPE = "Feature";
export const AVAILABLE_AREA_LAYER_FEATURE_NAME = "availableArea-lines";
export const AVAILABLE_AREA_LAYER_GEOMETRY_TYPE = "Polygon";
export const AVAILABLE_AREA_LAYER_STROKED = true;
export const AVAILABLE_AREA_LAYER_FILLED = true;
export const AVAILABLE_AREA_LAYER_POINT_RADIUS_MIN_PIXELS = 4;
export const AVAILABLE_AREA_LAYER_POINT_RADIUS_MAX_PIXELS = 8;
export const AVAILABLE_AREA_LAYER_PICKABLE = true;
export const AVAILABLE_AREA_LAYER_FILL_COLOR = [0, 128, 0, 0];
export const AVAILABLE_AREA_LAYER_LINE_COLOR = [0, 0, 0];
export const AVAILABLE_AREA_LAYER_LINE_WIDTH_MIN_PIXELS = 0.8;
export const AVAILABLE_AREA_LAYER_LINE_WIDTH_MAX_PIXELS = 2;
export const AVAILABLE_AREA_LAYER_LINE_WIDTH = 100;
export const AVAILABLE_AREA_LAYER_DASH_ARRAY = [200, 500];
export const AVAILABLE_AREA_LAYER_DASH_JUSTIFIED = true;
export const AVAILABLE_AREA_LAYER_DASH_GAP_PICKABLE = true;
export const AVAILABLE_AREA_LAYER_EXTENSIONS = [new PathStyleExtension({ dash: true })];

// Define individual configuration properties for bboxLayer
export const BBOX_LAYER_ID = 'bboxLayer';
export const BBOX_LAYER_FEATURE_COLLECTION_TYPE = "FeatureCollection";
export const BBOX_LAYER_FEATURE_TYPE = "Feature";
export const BBOX_LAYER_FEATURE_NAME_POLYGON = "bboxLayer-polygon";
export const BBOX_LAYER_FEATURE_NAME_POINT = "bboxLayer-point";
export const BBOX_LAYER_GEOMETRY_TYPE_POLYGON = "Polygon";
export const BBOX_LAYER_GEOMETRY_TYPE_POINT = "Point";
export const BBOX_LAYER_GEOMETRY_TYPE_MULTILINESTRING = "MultiLineString";
export const BBOX_LAYER_FILLED = true;
export const BBOX_LAYER_POINT_TYPE = 'circle';
export const BBOX_LAYER_POINT_RADIUS_MIN_PIXELS = 4;
export const BBOX_LAYER_POINT_RADIUS_MAX_PIXELS = 8;
export const BBOX_LAYER_PICKABLE = true;
export const BBOX_LAYER_JUSTIFIED = true;
export const BBOX_LAYER_LINE_WIDTH_MIN_PIXELS_EDIT_MODE = 4.5;
export const BBOX_LAYER_LINE_WIDTH_MIN_PIXELS_DEFAULT = 1;
export const BBOX_LAYER_LINE_WIDTH_MAX_PIXELS = 16;
export const BBOX_LAYER_POINT_RADIUS = 1000;
export const BBOX_LAYER_DASH_ARRAY_EDIT_MODE = [10, 3];
export const BBOX_LAYER_DASH_ARRAY_DEFAULT = [0, 0]; // Dashed lines in edit mode
export const BBOX_LAYER_DASH_JUSTIFIED = true;
export const BBOX_LAYER_DASH_GAP_PICKABLE = true;
export const BBOX_LAYER_EXTENSIONS = [new PathStyleExtension({ dash: true })]; // Enable dash extension
export const BBOX_LAYER_LINE_WIDTH_EDIT_MODE = 100000;
export const BBOX_LAYER_LINE_WIDTH_DEFAULT = 1;
