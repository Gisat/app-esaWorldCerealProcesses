import { DRAG_LAYER, DRAG_LAYER_BORDER, LAYER_ID_BBOX_LINES } from "../constants";
import { isPointInPolygon } from "../helpers";
import { bboxDragInfo, BboxEnclosedPoints, BboxPoint, Coordinate, DragInfo } from "../types"

// This function handles the dragging of a bounding box in a graphical interface.
// It checks if the cursor is inside a specified area and if editing mode is active.
// Depending on the type of object being dragged, it updates the bounding box drag information
// with the new coordinates or resets the original bounding box border coordinates.
export const onDrag = (
    info: DragInfo,
    updatedAvailableArea: BboxEnclosedPoints | null,
    editModeIsActive: boolean,
    bboxDragInfo: bboxDragInfo | null ,
    setBboxDragInfo: (updatedDragInfo: bboxDragInfo) => void,
    setOriginalBboxBorderCoordinates: (coords: Coordinate[]) => void
) => {
    const cursorInsideArea = isPointInPolygon(updatedAvailableArea, info.coordinate);

    // Check if we are in edit mode and dragging is active
    if (editModeIsActive && bboxDragInfo && (cursorInsideArea || bboxDragInfo)) {
        const draggedObjectName = info.object.properties.name;

        if (draggedObjectName === LAYER_ID_BBOX_LINES) {
            // Update the bounding box drag info for border dragging
            setBboxDragInfo({
                dragType: DRAG_LAYER_BORDER,
                coordinates: [bboxDragInfo.coordinates[1], info.coordinate],
                originCoordinates: info.object.geometry.coordinates[0]
            });
        } else {
            // Reset original bounding box border coordinates and update drag info
            setOriginalBboxBorderCoordinates([]);
            setBboxDragInfo({
                dragType: DRAG_LAYER,
                coordinates: [bboxDragInfo.coordinates[1], info.coordinate]
            });
        }
    }
};