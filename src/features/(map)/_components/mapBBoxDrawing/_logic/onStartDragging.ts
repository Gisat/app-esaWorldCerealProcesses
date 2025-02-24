import { DragStartInfo, Coordinate, bboxDragInfo } from "../types";

// Function to start dragging the bounding box
export const onStartDragging = (
    info: DragStartInfo,
    setBboxDragInfo: (updatedDragInfo: bboxDragInfo) => void,
    setOriginalBboxBorderCoordinates: (coords: Coordinate[]) => void
) => {
    if (info.object) {
        // Set the bounding box drag information with the current coordinate
        setBboxDragInfo({ dragType: undefined, coordinates: [[0, 0], info.coordinate], originCoordinates: undefined });
        
        // Set the original bounding box border coordinates from the dragged object
        setOriginalBboxBorderCoordinates(info.object.geometry.coordinates[0]);
    }
};