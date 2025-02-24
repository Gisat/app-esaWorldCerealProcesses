import { getMaxCoordinatesIndex, getMinCoordinatesIndex } from "../helpers";
import { BboxPoint, BboxPoints, Coordinate } from "../types";

/**
 * Adds a new bounding box (bbox) point to the map.
 * Requires two points to define a bbox, so this function can be called twice.
 * If the first point is already active, it adds all bbox points.
 * 
 * @param {Array} coordinates - The new coordinates to add as a point.
 * @param {Array} activeBboxPoints - The currently active bounding box points.
 * @param {boolean} isDraft - Indicates if the operation is in draft mode.
 * @param {Function} setActiveBboxPoints - Function to update the active bounding box points.
 * @param {Function} setPredictedHoveredPoints - Function to set predicted hovered points.
 * @param {Function} onFinishDragging - Callback function to execute when dragging is finished.
 */
export const addPointToMap = (
    coordinates: Coordinate,
    activeBboxPoints: Array<Coordinate>,
    isDraft: boolean,
    setActiveBboxPoints: (activeBboxPoints: BboxPoints | BboxPoint | []) => void,
    setPredictedHoveredPoints: (predictedHoveredPoints: BboxPoints | null) => void,
    onFinishDragging: (activeBboxPoints: BboxPoints | BboxPoint | []) => void,
) => {
    // If there are no active bounding box points, initialize with the new coordinates.
    if (activeBboxPoints.length === 0) {
        setActiveBboxPoints([coordinates]);
    } else {
        // Create an array of corner points using the first active point and the new coordinates.
        const cornerPoints = [activeBboxPoints[0], coordinates];
        
        // Determine the top and bottom corner points based on the coordinates.
        const topCornerPoint = cornerPoints[getMaxCoordinatesIndex(cornerPoints)];
        const bottomCornerPoint = cornerPoints[getMinCoordinatesIndex(cornerPoints)];
        
        // Construct the bounding box using the corner points.
        const bbox = [
            topCornerPoint,
            [topCornerPoint[0], bottomCornerPoint[1]], // Top right corner
            bottomCornerPoint,
            [bottomCornerPoint[0], topCornerPoint[1]] // Bottom left corner
        ];
        
        // Get the indices of the max and min coordinates in the bbox.
        const maxCoordinatesIndex = getMaxCoordinatesIndex(bbox);
        const minCoordinatesIndex = getMinCoordinatesIndex(bbox);
        
        // Fix the bbox if necessary, based on the max and min indices.
        const fixedBbox = ((maxCoordinatesIndex === 0 && minCoordinatesIndex === 2)
            ? bbox
            : [
                bbox[maxCoordinatesIndex],
                bbox.at(maxCoordinatesIndex - 1),
                bbox.at(minCoordinatesIndex),
                bbox.at(minCoordinatesIndex - 1)
            ]) as BboxPoints;

        // If in draft mode, set the predicted hovered points to the fixed bbox.
        if (isDraft) {
            setPredictedHoveredPoints(fixedBbox);
        } else {
            // Otherwise, finalize the bbox points and reset the predicted hovered points.
            setActiveBboxPoints(fixedBbox);
            onFinishDragging(fixedBbox);
            setPredictedHoveredPoints(null);
        }
    }
}