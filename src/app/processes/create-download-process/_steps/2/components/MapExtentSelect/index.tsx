import DeckGL from '@deck.gl/react';
import { GeoJsonLayer, BitmapLayer } from '@deck.gl/layers';
import { TileLayer } from '@deck.gl/geo-layers';


export default function () {
	const layer = new GeoJsonLayer({
		id: 'GeoJsonLayer',
		data: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart.geo.json',

		stroked: false,
		filled: true,
		pointType: 'circle+text',
		pickable: true,

		getFillColor: [160, 160, 180, 200],
		getLineColor: (f: any) => {
			const hex = f.properties.color;
			// convert to RGB
			return hex ? hex.match(/[0-9a-f]{2}/g).map((x: any) => parseInt(x, 16)) : [0, 0, 0];
		},
		getLineWidth: 20,
		getPointRadius: 4,
		getText: (f: any) => f.properties.name,
		getTextSize: 12
	});

	const tileLayer = new TileLayer({
		id: 'TileLayer',
		data: 'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
		maxZoom: 19,
		minZoom: 0,

		renderSubLayers: (props: any) => {
			const { boundingBox } = props.tile;

			return new BitmapLayer(props, {
				// data: null,
				image: props.data,
				bounds: [boundingBox[0][0], boundingBox[0][1], boundingBox[1][0], boundingBox[1][1]]
			});
		},
		pickable: true
	});

	const onViewStateChange = (viewState: any) => {
		console.log('onViewStateChange', viewState)
	}

	return <div style={{ width: '500px', height: '500px', position: 'relative' }}>
		<DeckGL
			viewState={{ longitude: 15, latitude: 50, zoom: 10 }}
			layers={[tileLayer, layer]}
			onViewStateChange={onViewStateChange}
		/>

	</div>

}