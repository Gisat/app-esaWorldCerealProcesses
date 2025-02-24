import React, { useState, useEffect, Children, cloneElement, useRef } from "react";
import ControlButtons from "./ControlButtons";
import { dragLayer } from "./_logic/dragLayer";
import { editLayerBorder } from "./_logic/editLayerBorder";
import { availableAreaLayer } from "./_layers/availableAreaLayer";
import { bboxLayer } from "./_layers/bBoxLayer";
import {
    DRAG_LAYER,
    DRAG_LAYER_BORDER,
} from './constants';
import { getCursor } from "./_logic/getCursor";
import { onClick } from "./_logic/onClick";
import { onDrag } from "./_logic/onDrag";
import { onStartDragging } from "./_logic/onStartDragging";
import { onStopDragging } from "./_logic/onStopDragging";
import { onViewStateChange } from "./_logic/onViewStateChange";
import { clearPoints } from "./_logic/clearPoints";
import { onHover } from "./_logic/onHover";
import { bboxDragInfo, BboxEnclosedPoints, BboxLinePoints, BboxPoint, BboxPoints, ClickInfo, Coordinate, DragInfo, DragStartInfo, GetCursorInfo, HoverInfo, ViewStateChangeInfo } from "./types";

interface BoundingBoxProps {
    availableArea?: Array<Array<number>>;
    children: React.ReactNode;
    onBboxCoordinatesChange: (bbox: BboxPoints | BboxPoint | null) => void;
    minBboxArea?: number;
    followMapScreen?: boolean;
    buttonsStyles?: object;
    bboxPoints?: BboxPoints;
    disabled?: boolean;
		availableAreaConfig?: Object,
		bboxConfig?: Object
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
 * @property {Object} buttonsStyles - Styles of the control buttons.
 * @returns {JSX.Element} The rendered BoundingBox component.
 */

const BoundingBox: React.FC<BoundingBoxProps> = ({
    availableArea = [],
    children,
    onBboxCoordinatesChange,
    minBboxArea = 1,
    followMapScreen = false,
    buttonsStyles = {},
    bboxPoints = [],
    disabled = false,
		availableAreaConfig = {},
		bboxConfig = {}
}) => {
    const mapRef = useRef<any>(null); // Reference to the map
    const [editModeIsActive, setEditModeIsActive] = useState(false); // Edit mode state
    const [bboxIsHovered, setBboxIsHovered] = useState<string | boolean>(false); // Hover state for the bounding box
    const [activeBboxPoints, setActiveBboxPoints] = useState<BboxPoints | BboxPoint | []>(bboxPoints); // Active points of the bounding box
    const [bboxDragInfo, setBboxDragInfo] = useState<bboxDragInfo | null>(null); // Dragging information
    const [originalBboxBorderCoordinates, setOriginalBboxBorderCoordinates] = useState<Coordinate[]>([]); // Original bounding box border coordinates
    const [previousDraggedPoint, setPreviousDraggedPoint] = useState<Coordinate | []>([]); // Previous dragged point
    const [updatedAvailableArea, setUpdatedAvailableArea] = useState<BboxEnclosedPoints | null>(null); // Updated available area
    const [predictedHoveredPoints, setPredictedHoveredPoints] = useState<BboxPoints | null>(null); // Predicted hovered points

    // Effect to handle dragging of the bounding box
    const updateBboxDragInfo = (updatedDragInfo: bboxDragInfo | null) => {
				setBboxDragInfo(updatedDragInfo);
        // Calculate updated available area bounds
				let updatedAvailableAreaBounds;
        let updatedAvailableAreaLat;
        let updatedAvailableAreaLong;
				if (updatedAvailableArea) {
					updatedAvailableAreaBounds = [updatedAvailableArea[0], updatedAvailableArea[2]];
					updatedAvailableAreaLat = [updatedAvailableAreaBounds[0][0], updatedAvailableAreaBounds[1][0]] as Coordinate;
					updatedAvailableAreaLong = [updatedAvailableAreaBounds[0][1], updatedAvailableAreaBounds[1][1]] as Coordinate;
				}
				if (updatedDragInfo) {
					switch (updatedDragInfo.dragType) {
							case DRAG_LAYER:
									dragLayer(updatedDragInfo?.coordinates, activeBboxPoints, updatedAvailableAreaLat, updatedAvailableAreaLong, minBboxArea, updatedAvailableArea, setActiveBboxPoints);
									break;
							case DRAG_LAYER_BORDER:
									editLayerBorder(updatedDragInfo?.coordinates, activeBboxPoints, originalBboxBorderCoordinates, updatedAvailableAreaLat, updatedAvailableAreaLong, minBboxArea, updatedAvailableArea, setActiveBboxPoints, setOriginalBboxBorderCoordinates);
									break;
							default:
									break;
					}
				}
    };

    // Effect to update available area based on the provided coordinates
    useEffect(() => {
			const viewport = mapRef?.current?.deck?.viewManager?._viewports?.[0];
        if (viewport) {
            switch (availableArea.length) {
                case 1: {
                    const topRight = viewport.addMetersToLngLat([viewport.longitude, viewport.latitude], [availableArea[0][0] / 2, availableArea[0][1] / 2]);
                    const bottomLeft = viewport.addMetersToLngLat([viewport.longitude, viewport.latitude], [-availableArea[0][0] / 2, -availableArea[0][1] / 2]);
                    const newUpdatedAvailableArea = [bottomLeft, [bottomLeft[0], topRight[1]], topRight, [topRight[0], bottomLeft[1]], bottomLeft] as BboxEnclosedPoints;
                    setUpdatedAvailableArea(newUpdatedAvailableArea);
                    break;
                }
                case 4:
                    setUpdatedAvailableArea([...availableArea, availableArea[0]] as BboxEnclosedPoints);
                    break;
                default:
                    break;
            }
        }
    }, [availableArea, mapRef]);

    const mappedChildren = Children.map(children, child => {
        // Destructure props for better readability
        const isDisabled = disabled;
        const cursorHandler = isDisabled ? () => "default" : (info: GetCursorInfo) => getCursor(info, bboxDragInfo, activeBboxPoints, editModeIsActive, bboxIsHovered);
        const clickHandler = isDisabled ? null : (info: ClickInfo) => onClick(info, updatedAvailableArea, editModeIsActive, predictedHoveredPoints, bboxIsHovered, activeBboxPoints, setActiveBboxPoints, setPredictedHoveredPoints, onBboxCoordinatesChange, setEditModeIsActive, setBboxIsHovered);
        const hoverHandler = isDisabled ? null : (info: HoverInfo) => onHover(info, updatedAvailableArea, activeBboxPoints, minBboxArea, editModeIsActive, setBboxIsHovered, setActiveBboxPoints, setPredictedHoveredPoints, onBboxCoordinatesChange);
        const dragHandler = isDisabled ? null : (info: DragInfo) => onDrag(info, updatedAvailableArea, editModeIsActive, bboxDragInfo, updateBboxDragInfo, setOriginalBboxBorderCoordinates);
        const startDragHandler = isDisabled ? null : (info: DragStartInfo) => onStartDragging(info, updateBboxDragInfo, setOriginalBboxBorderCoordinates);
        const stopDragHandler = isDisabled ? null : () => onStopDragging(updateBboxDragInfo, setOriginalBboxBorderCoordinates, onBboxCoordinatesChange, activeBboxPoints);
        const viewStateChangeHandler = isDisabled ? null : (info: ViewStateChangeInfo) => onViewStateChange(info, followMapScreen, activeBboxPoints, updatedAvailableArea, previousDraggedPoint, editModeIsActive, setPreviousDraggedPoint, setUpdatedAvailableArea, setActiveBboxPoints, onBboxCoordinatesChange);

        return cloneElement(child as React.ReactElement<any>, {
            mapRef: mapRef,
            onClick: clickHandler,
            layer: [
                availableAreaLayer(updatedAvailableArea, editModeIsActive, availableAreaConfig),
                bboxLayer(activeBboxPoints, bboxIsHovered, editModeIsActive, predictedHoveredPoints, bboxConfig)
            ],
            getCursor: cursorHandler,
            onHover: hoverHandler,
            onDrag: dragHandler,
            onStartDragging: startDragHandler,
            onStopDragging: stopDragHandler,
            onViewStateChange: viewStateChangeHandler,
            disableControls: editModeIsActive || isDisabled
        });
    });

    return (
        <>
            {mappedChildren}
            {!disabled ? 
                <ControlButtons
                    isActive={editModeIsActive}
                    activeBboxPoints={activeBboxPoints}
                    customStyles={buttonsStyles}
                    setEditModeIsActive={setEditModeIsActive}
                    clearPoints={() => clearPoints(setActiveBboxPoints, setPredictedHoveredPoints, onBboxCoordinatesChange)}
                /> 
            : null}
        </>
    );
};

export default BoundingBox;