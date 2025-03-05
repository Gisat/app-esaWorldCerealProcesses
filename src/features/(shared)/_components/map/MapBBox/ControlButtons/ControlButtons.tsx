import { Button, Stack } from "@mantine/core";
import React from "react";
import { IconPencil, IconTrash } from '@tabler/icons-react';
import './style.css';

// Default color for active icons used in control buttons
const edit_bbox_color = "#DE4444";

interface ControlButtonsProps {
	handleEditToggle?: () => void;
	clearPoints?: () => void;
	isActive?: boolean;
}

/**
 * Component that renders control buttons for editing and clearing bounding box points on a map.
 *
 * @param {ControlButtonsProps} props - The props for the component.
 * @returns {JSX.Element} The rendered control buttons component.
 */
const ControlButtons: React.FC<ControlButtonsProps> = ({
		handleEditToggle,
		clearPoints,
		isActive
}) => {

    return (
					<Stack
							className="worldCereal-Mapbbox-ControlButtons"
					>
							<Button
								className="worldCereal-Button"
								onClick={handleEditToggle}
								autoContrast
								leftSection={<IconPencil size={18}/>}
								size="xl"
								bg={isActive ? edit_bbox_color : "gray"}
							>
								{isActive ? "Stop drawing" : "Start drawing"}
							</Button>
							<Button
								className="worldCereal-Button"
								onClick={clearPoints}
								autoContrast
								leftSection={<IconTrash size={18}/>}
								size="xl"
							>
								Clear drawing
							</Button>
					</Stack>
    );
};

export default ControlButtons;