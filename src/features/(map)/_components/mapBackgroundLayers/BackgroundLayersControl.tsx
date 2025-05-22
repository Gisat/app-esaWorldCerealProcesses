import { ActionIcon, SimpleGrid, Text, Tooltip } from "@mantine/core";
import React, { useEffect, useRef, useState } from "react";
import { IconStack2 } from "@tabler/icons-react";
import classNames from "classnames";

import { backgroundLayers } from "./backgroundLayers.js";

import esri_WorldTopoMap from "./img/esri_WorldTopoMap.png";
import esri_WorldImagery from "./img/esri_WorldImagery.png";
import esri_WorldGrayCanvas from "./img/esri_WorldGrayCanvas.png";
import cartoVoyager from "./img/cartoVoyager.png";
import openStreetMap_Mapnik from "./img/openStreetMap_Mapnik.png";

import "./style.css";

/**
 * Mapping of background layer keys to their image sources.
 * @type {Record<string, string>}
 */
const backgroundLayerImages: Record<string, string> = {
  esri_WorldTopoMap: esri_WorldTopoMap.src,
  esri_WorldImagery: esri_WorldImagery.src,
  esri_WorldGrayCanvas: esri_WorldGrayCanvas.src,
  cartoVoyager: cartoVoyager.src,
  openStreetMap_Mapnik: openStreetMap_Mapnik.src,
};

/**
 * Props for the BackgroundLayersControl component.
 * @typedef {Object} ControlButtonsProps
 * @property {string|null} [backgroundLayer] - Currently selected background layer key.
 * @property {function} [setBackgroundLayer] - Function to set the background layer.
 */
interface ControlButtonsProps {
  backgroundLayer?: string | null;
  setBackgroundLayer?: React.Dispatch<React.SetStateAction<string | null>>;
}

/**
 * Component that renders a control for selecting map background layers.
 *
 * @param {ControlButtonsProps} props - The props for the component.
 * @returns {JSX.Element} The rendered background layers control component.
 */
const BackgroundLayersControl: React.FC<ControlButtonsProps> = ({
  backgroundLayer,
  setBackgroundLayer,
}) => {
  const [backgroundLayersOpen, setBackgroundLayersOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // Handles closing the background layers menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setBackgroundLayersOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const backgroundLayersArray = Object.values(backgroundLayers);

  /**
   * Handles changing the background layer.
   * @param {string} layer - The key of the selected background layer.
   */
  const onBackgroundLayerChange = (layer: string) => {
    if (setBackgroundLayer) setBackgroundLayer(layer);
  };

  const backgroundLayersElements = backgroundLayersArray.map((layer) => {
    const layerKey = layer.key;
    const className = classNames("mapBackgroundLayers-layerControl", {
      "is-active": backgroundLayer === layerKey,
    });

    return (
      <div
        className={className}
        key={layerKey}
        onClick={() => onBackgroundLayerChange(layerKey)}
      >
        <div
          className="mapBackgroundLayers-bgLayerImage"
          style={{
            backgroundImage: `url(${backgroundLayerImages[layerKey]})`,
          }}
        ></div>
        <Text size="sm">{layer.name}</Text>
      </div>
    );
  });

  return (
    <div className="mapBackgroundLayers">
      {backgroundLayersOpen && (
        <>
          <SimpleGrid
            ref={wrapperRef}
            className="mapBackgroundLayers-container"
            cols={3}
            spacing={10}
          >
            {backgroundLayersElements}
          </SimpleGrid>
          <div className="mapBackgroundLayers-connector"></div>
        </>
      )}
      <Tooltip label="Background layers" withArrow>
        <ActionIcon
          ref={buttonRef}
          className="mapBackgroundLayers-controlBtn"
          variant="default"
          onClick={() => setBackgroundLayersOpen(!backgroundLayersOpen)}
        >
          <IconStack2 className="mapBackgroundLayers-controlBtn-icon" />
        </ActionIcon>
      </Tooltip>
    </div>
  );
};

export default BackgroundLayersControl;
