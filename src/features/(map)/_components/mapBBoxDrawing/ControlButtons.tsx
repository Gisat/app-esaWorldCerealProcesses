import { ActionIcon, Stack, Tooltip } from "@mantine/core";
import React from "react";
import { IconCircleDashedPlus, IconEditOff, IconEdit, IconTrash } from '@tabler/icons-react';
import styles from './style.module.css';
import { BboxPoint, BboxPoints } from "./types";

// Default color for active icons used in control buttons
export const DEFAULT_ICON_ACTIVE_COLOR = "#007FFF";

interface ControlButtonsProps {
    isActive: boolean; // Indicates if the editing mode is active.
    activeBboxPoints: BboxPoints | BboxPoint | []; // Array of active bounding box points.
    setEditModeIsActive: (editModeIsActive: boolean) => void; // Function to set the edit mode state.
    clearPoints: () => void; // Function to clear the selected points.
    customStyles?: React.CSSProperties; // CSS properties for styles the component.
}

/**
 * Component that renders control buttons for editing and clearing bounding box points on a map.
 *
 * @param {ControlButtonsProps} props - The props for the component.
 * @returns {JSX.Element} The rendered control buttons component.
 */
const ControlButtons: React.FC<ControlButtonsProps> = ({
    isActive,
    activeBboxPoints,
    setEditModeIsActive,
    clearPoints,
		customStyles
}) => {
    const handleEditToggle = () => {
        if (isActive && activeBboxPoints.length === 1) {
            clearPoints();
        }
        setEditModeIsActive(!isActive);
    };

    const getTooltipLabel = () => {
        if (activeBboxPoints.length > 1) {
            return isActive ? "Stop editing" : "Start editing";
        }
        return isActive ? "Stop drawing" : "Start drawing";
    };

		const editIcon = activeBboxPoints.length > 1 ? (
			isActive ? <IconEditOff className={styles["mapBBoxDrawing-buttons-icons"]} /> : <IconEdit className={styles["mapBBoxDrawing-buttons-icons"]} />
		) : (
				<IconCircleDashedPlus className={styles["mapBBoxDrawing-buttons-icons"]} color={isActive ? DEFAULT_ICON_ACTIVE_COLOR : undefined} />
		);

    return (
        <Stack
            className={styles["mapBBoxDrawing-buttons"]}
            style={customStyles}
        >
            <Tooltip label={getTooltipLabel()}>
                <ActionIcon 
                    className={styles["mapBBoxDrawing-addBtn"]} 
                    variant="default" 
                    onClick={handleEditToggle}
                >
                    {editIcon}
                </ActionIcon>
            </Tooltip>
            <Tooltip label={"Clear selection"}>
                <ActionIcon 
                    className={styles["mapBBoxDrawing-addBtn"]} 
                    variant="default" 
                    onClick={clearPoints}
                >
                    <IconTrash className={styles["mapBBoxDrawing-buttons-icons"]} />
                </ActionIcon>
            </Tooltip>
        </Stack>
    );
};

export default ControlButtons;