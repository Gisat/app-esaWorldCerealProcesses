import { BboxPoint, BboxPoints, Coordinate } from "../types";

// Function to clear active points and predicted hovered points
export const clearPoints = (
    setActiveBboxPoints: (points: BboxPoints | []) => void,
    setPredictedHoveredPoints: (points: BboxPoints | null) => void,
    onBboxCoordinatesChange: (points: BboxPoints | null) => void
) => {
    // Clear active bounding box points
    setActiveBboxPoints([]);
    
    // Clear predicted hovered points
    setPredictedHoveredPoints(null);
    
    // Notify that bounding box coordinates have changed
    onBboxCoordinatesChange(null);
};