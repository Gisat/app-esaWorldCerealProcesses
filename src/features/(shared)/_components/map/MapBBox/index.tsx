import { WebMercatorViewport } from "@deck.gl/core";
import BoundingBox from "@features/(map)/_components/mapBBoxDrawing/BoundingBox";
import { BboxPoints } from "@features/(map)/_components/mapBBoxDrawing/types";
import RenderingMap from "@features/(map)/_components/mapComponent/RenderingMap";
import { useState } from "react";
import ControlButtons from "./ControlButtons";
import { area as turfArea } from "@turf/area";
import { polygon as turfPolygon } from "@turf/helpers";
import { BoundingBoxExtent } from "@features/(processes)/_types/boundingBoxExtent";

const defaultMapSize: Array<number> = [500, 500]; // Default map size in pixels

const defaultMapView = { latitude: 30, longitude: 0, zoom: 1 }; // Default map view settings

/**
 * Rounds the coordinates to two decimal places.
 *
 * @param {Array<Array<number>>} coordinatesToRound - The coordinates to round.
 * @returns {Array<string>} The rounded coordinates as strings.
 */
const roundCoordinates = (coordinatesToRound: Array<Array<number>>) =>
  coordinatesToRound.map((coordinates, index) => {
    return `[${coordinates.map((coordinate) => {
      return `${Math.round(coordinate * 100) / 100}`;
    })}]${coordinatesToRound?.length - 1 !== index ? "," : ""} `;
  });

/**
 * Component that renders a map with a bounding box.
 *
 * @param {Object} props - The props for the component.
 * @param {Array<number>} [props.mapSize=defaultMapSize] - The size of the map in pixels as [width, height].
 * @param {boolean} [props.disabled] - Whether the bounding box is disabled.
 * @param {Array<number>} [props.bbox] - The bounding box coordinates as [minLng, minLat, maxLng, maxLat].
 * @param {number} [props.minBboxArea=0.0009] - The minimum area of the bounding box.
 * @param {number} [props.maxBboxArea=100000] - The maximum area of the bounding box.
 * @param {Function} [props.setBboxDescription] - Callback for setting the description of the bounding box.
 * @param {Function} [props.setBboxExtent] - Callback for setting the extent of the bounding box.
 * @param {Function} [props.setBboxIsInBounds] - Callback for setting whether the bounding box is within bounds.
 * @param {string|null} [props.backgroundLayer] - The key of the currently selected background layer.
 * @param {Function} [props.setBackgroundLayer] - Function to set the background layer.
 * @returns {JSX.Element} The rendered map with bounding box component.
 */
export const MapBBox = function ({
  bbox,
  disabled,
  mapSize = defaultMapSize,
  minBboxArea = 0.0009,
  maxBboxArea = 100000,
  setBboxDescription,
  setBboxExtent,
  setBboxIsInBounds,
  backgroundLayer,
  setBackgroundLayer,
}: {
  mapSize?: Array<number>;
  disabled?: boolean;
  bbox?: Array<number>;
  minBboxArea?: number;
  maxBboxArea?: number;
  setBboxDescription?: React.Dispatch<
    React.SetStateAction<string | string[] | null>
  >;
  setBboxExtent?: (extent: BoundingBoxExtent | null) => void;
  setBboxIsInBounds?: (isInBounds: boolean) => void;
  backgroundLayer?: string | null;
  setBackgroundLayer?: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const [initialView, setInitialView] = useState<object | null>(null); // State for the initial view of the map

  let bboxPoints: BboxPoints | undefined;

  // Convert bbox coordinates to bbox points
  if (bbox) {
    bboxPoints = [
      [bbox[2], bbox[3]],
      [bbox[2], bbox[1]],
      [bbox[0], bbox[1]],
      [bbox[0], bbox[3]],
    ];
  }

  /**
   * Determines the validity of a bounding box (bbox) based on its area and updates the state accordingly.
   *
   * @param {number} area - The area of the bounding box to validate.
   */
  const setBboxValidity = (area: number) => {
    if (area > minBboxArea && area < maxBboxArea) {
      setBboxIsInBounds?.(true);
    } else {
      setBboxIsInBounds?.(false);
    }
  };

  /**
   * Sets the description of the bounding box.
   *
   * @param {Array<Array<number>> | null} points - The points of the bounding box.
   * @param {number} area - The area of the bounding box.
   */
  const onBboxDescriptionChange = (
    points: Array<Array<number>> | null,
    area: number | null
  ) => {
    if (points?.length === 4 && area && setBboxDescription) {
      const bboxExtentPoints = [points[2], points[0]];
      const bboxRoundedCoordinates = roundCoordinates(bboxExtentPoints).map(
        (coordinate) => coordinate.replace(",", ", ")
      );
      const bboxRoundedArea = Math.round(area)
        .toLocaleString()
        .replace(",", " ");
      setBboxDescription(
        `${bboxRoundedCoordinates[0]} ${bboxRoundedCoordinates[1]} - ${bboxRoundedArea}`
      );
    } else {
      setBboxDescription?.(null);
    }
  };

  /**
   * Sets the description of the bounding box and updates its extent and bounds status.
   *
   * @param {Array<Array<number>> | null} points - The points of the bounding box.
   * @param {number} area - The area of the bounding box.
   */
  const onBboxChange = (
    points: Array<Array<number>> | null,
    area: number | null
  ) => {
    onBboxDescriptionChange(points, area);
    if (points?.length === 4 && area) {
      const bboxExtent = [...points[2], ...points[0]] as BoundingBoxExtent;
      setBboxExtent?.(bboxExtent);
      setBboxValidity(area);
    } else {
      setBboxExtent?.(null);
    }
  };

  // If there is no initial view and bounding box data is available, calculate the view to fit the bounding box and set it as the initial view.
  // Also, create a polygon from the bounding box points, calculate its area, and update the bounding box description.
  if (!initialView && bbox && bboxPoints) {
    const bboxView = {
      longitude: (bbox[0] + bbox[2]) / 2,
      latitude: (bbox[1] + bbox[3]) / 2,
    };

    const viewport = new WebMercatorViewport(bboxView);
    const fitView = viewport.fitBounds(
      [
        [bbox[0], bbox[1]],
        [bbox[2], bbox[3]],
      ],
      {
        width: mapSize[0],
        height: mapSize[1],
        padding: 50,
      }
    );
    setInitialView(fitView);

    const polygon = turfPolygon([[...bboxPoints, bboxPoints[0]]], {
      name: "polygon",
    });
    const area = turfArea(polygon) / 1000000;
    onBboxDescriptionChange(bboxPoints, area);
    setBboxValidity(area);
  } else if (!initialView && !bbox) {
    setInitialView(defaultMapView);
  }

  return (
    <div
      style={{
        width: `${mapSize[0]}px`,
        height: `${mapSize[1]}px`,
        position: "relative",
        padding: "0.2rem 0",
      }}
    >
      <BoundingBox
        onBboxChange={onBboxChange}
        minBboxArea={minBboxArea}
        maxBboxArea={maxBboxArea}
        bboxPoints={bboxPoints}
        disabled={disabled}
        CustomButtonsComponent={<ControlButtons />}
      >
        <RenderingMap
          width="100%"
          height="100%"
          initialView={initialView}
          backgroundLayer={backgroundLayer}
          setBackgroundLayer={setBackgroundLayer}
        />
      </BoundingBox>
    </div>
  );
};
