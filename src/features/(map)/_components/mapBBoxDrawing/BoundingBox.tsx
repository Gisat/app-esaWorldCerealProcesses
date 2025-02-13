import React, { useState, useEffect, Children, cloneElement, useRef } from "react";
import { isPointInPolygon } from "./helpers";
import ControlButtons from "./ControlButtons";
import { addPointToMap } from "./_logic/addPointToMap";
import { dragLayer } from "./_logic/dragLayer";
import { editLayerBorder } from "./_logic/editLayerBorder";
import { availableAreaLayer } from "./_layers/availableAreaLayer";
import { bboxLayer } from "./_layers/bBoxLayer";
import {
	LAYER_ID_BBOX,
	LAYER_ID_BBOX_LINES,
	CURSOR_GRABBING,
	CURSOR_E_RESIZE,
	CURSOR_S_RESIZE,
	CURSOR_NOT_ALLOWED,
	CURSOR_POINTER,
	CURSOR_GRAB,
	HOVER_BLOCKED,
	HOVER_BORDER_HORIZONTAL,
	HOVER_BORDER_VERTICAL,
	DRAG_LAYER,
	DRAG_LAYER_BORDER,
	HOVER_LAYER
} from './constants';

interface BoundingBoxProps {
	availableArea?: Array<Array<number>>;
	children: React.ReactNode;
	onBboxCoordinatesChange: (bbox: Array<Array<number>> | null) => void;
	minBboxArea?: number;
	followMapScreen?: boolean;
	buttonsPosition?: object;
	bboxPoints?: Array<Array<number>>;
	disabled?: boolean;
}

/**
 * Controllable bounding box component.
 * 
 * @typedef {Object} BoundingBoxProps
 * @property {Array<Array<number>>} availableArea - Can be specified by coordinates (BL, TL, TR, BR) or by meters (width, height) in center of the screen.
 * @property {React.ReactNode} children - Map component.
 * @property {(bbox: Array<Array<number>> | null) => void} onBboxCoordinatesChange - Callback when bbox coordinates change.
 * @property {number} minBboxArea - Minimum area for the bounding box.
 * @property {boolean} followMapScreen - Whether the layers move with the map.
 * @property {Object} buttonsPosition - Position of the control buttons.
 * @returns {JSX.Element} The rendered BoundingBox component.
 */

const BoundingBox: React.FC<BoundingBoxProps> = ({
	availableArea,
	children,
	onBboxCoordinatesChange,
	minBboxArea = 1,
	followMapScreen = false,
	buttonsPosition = { top: ".5rem", right: ".5rem" },
	bboxPoints = [],
	disabled = false
}) => {
	const mapRef = useRef<any>(null); // Reference to the map
	const [editModeIsActive, setEditModeIsActive] = useState(false); // Edit mode state
	const [bboxIsHovered, setBboxIsHovered] = useState<string | boolean>(false); // Hover state for the bounding box
	const [activeBboxPoints, setActiveBboxPoints] = useState<Array<Array<number>>>(bboxPoints); // Active points of the bounding box
	const [bboxDragInfo, setBboxDragInfo] = useState<{ dragType?: string, coordinates: Array<Array<number>>, originCoordinates?: number } | null>(null); // Dragging information
	const [originalBboxBorderCoordinates, setOriginalBboxBorderCoordinates] = useState<Array<Array<number>>>([]); // Original bounding box border coordinates
	const [previousDraggedPoint, setPreviousDraggedPoint] = useState<Array<number>>([]); // Previous dragged point
	const [updatedAvailableArea, setUpdatedAvailableArea] = useState<Array<Array<number>> | null>(null); // Updated available area
	const [predictedHoveredPoints, setPredictedHoveredPoints] = useState<Array<Array<number> | undefined> | null>(null); // Predicted hovered points

	// Calculate updated available area bounds
	const updatedAvailableAreaBounds = [updatedAvailableArea?.[0], updatedAvailableArea?.[2]];
	const updatedAvailableAreaLat = [updatedAvailableAreaBounds?.[0]?.[0], updatedAvailableAreaBounds?.[1]?.[0]];
	const updatedAvailableAreaLong = [updatedAvailableAreaBounds?.[0]?.[1], updatedAvailableAreaBounds?.[1]?.[1]];

	// Effect to handle dragging of the bounding box
	useEffect(() => {
		if (bboxDragInfo?.dragType === DRAG_LAYER) {
			dragLayer(bboxDragInfo?.coordinates, activeBboxPoints, updatedAvailableAreaLat, updatedAvailableAreaLong, minBboxArea, updatedAvailableArea, setActiveBboxPoints);
		} else if (bboxDragInfo?.dragType === DRAG_LAYER_BORDER) {
			editLayerBorder(bboxDragInfo?.coordinates, activeBboxPoints, originalBboxBorderCoordinates, updatedAvailableAreaLat, updatedAvailableAreaLong, minBboxArea, updatedAvailableArea, setActiveBboxPoints, setOriginalBboxBorderCoordinates);
		}
    }, [bboxDragInfo]);

	// Effect to update available area based on the provided coordinates
	useEffect(() => {
		if (availableArea?.length === 1 && mapRef?.current?.deck?.viewManager) {
			const viewport = mapRef?.current?.deck?.viewManager?._viewports?.[0];
			const topRight = viewport?.addMetersToLngLat([viewport?.longitude, viewport?.latitude], [availableArea[0][0] / 2, availableArea[0][1] / 2]);
			const bottomLeft = viewport?.addMetersToLngLat([viewport?.longitude, viewport?.latitude], [-availableArea[0][0] / 2, -availableArea[0][1] / 2]);
			setUpdatedAvailableArea([bottomLeft, [bottomLeft[0], topRight[1]], topRight, [topRight[0], bottomLeft[1]], bottomLeft]);
		} else if (availableArea?.length === 4) {
			setUpdatedAvailableArea([...availableArea, availableArea[0]]);
		}
    }, [availableArea, mapRef?.current?.deck?.viewManager]);
	// Clear active points and predicted hovered points
	const clearPoints = () => {
		setActiveBboxPoints([]);
		setPredictedHoveredPoints(null);
		onBboxCoordinatesChange(null);
	};

	// This function handles click events on a map layer. It checks if the clicked point is within a specified area and manages the editing state for bounding box points.
	// Depending on the current mode and the number of active points, it either adds a point to the map or toggles the edit mode.
	const onClick = (info: { layer: { id: string }, coordinate: [number, number] }) => {
		const isInsideArea = isPointInPolygon(updatedAvailableArea, info.coordinate);
		if (editModeIsActive && (isInsideArea || !updatedAvailableArea)) {
			if (predictedHoveredPoints && bboxIsHovered !== HOVER_BLOCKED) {
				addPointToMap(info.coordinate, activeBboxPoints, false, setActiveBboxPoints, setPredictedHoveredPoints, onBboxCoordinatesChange);
			} 
			if (!predictedHoveredPoints && bboxIsHovered !== HOVER_BLOCKED) {
				if (info.layer.id === LAYER_ID_BBOX) {
					setEditModeIsActive(!editModeIsActive);
				} else if (activeBboxPoints?.length < 2) {
					addPointToMap(info.coordinate, activeBboxPoints, false, setActiveBboxPoints, setPredictedHoveredPoints, onBboxCoordinatesChange);
					setEditModeIsActive(true);
					setBboxIsHovered(HOVER_BLOCKED);
				} else {
					setEditModeIsActive(false);
                }
			}
		} else if (info.layer.id === LAYER_ID_BBOX && bboxIsHovered !== HOVER_BLOCKED) {
			setEditModeIsActive(!editModeIsActive);
		}
	};

	// This function determines the cursor style based on the dragging state, bounding box hover state, and edit mode. 
	// It returns different cursor styles such as 'grabbing', 'e-resize', 's-resize', 'not-allowed', 'pointer', or 'grab' depending on the conditions met.
	const getCursor = (info: { isDragging: boolean }) => {
		if (info.isDragging || bboxDragInfo) {
				return CURSOR_GRABBING;
		} else if (activeBboxPoints?.length > 1 && bboxIsHovered && editModeIsActive || activeBboxPoints?.length < 2 && editModeIsActive) {
				if (bboxIsHovered === HOVER_BORDER_HORIZONTAL) {
						return CURSOR_E_RESIZE;
				} else if (bboxIsHovered === HOVER_BORDER_VERTICAL) {
						return CURSOR_S_RESIZE;
				} else if (bboxIsHovered === HOVER_BLOCKED) {
						return CURSOR_NOT_ALLOWED;
				} else {
						return CURSOR_POINTER;
				}
		} else if (bboxIsHovered === HOVER_LAYER) {
				return CURSOR_POINTER;
		} else {
				return CURSOR_GRAB;
		}
	};
	
	// This function handles hover events on a bounding box layer. It checks if the hovered point is inside a specified area, 
	// manages the size of the bounding box based on active points, and updates the hover state based on various conditions including edit mode and layer type.
	const onHover = (info: { layer: { id: string }, coordinate: [number, number], object: { geometry: { coordinates: Array<[Array<[number]>, Array<[number]>]> }, properties: { name: string } } }) => {
		if (info?.coordinate) {
			const isInsideArea = isPointInPolygon(updatedAvailableArea, info.coordinate);
			let isLargeEnough = true;
			if (activeBboxPoints.length === 1) {
				const currentPoint = info.coordinate;
				const latDiff = activeBboxPoints[0][0] - currentPoint[0];
				const longDiff = activeBboxPoints[0][1] - currentPoint[1];
				isLargeEnough = (latDiff > (minBboxArea) || latDiff < (-minBboxArea)) && (longDiff > (minBboxArea) || longDiff < (-minBboxArea));
				addPointToMap(currentPoint, activeBboxPoints, true, setActiveBboxPoints, setPredictedHoveredPoints, onBboxCoordinatesChange);
			}
			if ((!isInsideArea && editModeIsActive && updatedAvailableArea) || !isLargeEnough) {
				setBboxIsHovered(HOVER_BLOCKED);
			} else if (info?.object?.properties?.name === LAYER_ID_BBOX_LINES && editModeIsActive) {
				const coordinates = info?.object?.geometry?.coordinates?.[0];
				if (coordinates?.[0]?.[0] === coordinates?.[1]?.[0]) {
					setBboxIsHovered(HOVER_BORDER_HORIZONTAL);
				} else {
					setBboxIsHovered(HOVER_BORDER_VERTICAL);
				}
			} else if (info?.layer?.id === LAYER_ID_BBOX) {
				setBboxIsHovered(HOVER_LAYER);
			} else {
				setBboxIsHovered(false);
			}
		}
	}

	// This function handles the dragging of a bounding box in a graphical interface. It checks if the cursor is inside a specified area and if editing mode is active.
	// Depending on the type of object being dragged, it updates the bounding box drag information with the new coordinates or resets the original bounding box border coordinates.
	const onDrag = (info: { coordinate: [number, number], object: { properties: { name: string }, geometry: { coordinates: [number] } } }) => {
		const cursorInsideArea = isPointInPolygon(updatedAvailableArea, info.coordinate);
		if (editModeIsActive && bboxDragInfo && (cursorInsideArea || bboxDragInfo)) {
			if (info?.object?.properties?.name === LAYER_ID_BBOX_LINES) {
				setBboxDragInfo({dragType: DRAG_LAYER_BORDER, coordinates: [bboxDragInfo?.coordinates?.[1], info?.coordinate], originCoordinates: info?.object?.geometry?.coordinates?.[0]})
			} else {
				setOriginalBboxBorderCoordinates([]);
				setBboxDragInfo({dragType: DRAG_LAYER, coordinates: [bboxDragInfo?.coordinates?.[1], info?.coordinate]})
			}
		}
	}

	// This function handles changes in the map's view state, updating the active bounding box points and the available area based on user interactions like dragging, zooming, or panning.
	// It calculates the difference in latitude and longitude from the previous position to adjust the positions of the bounding box points and available area accordingly.
	const onViewStateChange = (viewInfo: { viewState: { latitude: number, longitude: number }, oldViewState: { latitude: number, longitude: number }, interactionState: { isDragging: boolean, isZooming: boolean, isPanning: boolean } }) => {
		if (followMapScreen && viewInfo && activeBboxPoints && updatedAvailableArea && previousDraggedPoint && !editModeIsActive && (viewInfo?.interactionState?.isDragging || viewInfo?.interactionState?.isZooming || viewInfo?.interactionState?.isPanning)) {
			const originViewLat = viewInfo.oldViewState.latitude;
			const originViewLong = viewInfo.oldViewState.longitude;

			const newViewLat = viewInfo.viewState.latitude;
			const newViewLong = viewInfo.viewState.longitude;

			const latDif = newViewLat - (previousDraggedPoint?.[0] ? previousDraggedPoint?.[0] : originViewLat);
			const longDif = newViewLong - (previousDraggedPoint?.[1] ? previousDraggedPoint?.[1] : originViewLong);
      
			// Update bounding box points and available area based on the view change
			const movedPoints = activeBboxPoints.map(point => {
				return (
					[point[0] + longDif, point[1] + latDif]
				)
			});
			const movedBounds = updatedAvailableArea.map(point => {
				return (
					[point[0] + longDif, point[1] + latDif]
				)
			});
			setPreviousDraggedPoint([newViewLat, newViewLong]);
			setUpdatedAvailableArea(movedBounds)
			setActiveBboxPoints(movedPoints);
			onBboxCoordinatesChange(movedPoints);
		}
  };

    // Start dragging the bounding box
    const onStartDragging = (info: { coordinate: [number], object: { geometry: { coordinates: Array<[]> } } }) => {
        setBboxDragInfo({ coordinates: [[], info?.coordinate] });
        setOriginalBboxBorderCoordinates(info?.object?.geometry?.coordinates?.[0]);
    };

    // Stop dragging the bounding box
    const onStopDragging = () => {
        setBboxDragInfo(null);
        setOriginalBboxBorderCoordinates([]);
				onBboxCoordinatesChange(activeBboxPoints);
    };

  return (
		<>
			{Children.map(children, child => {
				return cloneElement(child as React.ReactElement<any>, {
					mapRef: mapRef,
					onClick: !disabled ? onClick : null,
					layer: [[
						availableAreaLayer(updatedAvailableArea, editModeIsActive),
						bboxLayer(activeBboxPoints, bboxIsHovered, editModeIsActive, predictedHoveredPoints)
					]],
					getCursor: !disabled ? getCursor : null,
					onHover: !disabled ? onHover : null,
					onDrag: !disabled ? onDrag : null,
					onStartDragging: !disabled ? onStartDragging : null,
					onStopDragging: !disabled ? onStopDragging : null,
					onViewStateChange: !disabled ? onViewStateChange : null,
					disableControlls: editModeIsActive || disabled
				})
			})}
			{!disabled ? 
				<ControlButtons
					isActive={editModeIsActive}
					activeBboxPoints={activeBboxPoints}
					position={buttonsPosition}
					setEditModeIsActive={setEditModeIsActive}
					clearPoints={clearPoints}
				/> 
			: null}
		</>
  );
};

export default BoundingBox;
