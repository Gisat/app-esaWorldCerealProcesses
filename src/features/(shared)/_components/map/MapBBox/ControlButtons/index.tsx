import { Button, Stack } from "@mantine/core";
import React from "react";
import { IconPencil, IconTrash } from '@tabler/icons-react';
import './style.css';

// Default color for active icons used in control buttons
const edit_bbox_color = "#e04a4a";
const edit_bbox_default_color = "var(--base700)";

interface ControlButtonsProps {
  handleEditToggle?: () => void;
  clearPoints?: () => void;
  isActive?: boolean;
  activePoints?: Array<Array<number>>;
}

/**
 * Component that renders control buttons for editing and clearing bounding box points on a map.
 *
 * @param {ControlButtonsProps} props - The props for the component.
 * @param {Function} [props.handleEditToggle] - Function to handle toggling the edit mode.
 * @param {Function} [props.clearPoints] - Function to clear the bounding box points.
 * @param {boolean} [props.isActive] - Indicates if the edit mode is active.
 * @param {Array<Array<number>>} [props.activePoints] - The active points of the bounding box.
 * @returns {JSX.Element} The rendered control buttons component.
 */
const ControlButtons: React.FC<ControlButtonsProps> = ({
  handleEditToggle,
  clearPoints,
  isActive,
  activePoints
}) => {
  const drawingState = activePoints?.length === 4 ? "editing" : "drawing";
  return (
    <Stack className="worldCereal-Mapbbox-ControlButtons">
      <Button
        className="worldCereal-Button"
        onClick={handleEditToggle}
        autoContrast
        leftSection={<IconPencil size={15} />}
        size="sm"
        bg={isActive ? edit_bbox_color : edit_bbox_default_color}
      >
        {isActive ? "Stop" : "Start"} {drawingState}
      </Button>
      <Button
        className="worldCereal-Button"
        onClick={clearPoints}
        autoContrast
        leftSection={<IconTrash size={15} />}
        size="sm"
        bg={edit_bbox_default_color}
      >
        Clear drawing
      </Button>
    </Stack>
  );
};

export default ControlButtons;