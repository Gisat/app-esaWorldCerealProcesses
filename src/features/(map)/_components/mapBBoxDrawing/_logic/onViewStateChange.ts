import { BboxEnclosedPoints, BboxPoint, BboxPoints, Coordinate, ViewStateChangeInfo } from "../types";

// This function handles changes in the map's view state, updating the active bounding box points and the available area based on user interactions like dragging, zooming, or panning.
// It calculates the difference in latitude and longitude from the previous position to adjust the positions of the bounding box points and available area accordingly.
export const onViewStateChange = (
	viewInfo: ViewStateChangeInfo,
	followMapScreen: boolean,
	activeBboxPoints: BboxPoints | BboxPoint | [],
	updatedAvailableArea: BboxEnclosedPoints | null,
	previousDraggedPoint: number[] | null,
	editModeIsActive: boolean,
	setPreviousDraggedPoint: (point: Coordinate) => void,
	setUpdatedAvailableArea: (area: BboxEnclosedPoints | null) => void,
	setActiveBboxPoints: (points: [] | BboxPoints | BboxPoint) => void,
	onBboxCoordinatesChange: (points: BboxPoints | BboxPoint | null) => void
) => {
	if (followMapScreen && viewInfo && activeBboxPoints && updatedAvailableArea && previousDraggedPoint && 
			!editModeIsActive && 
			(viewInfo.interactionState.isDragging || viewInfo.interactionState.isZooming || viewInfo.interactionState.isPanning)) {
			
			const originViewLat = viewInfo.oldViewState.latitude;
			const originViewLong = viewInfo.oldViewState.longitude;
			const newViewLat = viewInfo.viewState.latitude;
			const newViewLong = viewInfo.viewState.longitude;

			const latDif = newViewLat - (previousDraggedPoint[0] || originViewLat);
			const longDif = newViewLong - (previousDraggedPoint[1] || originViewLong);

			// Update bounding box points and available area based on the view change
			const movedPoints = activeBboxPoints.map(point => {
					return [point[0] + longDif, point[1] + latDif];
			});

			const movedBounds = updatedAvailableArea.map(point => {
					return [point[0] + longDif, point[1] + latDif];
			});

			setPreviousDraggedPoint([newViewLat, newViewLong]);
			setUpdatedAvailableArea(movedBounds as BboxEnclosedPoints);
			setActiveBboxPoints(movedPoints as BboxPoints);
			onBboxCoordinatesChange(movedPoints as BboxPoints);
	}
};