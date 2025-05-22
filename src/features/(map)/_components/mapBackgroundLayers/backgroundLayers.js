export const backgroundLayers = {
	esri_WorldTopoMap: {
		key: 'esri_WorldTopoMap',
		name: 'ESRI Topomap',
		url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
	},
	esri_WorldImagery: {
		key: 'esri_WorldImagery',
		name: 'ESRI Imagery',
		url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',

	},
	esri_WorldGrayCanvas: {
		key: 'esri_WorldGrayCanvas',
		name: 'ESRI Grey Canvas',
		url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',

	},
	cartoVoyager: {
		key: 'cartoVoyager',
		name: 'Carto DB Voyager',
		url: 'https://basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png',

	},
	openStreetMap_Mapnik: {
		key: 'openStreetMap_Mapnik',
		name: 'OpenStreetMap',
		url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
	},
};
