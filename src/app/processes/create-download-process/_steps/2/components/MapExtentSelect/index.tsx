import DeckGL from '@deck.gl/react';
import { GeoJsonLayer, BitmapLayer } from '@deck.gl/layers';
import { TileLayer } from '@deck.gl/geo-layers';
import { useRef, useState } from 'react';
import ExtentLayer from '@/components/map/layers/ExtentLayer';

const ExtentLayerID = "ExtentLayer";
const mapSize = [500, 500]
const extentSizeInMeters = [500, 500];
export default function ({ onExtentChange }: { onExtentChange: (extent?: Array<number>) => void }) {
	const mapRef = useRef(null);
	const layer = new ExtentLayer({ id: ExtentLayerID, extentSize: extentSizeInMeters });

	const tileLayer = new TileLayer({
		id: 'TileLayer',
		data: 'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
		maxZoom: 19,
		minZoom: 0,

		renderSubLayers: (props: any) => {
			const { boundingBox } = props.tile;

			return new BitmapLayer(props, {
				data: null,
				image: props.data,
				bounds: [boundingBox[0][0], boundingBox[0][1], boundingBox[1][0], boundingBox[1][1]]
			});
		},
		pickable: true
	});

	const [mapView, setMapView] = useState({
		longitude: 15, latitude: 50, zoom: 10
	})

	const onViewStateChange = ({ viewState }: { viewState: any }) => {
		setMapView({ latitude: viewState.latitude, longitude: viewState.longitude, zoom: viewState.zoom })

		// set extent layer
		const deckHeight = mapRef?.current?.deck?.height
		const deckWidth = mapRef?.current?.deck?.width
		const view = mapRef?.current?.deck.viewManager.views?.[0]
		const viewport = view.makeViewport({ width: deckWidth, height: deckHeight, viewState });

		const layers = mapRef?.current?.deck?.layerManager.layers
		const topLeft = viewport.addMetersToLngLat([viewState.longitude, viewState.latitude], [-extentSizeInMeters[0] / 2, extentSizeInMeters[1] / 2])
		const topRight = viewport.addMetersToLngLat([viewState.longitude, viewState.latitude], [extentSizeInMeters[0] / 2, extentSizeInMeters[1] / 2])
		const bottomRight = viewport.addMetersToLngLat([viewState.longitude, viewState.latitude], [extentSizeInMeters[0] / 2, -extentSizeInMeters[1] / 2])
		const bottomLeft = viewport.addMetersToLngLat([viewState.longitude, viewState.latitude], [-extentSizeInMeters[0] / 2, -extentSizeInMeters[1] / 2])
		onExtentChange([topLeft, topRight, bottomRight, bottomLeft])

	}

	return <div style={{ width: `${mapSize[0]}px`, height: `${mapSize[1]}px`, position: 'relative' }}>
		<DeckGL
			ref={mapRef}
			onClick={() => console.log('click')}
			initialViewState={mapView}
			layers={[tileLayer, layer]}
			onViewStateChange={onViewStateChange}
			controller={true}
		/>

	</div>

}