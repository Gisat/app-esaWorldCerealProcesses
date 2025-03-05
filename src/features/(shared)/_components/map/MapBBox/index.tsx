import { WebMercatorViewport } from "@deck.gl/core";
import BoundingBox from "@features/(map)/_components/mapBBoxDrawing/BoundingBox";
import { BboxPoints } from "@features/(map)/_components/mapBBoxDrawing/types";
import RenderingMap from "@features/(map)/_components/mapComponent/RenderingMap";
import { useCallback, useEffect, useState } from "react";
import ControlButtons from "./ControlButtons";

const defaultMapSize: Array<number> = [500, 500]; // Default map size in pixels

const minSize = 0.1; // Minimum size for the bounding box

const defaultMapView = { latitude: 50, longitude: 15, zoom: 7 }; // Default map view settings

const availableAreaConfig = {
  lineWidthMinPixels: 0.8,
  lineWidthMaxPixels: 2,
  getLineWidth: 500,
  getDashArray: [20, 10],
};

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
 * @param {Array<number>} [props.extentSizeInMeters] - The extent size in meters.
 * @param {Array<number>} [props.mapSize=defaultMapSize] - The size of the map.
 * @param {boolean} [props.disabled] - Whether the bounding box is disabled.
 * @param {Array<number>} [props.bbox] - The bounding box coordinates.
 * @param {Function} [props.onBboxChange] - Callback function for when the bounding box changes.
 * @param {Function} [props.setAreaBbox] - Callback function for setting the area of the bounding box.
 * @param {Function} [props.setCoordinatesToDisplay] - Callback function for setting the coordinates to display.
 * @param {string | string[] | null} [props.coordinatesToDisplay] - Coordinates to display.
 * @returns {JSX.Element} The rendered map with bounding box component.
 */
export const MapBBox = function ({
  extentSizeInMeters = [
    Math.sqrt(2500 * 1_000_000),
    Math.sqrt(2500 * 1_000_000),
  ], // Default 2500 km²
  onBboxChange,
  bbox,
  disabled,
  mapSize = defaultMapSize,
  setAreaBbox,
  setCoordinatesToDisplay,
  coordinatesToDisplay,
}: {
  extentSizeInMeters?: [number, number];
  mapSize?: Array<number>;
  disabled?: boolean;
  bbox?: Array<number>;
  onBboxChange?: (extent?: Array<Array<number>> | null) => void;
  setAreaBbox?: (area: number | undefined) => void;
  setCoordinatesToDisplay?: React.Dispatch<
    React.SetStateAction<string | string[] | null>
  >;
  coordinatesToDisplay: string | string[] | null;
}) {
  const [initialView, setInitialView] = useState<object | null>(null); // State for the initial view of the map
  const [distanceScales, setDistanceScales] = useState<{
    unitsPerDegree?: Array<number>;
    metersPerUnit: Array<number>;
  } | null>(null); // State for the distance scales

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
   * Sets the description of the bounding box.
   *
   * @param {Array<Array<number>> | null} points - The points of the bounding box.
   */
  const setBboxDescription = useCallback(
    (points?: Array<Array<number>> | null) => {
      const bboxCornerPoints = points?.length
        ? [...points[0], ...points[2]]
        : null;
      if (
        bboxCornerPoints &&
        distanceScales?.unitsPerDegree &&
        distanceScales?.metersPerUnit
      ) {
        const latLength =
          (bboxCornerPoints[2] - bboxCornerPoints[0]) *
          distanceScales.unitsPerDegree[0] *
          distanceScales.metersPerUnit[0];
        const lonLength =
          (bboxCornerPoints[3] - bboxCornerPoints[1]) *
          distanceScales.unitsPerDegree[1] *
          distanceScales.metersPerUnit[1];
        const area = ((latLength / 1000) * lonLength) / 1000;
        if (setCoordinatesToDisplay) {
          setCoordinatesToDisplay(
            roundCoordinates([
              [bboxCornerPoints[0], bboxCornerPoints[1]],
              [bboxCornerPoints[2], bboxCornerPoints[3]],
            ])
          );
        }
        if (setAreaBbox) {
          setAreaBbox(Math.round(area));
        }
      } else {
        if (setCoordinatesToDisplay) {
          setCoordinatesToDisplay("none");
        }
        if (setAreaBbox) {
          setAreaBbox(undefined);
        }
      }
    },
    [distanceScales, setAreaBbox, setCoordinatesToDisplay]
  );

	// To update description when page 2 is loaded with bbox coordinates already in url
  useEffect(() => {
    if (!coordinatesToDisplay && distanceScales && bboxPoints) {
      setBboxDescription(bboxPoints);
    }
  }, [distanceScales, bboxPoints, setBboxDescription, coordinatesToDisplay]);

  // Set the initial view and distance scales if bbox is provided
  if (!initialView && bbox) {
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
        padding: 20,
      }
    );
    setInitialView(fitView);
    setDistanceScales(viewport.distanceScales);
  } else if (!initialView && !bbox && setCoordinatesToDisplay) {
    setInitialView(defaultMapView);
    setCoordinatesToDisplay("none");
  }

  return (
    <div
      style={{
        width: `${mapSize[0]}px`,
        height: `${mapSize[1]}px`,
        position: "relative",
				padding: "0.2rem 0"
      }}
    >
      <BoundingBox
        onBboxCoordinatesChange={(points) => {
					if (points?.length === 4) {
						if (onBboxChange) onBboxChange(points);
						if (setBboxDescription) setBboxDescription(points);
					}
        }}
        minBboxArea={minSize}
        followMapScreen={true}
        availableArea={[extentSizeInMeters]}
        bboxPoints={bboxPoints}
        disabled={disabled}
        availableAreaConfig={availableAreaConfig}
				CustomButtonsComponent={<ControlButtons />}
      >
        <RenderingMap
          width="100%"
          height="100%"
          initialView={initialView}
          setDistanceScales={setDistanceScales}
        />
      </BoundingBox>
    </div>
  );
};