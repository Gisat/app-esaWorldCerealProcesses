import { WebMercatorViewport } from '@deck.gl/core';
import { useEffect, useState } from 'react';
import BoundingBox from '@features/(map)/_components/mapBBoxDrawing/BoundingBox';
import RenderingMap from '@features/(map)/_components/mapComponent/RenderingMap';

const defaultMapSize: Array<number> = [500, 500] //in pixels

const maxSize = [500000, 500000];
const minSize = 0.1;

const defaultMapView = { latitude: 50, longitude: 15, zoom: 7 }

const roundCoordinates = (coordinatesToRound: Array<Array<number>>) => coordinatesToRound.map((coordinates, index) => {
	return `[${coordinates.map(coordinate => {
		return `${Math.round(coordinate * 100) / 100}`
	})}]${coordinatesToRound?.length - 1 !== index ? "," : ""} `
})

export const MapBBox = function ({ onBboxChange, bbox, disabled, mapSize = defaultMapSize, setAreaBbox, setCoordinatesToDisplay }: 
	{ extentSizeInMeters?: Array<number>, mapSize?: Array<number>, disabled?: boolean, bbox?: Array<number>, onBboxChange?: (extent?:  Array<Array<number>> | null) => void, setAreaBbox?: (area: number) => void, setCoordinatesToDisplay?: React.Dispatch<React.SetStateAction<string | string[] | null>> }
) {
	
	const [initialView, setInitialView] = useState<object | null>(null);
	const [distanceScales, setDistanceScales] = useState<{unitsPerDegree?: Array<number>, metersPerUnit: Array<number>} | null>(null);

	const setBboxDescription = ((points?: Array<Array<number>> | null) => {
		const bboxCornerPoints = points?.length ? [...points[0], ...points[2]] : bbox;
		if (distanceScales?.unitsPerDegree && distanceScales?.metersPerUnit && bboxCornerPoints && setAreaBbox) {	
			const latLength = (bboxCornerPoints[2] - bboxCornerPoints[0]) * distanceScales.unitsPerDegree[0] * distanceScales.metersPerUnit[0];
			const lonLength = (bboxCornerPoints[3] - bboxCornerPoints[1]) * distanceScales.unitsPerDegree[1] * distanceScales.metersPerUnit[1];
			const area = latLength / 1000 * lonLength / 1000;
			setAreaBbox(Math.round(area));
		}
		if (bboxCornerPoints && setCoordinatesToDisplay) {
			setCoordinatesToDisplay(roundCoordinates([[bboxCornerPoints[0], bboxCornerPoints[1]], [bboxCornerPoints[2], bboxCornerPoints[3]]]));
		} else if (setCoordinatesToDisplay) {
			setCoordinatesToDisplay("none");
		}
	})

	useEffect(() => {
		if (distanceScales) {	
			setBboxDescription();
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [distanceScales])

	let bboxPoints = null;

	if (bbox) {
		bboxPoints = [[bbox[2], bbox[3]], [bbox[2], bbox[1]], [bbox[0], bbox[1]], [bbox[0], bbox[3]]]
	}

	if (!initialView && bbox) {

		const bboxView = { longitude: (bbox[0] + bbox[2]) / 2, latitude: (bbox[1] + bbox[3]) / 2 }

		const viewport = new WebMercatorViewport(bboxView);
		const fitView = viewport.fitBounds([[bbox[0], bbox[1]], [bbox[2], bbox[3]]], {
			width: mapSize[0],
			height: mapSize[1],
			padding: 20
		})
		setInitialView(fitView);
		setDistanceScales(viewport.distanceScales)
	} else if (!initialView && !bbox && setCoordinatesToDisplay) {
		setInitialView(defaultMapView);
		setCoordinatesToDisplay("none");
	}

	return <div style={{ width: `${mapSize[0]}px`, height: `${mapSize[1]}px`, position: 'relative' }}>
		<BoundingBox
			onBboxCoordinatesChange={(points) => {if (onBboxChange) onBboxChange(points); setBboxDescription(points)}}
			minBboxArea={minSize}
			followMapScreen={true}
			availableArea={[maxSize]}
			buttonsPosition={{ top: ".5rem", right: ".5rem" }}
			bboxPoints={bboxPoints || []}
			disabled={disabled}
		>
			<RenderingMap
				width="100%"
				height="100%"
				initialView={initialView}
				getMetersPerUnit={setDistanceScales}
			/>
		</BoundingBox>
	</div>

}