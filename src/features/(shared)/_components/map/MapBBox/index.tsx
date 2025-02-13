import DeckGL from '@deck.gl/react';
import { GeoJsonLayer, BitmapLayer } from '@deck.gl/layers';
import { TileLayer } from '@deck.gl/geo-layers';
import { WebMercatorViewport } from '@deck.gl/core';
import { useEffect, useRef, useState } from 'react';
import { ExtentLayer } from '../../../../(map)/_components/layers/ExtentLayer';
import BoundingBox from '@features/(map)/_components/mapBBoxDrawing/BoundingBox';
import RenderingMap from '@features/(map)/_components/mapComponent/RenderingMap';

// const ExtentLayerID = "ExtentLayer";
const defaultMapSize: Array<number> = [500, 500] //in pixels
const defaultExtentSizeInMeters = [500, 500]; //in meters

const maxSize = [500000, 500000];
const minSize = 0.1;

const defaultMapView = { latitude: 50, longitude: 15, zoom: 7 }

// type ExtentType = [] | number[] | undefined;

export const MapBBox = function ({ longitude, latitude, onBboxChange, bbox = [], disabled, mapSize = defaultMapSize, extentSizeInMeters = defaultExtentSizeInMeters, setAreaBbox }: { extentSizeInMeters?: Array<number>, mapSize?: Array<number>, disabled?: boolean, bbox?: ExtentType, onBboxChange?: (extent?: ExtentType) => void, longitude?: number, latitude?: number, setAreaBbox?: () => void }) {
	// const mapRef = useRef<any>(null);
	// const layer = bbox ? new GeoJsonLayer({
	// 	id: ExtentLayerID, data: getGeoJsonFromBbox(bbox), getLineColor: [0, 0, 0],
	// 	getLineWidth: 5,
	// 	lineWidthUnits: "pixels",
	// 	filled: false,
	// }) : new ExtentLayer({ id: ExtentLayerID });
	// }) : new ExtentLayer({ id: ExtentLayerID, extentSize: extentSizeInMeters }); TODO: check and fix this of needed


	// let fitView;
	// if (bbox) {
	// 	const bboxView = { longitude: (bbox[0] + bbox[2]) / 2, latitude: (bbox[1] + bbox[3]) / 2 }

	// 	const viewport = new WebMercatorViewport(bboxView);
	// 	fitView = viewport.fitBounds([[bbox[0], bbox[1]], [bbox[2], bbox[3]]], {
	// 		width: mapSize[0],
	// 		height: mapSize[1],
	// 		padding: 20
	// 	})
	// } else {
	// 	fitView = {
	// 		longitude: longitude || 15,
	// 		latitude: latitude || 50,
	// 		zoom: 10 //default zoom
	// 	}
	// }

	// const [mapView, setMapView] = useState(fitView)

	// const onViewStateChange = ({ viewState }: { viewState: any }) => {
		// setMapView({ latitude: viewState.latitude, longitude: viewState.longitude, zoom: !Number.isNaN(viewState.zoom) ? viewState.zoom : 10 })

	// 	// set extent layer
	// 	const deckHeight = mapRef?.current?.deck?.height
	// 	const deckWidth = mapRef?.current?.deck?.width
	// 	const view = mapRef?.current?.deck.viewManager.views?.[0]
	// 	const viewport = view.makeViewport({ width: deckWidth, height: deckHeight, viewState });

	// 	const topRight = viewport.addMetersToLngLat([viewState.longitude, viewState.latitude], [extentSizeInMeters[0] / 2, extentSizeInMeters[1] / 2])
	// 	const bottomLeft = viewport.addMetersToLngLat([viewState.longitude, viewState.latitude], [-extentSizeInMeters[0] / 2, -extentSizeInMeters[1] / 2])
	// 	if (onBboxChange) {
	// 		onBboxChange([...bottomLeft, ...topRight])
	// 	}

	// }

	const [hasInitialView, setHasInitialView] = useState(false);

	let bboxPoints = null;
	//let fitView = false;

	const bboxNumbers = bbox?.length > 0 ? bbox.map(bboxString => {return(Number(bboxString))}) : null;

	if (bboxNumbers) {
		bboxPoints = [[Number(bboxNumbers[2]), Number(bboxNumbers[3])], [Number(bboxNumbers[2]), Number(bboxNumbers[1])], [Number(bboxNumbers[0]), Number(bboxNumbers[1])], [Number(bboxNumbers[0]), Number(bboxNumbers[3])]]
	}

	//let initialView = { latitude: 50, longitude: 15, zoom: 7 }

	const getMetersPerUnit = (distanceScales) => {
		if (distanceScales) {	
			const latLength = (Number(bbox?.[2]) - Number(bbox?.[0])) * distanceScales.unitsPerDegree[0] * distanceScales.metersPerUnit[0];
			const lonLength = (Number(bbox?.[3]) - Number(bbox?.[1])) * distanceScales.unitsPerDegree[1] * distanceScales.metersPerUnit[1];
			const area = latLength / 1000 * lonLength / 1000;
			console.log(area, latLength)
			setAreaBbox(Math.round(area));
			//setAreaBbox(latLength / 1000);
		}
	}

	if (!hasInitialView && bboxNumbers) {
		// setHasInitialView({ longitude: ((bboxPoints?.[0]?.[0] + bboxPoints?.[2]?.[0]) / 2) || 15, latitude: ((bboxPoints?.[0]?.[1] + bboxPoints?.[2]?.[1]) / 2) || 50, zoom: 7 })
		//setHasInitialView(true)
		// let fitView;
		const bboxView = { longitude: (bboxNumbers[0] + bboxNumbers[2]) / 2, latitude: (bboxNumbers[1] + bboxNumbers[3]) / 2 }

		const viewport = new WebMercatorViewport(bboxView);
		const fitView = viewport.fitBounds([[bboxNumbers[0], bboxNumbers[1]], [bboxNumbers[2], bboxNumbers[3]]], {
			width: mapSize[0],
			height: mapSize[1],
			padding: 20
		})
		setHasInitialView(fitView);
		getMetersPerUnit(viewport.distanceScales)

		console.log(bboxView, bboxNumbers, viewport, fitView)
	}



	//console.log(hasInitialView, bboxPoints, bboxNumbers)


	return <div style={{ width: `${mapSize[0]}px`, height: `${mapSize[1]}px`, position: 'relative' }}>
		<BoundingBox
			onBboxCoordinatesChange={(points) => {onBboxChange(points)}}
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
				initialView={hasInitialView || defaultMapView}
				// getMetersPerUnit={(meters) => getMetersPerUnit(
				// 	bboxPoints[0][0] - bboxPoints[2][0],
				// )}
				getMetersPerUnit={getMetersPerUnit}
			/>
		</BoundingBox>
	</div>

}