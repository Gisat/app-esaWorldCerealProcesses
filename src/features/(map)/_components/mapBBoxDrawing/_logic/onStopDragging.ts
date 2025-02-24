import { bboxDragInfo, BboxPoint, BboxPoints } from "../types";

// Type for the coordinates
type Coordinate = [number, number];

// Function to stop dragging the bounding box
export const onStopDragging = (
	setBboxDragInfo: (info: bboxDragInfo | null) => void,
	setOriginalBboxBorderCoordinates: (coords: Coordinate[]) => void,
	onBboxCoordinatesChange: (points: BboxPoints | BboxPoint | null) => void,
	activeBboxPoints: BboxPoints | BboxPoint | []
) => {
	// Reset the bounding box drag information
	setBboxDragInfo(null);
	
	// Reset the original bounding box border coordinates
	setOriginalBboxBorderCoordinates([]);
	
	// Call the function to handle changes in bounding box coordinates
	onBboxCoordinatesChange(activeBboxPoints);
};