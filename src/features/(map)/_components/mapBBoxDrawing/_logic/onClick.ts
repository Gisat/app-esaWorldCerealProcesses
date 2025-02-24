import { HOVER_BLOCKED, LAYER_ID_BBOX } from "../constants";
import { isPointInPolygon } from "../helpers";
import { BboxEnclosedPoints, BboxPoint, BboxPoints, ClickInfo, Coordinate } from "../types";
import { addPointToMap } from "./addPointToMap";

// Function to handle click events on a map layer
export const onClick = (
    info: ClickInfo,
    updatedAvailableArea: BboxEnclosedPoints | null,
    editModeIsActive: boolean,
    predictedHoveredPoints: BboxPoints | null,
    bboxIsHovered: string | boolean,
    activeBboxPoints: BboxPoints | BboxPoint | [],
    setActiveBboxPoints: (activeBboxPoints: BboxPoints | BboxPoint | []) => void,
    setPredictedHoveredPoints: (predictedHoveredPoints: BboxPoints | null) => void,
    onBboxCoordinatesChange: (bbox: BboxPoints | BboxPoint | null) => void,
    setEditModeIsActive: (isActive: boolean | ((prev: boolean) => boolean)) => void,
    setBboxIsHovered: (state: string) => void
) => {
    // Check if the clicked point is inside the available area
    const isInsideArea = isPointInPolygon(updatedAvailableArea, info.coordinate);

    // If in edit mode and either inside the area or there is no available area
    if (editModeIsActive && (isInsideArea || !updatedAvailableArea)) {
        // If there are predicted hovered points and the bounding box is not blocked
        if (predictedHoveredPoints && bboxIsHovered !== HOVER_BLOCKED) {
            addPointToMap(
                info.coordinate,
                activeBboxPoints,
                false,
                setActiveBboxPoints,
                setPredictedHoveredPoints,
                onBboxCoordinatesChange
            );
        } 
        // If there are no predicted hovered points and the bounding box is not blocked
        if (!predictedHoveredPoints && bboxIsHovered !== HOVER_BLOCKED) {
            handleClickWithoutPredictedPoints(info, activeBboxPoints, setActiveBboxPoints, setEditModeIsActive, setBboxIsHovered, setPredictedHoveredPoints, onBboxCoordinatesChange);
        }
    } 
    // If clicking on the bounding box layer and it's not blocked
    else if (info?.layer?.id === LAYER_ID_BBOX && bboxIsHovered !== HOVER_BLOCKED) {
        setEditModeIsActive(!editModeIsActive); // Toggle edit mode
    }
};

// Helper function to handle clicks without predicted points
const handleClickWithoutPredictedPoints = (
    info: ClickInfo,
    activeBboxPoints: BboxPoints | BboxPoint | [],
    setActiveBboxPoints: (activeBboxPoints: BboxPoints | BboxPoint | []) => void,
    setEditModeIsActive: (isActive: boolean | ((prev: boolean) => boolean)) => void,
    setBboxIsHovered: (state: string) => void,
    setPredictedHoveredPoints: (points: BboxPoints | null) => void,
    onBboxCoordinatesChange: (bbox: BboxPoints | BboxPoint | null) => void
) => {
    if (info && info.layer.id === LAYER_ID_BBOX) {
        // Toggle edit mode if clicking on the bounding box layer
        setEditModeIsActive((prev: boolean) => !prev);
    } else if (activeBboxPoints.length < 2) {
        // Add a point to the map and enable edit mode if there are fewer than 2 active points
        addPointToMap(
            info.coordinate,
            activeBboxPoints,
            false,
            setActiveBboxPoints,
            setPredictedHoveredPoints,
            onBboxCoordinatesChange
        );
        setEditModeIsActive(true);
        setBboxIsHovered(HOVER_BLOCKED); // Set bounding box to blocked state
    } else {
        // Disable edit mode if more than 2 active points
        setEditModeIsActive(false);
    }
};