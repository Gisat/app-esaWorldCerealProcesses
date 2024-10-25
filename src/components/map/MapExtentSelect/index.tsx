import DeckGL from '@deck.gl/react';
import { GeoJsonLayer, BitmapLayer } from '@deck.gl/layers';
import { TileLayer } from '@deck.gl/geo-layers';
import { WebMercatorViewport } from '@deck.gl/core';
import { useRef, useState } from 'react';
import ExtentLayer from '@/components/map/layers/ExtentLayer';

const ExtentLayerID = "ExtentLayer";
const defaultMapSize: Array<number> = [500, 500] //in pixels
const defaultExtentSizeInMeters = [500, 500]; //in meters

type ExtentType = [] | number[] | undefined;

const getGeoJsonFromBbox = (bbox: ExtentType): any => {
	if (!bbox) {
		return {
			"type": "FeatureCollection",
			"features": []
		}
	} else {
		return {
			"type": "FeatureCollection",
			"features": [
				{
					"type": "Feature",
					"geometry": {
						"type": "Polygon",
						"coordinates": [
							[
								[bbox[0], bbox[1]],
								[bbox[2], bbox[1]],
								[bbox[2], bbox[3]],
								[bbox[0], bbox[3]],
								[bbox[0], bbox[1]],
							]
						]
					}
				}
			]
		}

	}
}

export default function ({ longitude, latitude, onBboxChange, bbox, disabled, mapSize = defaultMapSize, extentSizeInMeters = defaultExtentSizeInMeters }: { extentSizeInMeters?: Array<number>, mapSize?: Array<number>, disabled?: boolean, bbox?: ExtentType, onBboxChange?: (extent?: ExtentType) => void, longitude: number, latitude: number }) {
	const mapRef = useRef<any>(null);
	const layer = bbox ? new GeoJsonLayer({
		id: ExtentLayerID, data: getGeoJsonFromBbox(bbox), getLineColor: [0, 0, 0],
		getLineWidth: 5,
		lineWidthUnits: "pixels",
		filled: false,
	}) : new ExtentLayer({ id: ExtentLayerID, extentSize: extentSizeInMeters });

	const tileLayer = new TileLayer({
		id: 'TileLayer',
		data: 'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
		maxZoom: 19,
		minZoom: 0,

		renderSubLayers: (props: any) => {
			const { boundingBox } = props.tile;

			return new BitmapLayer(props, {
				data: undefined,
				image: props.data,
				bounds: [boundingBox[0][0], boundingBox[0][1], boundingBox[1][0], boundingBox[1][1]]
			});
		},
		pickable: true
	});


	let fitView;
	if (bbox) {
		const bboxView = { longitude: (bbox[0] + bbox[2]) / 2, latitude: (bbox[1] + bbox[3]) / 2 }

		const viewport = new WebMercatorViewport(bboxView);
		fitView = viewport.fitBounds([[bbox[0], bbox[1]], [bbox[2], bbox[3]]], {
			width: mapSize[0],
			height: mapSize[1],
			padding: 20
		})
	} else {
		fitView = {
			longitude: longitude || 15,
			latitude: latitude || 50,
			zoom: 10 //default zoom
		}
	}

	const [mapView, setMapView] = useState(fitView)

	const onViewStateChange = ({ viewState }: { viewState: any }) => {
		setMapView({ latitude: viewState.latitude, longitude: viewState.longitude, zoom: !Number.isNaN(viewState.zoom) ? viewState.zoom : 10 })

		// set extent layer
		const deckHeight = mapRef?.current?.deck?.height
		const deckWidth = mapRef?.current?.deck?.width
		const view = mapRef?.current?.deck.viewManager.views?.[0]
		const viewport = view.makeViewport({ width: deckWidth, height: deckHeight, viewState });

		const topRight = viewport.addMetersToLngLat([viewState.longitude, viewState.latitude], [extentSizeInMeters[0] / 2, extentSizeInMeters[1] / 2])
		const bottomLeft = viewport.addMetersToLngLat([viewState.longitude, viewState.latitude], [-extentSizeInMeters[0] / 2, -extentSizeInMeters[1] / 2])
		if (onBboxChange) {
			onBboxChange([...bottomLeft, ...topRight])
		}

	}

	return <div style={{ width: `${mapSize[0]}px`, height: `${mapSize[1]}px`, position: 'relative' }}>
		<DeckGL
			ref={mapRef}
			initialViewState={mapView}
			layers={[tileLayer, layer]}
			onViewStateChange={onViewStateChange}
			controller={disabled ? false : true}
		/>

	</div>

}