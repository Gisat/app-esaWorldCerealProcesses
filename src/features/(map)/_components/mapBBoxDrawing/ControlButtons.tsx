import { ActionIcon, Stack, Tooltip } from "@mantine/core";
import React from "react";
import { IconCircleDashedPlus, IconEditOff, IconEdit, IconTrash } from '@tabler/icons-react';
import styles from './style.module.css';

interface ControlButtonsProps {
    isActive: boolean;
    activeBboxPoints: Array<Array<number>>;
		position?: Object;
    setEditModeIsActive: (editModeIsActive: boolean) => void;
    clearPoints: () => void;
}

/**
 * Component that renders control buttons for editing and clearing bounding box points on a map.
 *
 * @typedef {Object} ControlButtonsProps
 * @property {boolean} isActive - Indicates if the editing mode is active.
 * @property {Array<Array<number>>} activeBboxPoints - Array of active bounding box points.
 * @property {(editModeIsActive: boolean) => void} setEditModeIsActive - Function to set the edit mode state.
 * @property {() => void} clearPoints - Function to clear the selected points.
 * @returns {JSX.Element} The rendered control buttons component.
 */

const ControlButtons: React.FC<ControlButtonsProps> = (
	{
		isActive,
		activeBboxPoints,
		position,
		setEditModeIsActive,
		clearPoints
	}
) => {

  return (
		<Stack
			className={styles["mapBBoxDrawing-buttons"]}
			gap={"0.7rem"}
			style={position}
		>
			<Tooltip label={activeBboxPoints.length > 1 ? isActive ? "Stop editing" : "Start editing" : isActive ? "Stop drawing" : "Start drawing"}>
				<ActionIcon className={styles["mapBBoxDrawing-addBtn"]} variant="default" onClick={() => {isActive && activeBboxPoints.length === 1 ? clearPoints() : null; setEditModeIsActive(!isActive)}}>
					{
						activeBboxPoints.length > 1 
							? isActive 
								? <IconEditOff width={"1.5rem"} height={"1.5rem"} />
								: <IconEdit width={"1.5rem"} height={"1.5rem"} /> 
							: isActive 
								? <IconCircleDashedPlus width={"1.5rem"} height={"1.5rem"} color={"#007FFF"} /> 
								: <IconCircleDashedPlus width={"1.5rem"} height={"1.5rem"} />
					}
				</ActionIcon>
			</Tooltip>
			<Tooltip label={"Clear selection"}>
				<ActionIcon className={styles["mapBBoxDrawing-addBtn"]} variant="default" onClick={clearPoints}>
					<IconTrash width={"1.5rem"} height={"1.5rem"} />
				</ActionIcon>
			</Tooltip>
		</Stack>
  );
};

export default ControlButtons;