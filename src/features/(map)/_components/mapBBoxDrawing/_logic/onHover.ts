import {
	LAYER_ID_BBOX,
	LAYER_ID_BBOX_LINES,
	HOVER_BLOCKED,
	HOVER_BORDER_HORIZONTAL,
	HOVER_BORDER_VERTICAL,
	HOVER_LAYER
} from '../constants';
import { isPointInPolygon } from '../helpers';
import { BboxEnclosedPoints, BboxPoint, BboxPoints, Coordinate, HoverInfo } from '../types';
import { addPointToMap } from './addPointToMap';

// Function to handle hover events on a bounding box layer
export const onHover = (
	info: HoverInfo,
	updatedAvailableArea: BboxEnclosedPoints | null,
	activeBboxPoints: BboxPoints | BboxPoint | [],
	minBboxArea: number,
	editModeIsActive: boolean,
	setBboxIsHovered: (state: string | boolean) => void,
	setActiveBboxPoints: (points: BboxPoints | BboxPoint | []) => void,
	setPredictedHoveredPoints: (points: BboxPoints | null) => void,
	onBboxCoordinatesChange: (bbox: BboxPoints | BboxPoint | null) => void
) => {
	// Check if the coordinate information is available
	if (!info?.coordinate) return;

	const isInsideArea = isPointInPolygon(updatedAvailableArea, info.coordinate);
	let isLargeEnough = true;

	// If there is one active bounding box point, check size and add point to the map
	if (activeBboxPoints.length === 1) {
			const currentPoint = info.coordinate;
			const latDiff = activeBboxPoints[0][0] - currentPoint[0];
			const longDiff = activeBboxPoints[0][1] - currentPoint[1];
			isLargeEnough = (latDiff > minBboxArea || latDiff < -minBboxArea) && 
											(longDiff > minBboxArea || longDiff < -minBboxArea);
			addPointToMap(currentPoint, activeBboxPoints, true, setActiveBboxPoints, setPredictedHoveredPoints, onBboxCoordinatesChange);
	}

	// Check conditions for hover state
	if ((!isInsideArea && editModeIsActive && updatedAvailableArea) || !isLargeEnough) {
			setBboxIsHovered(HOVER_BLOCKED); // Set hover state to blocked
	} else if (info?.object?.properties?.name === LAYER_ID_BBOX_LINES && editModeIsActive) {
			const coordinates = info.object.geometry.coordinates[0].map(coord => [coord[0], coord[1]] as Coordinate);
			setBboxIsHovered(determineBorderHover(coordinates)); // Determine hover state based on the coordinates
	} else if (info?.layer?.id === LAYER_ID_BBOX) {
			setBboxIsHovered(HOVER_LAYER); // Layer hover state
	} else {
			setBboxIsHovered(false); // Reset hover state
	}
};

// Function to determine the hover state for borders
const determineBorderHover = (coordinates: Coordinate[]): string => {
	if (coordinates[0][0] === coordinates[1][0]) {
			return HOVER_BORDER_HORIZONTAL; // Horizontal border hover
	} else {
			return HOVER_BORDER_VERTICAL; // Vertical border hover
	}
};