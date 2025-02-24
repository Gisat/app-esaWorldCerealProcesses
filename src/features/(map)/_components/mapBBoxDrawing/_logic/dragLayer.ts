import { findClosest } from "../helpers";
import { BboxEnclosedPoints, BboxPoint, BboxPoints, Coordinate } from "../types";

/**
 * Handles the dragging of a bounding box (bbox).
 * Updates the active bbox coordinates based on the drag distance.
 * 
 * @param {Array} coordinates - An array containing the previous and current coordinates of the drag.
 * @param {Array} activeBboxPoints - Current coordinates of the active bounding box.
 * @param {Array} updatedAvailableAreaLat - Updated latitude bounds of the available area.
 * @param {Array} updatedAvailableAreaLong - Updated longitude bounds of the available area.
 * @param {Number} minBboxArea - Minimum area required for the bounding box.
 * @param {Array} updatedAvailableArea - Updated available area as an array of coordinates.
 * @param {Function} setActiveBboxPoints - Function to update the active bounding box points.
 */
export const dragLayer = (
    coordinates: BboxPoint,
    activeBboxPoints: BboxPoints | BboxPoint | [],
    updatedAvailableAreaLat: Coordinate | undefined,
    updatedAvailableAreaLong: Coordinate | undefined,
    minBboxArea: number,
    updatedAvailableArea: BboxEnclosedPoints | null,
    setActiveBboxPoints: (activeBboxPoints: BboxPoints | BboxPoint | []) => void
) => {
    const previousPoint = coordinates[0]; // Previous position of the bbox
    const draggedPoint = coordinates[1]; // Current position of the bbox being dragged

    if (draggedPoint && previousPoint && coordinates) {
        // Calculate the difference in latitude and longitude
        const diffLat = draggedPoint[0] - previousPoint[0];
        const diffLong = draggedPoint[1] - previousPoint[1];

        // Update each point of the active bounding box based on the drag
        const newPoints: BboxPoints | BboxPoint = activeBboxPoints.map((point: Coordinate, index: number) => {
            let newLat = point[0];
            let newLong = point[1];

            // Update latitude based on the drag difference
            newLat += diffLat;
            newLong += diffLong;

            // Check if the available area bounds are defined
            if (
                updatedAvailableAreaLat &&
                updatedAvailableAreaLong &&
                updatedAvailableArea
            ) {
                // Adjust latitude based on the updated available area and minimum bbox area
                if (diffLat > 0 && (index === 2 || index === 3)) {
                    newLat = updatedAvailableAreaLat[1] - minBboxArea < newLat ? updatedAvailableAreaLat[1] - minBboxArea : newLat; 
                }
                if (diffLat < 0 && (index === 0 || index === 1)) {
                    newLat = updatedAvailableAreaLat[0] + minBboxArea > newLat ? updatedAvailableAreaLat[0] + minBboxArea : newLat; 
                }

                // Ensure new latitude is within the updated available area
                if (newLat < updatedAvailableArea[0][0] || newLat > updatedAvailableArea[2][0]) {
                    newLat = findClosest(updatedAvailableAreaLat, newLat)
                }

                // Adjust longitude based on the updated available area and minimum bbox area
                if (diffLong > 0 && (index === 1 || index === 2)) {
                    newLong = updatedAvailableAreaLong[1] - minBboxArea < newLong ? updatedAvailableAreaLong[1] - minBboxArea : newLong; 
                }
                if (diffLong < 0 && (index === 3 || index === 0)) {
                    newLong = updatedAvailableAreaLong[0] + minBboxArea > newLong ? updatedAvailableAreaLong[0] + minBboxArea : newLong; 
                }

                // Ensure new longitude is within the updated available area
                if (newLong < updatedAvailableArea[0][1] || newLong > updatedAvailableArea[2][1]) {
                    newLong = findClosest(updatedAvailableAreaLong, newLong)
                }
            }

            return [newLat, newLong]; // Return the new coordinates for the current point
        });

        // Update the active bounding box points with the new coordinates
        setActiveBboxPoints(newPoints);
    }
}