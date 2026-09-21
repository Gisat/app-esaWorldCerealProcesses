/**
 * Creates the registry of all available background (basemap) layers.
 *
 * Carto tile URLs require an API key passed as a query parameter.
 * This function must be called with the key from a server component;
 * do NOT read process.env in client code.
 *
 * @param {string} [cartoApiKey] - Carto basemap API key. When omitted, Carto tiles are requested without authentication (rate-limited).
 * @returns {Record<string, { key: string, name: string, url: string }>} Background layer registry.
 */
export const getBackgroundLayers = (cartoApiKey) => {
	const cartoKey = cartoApiKey ? `?key=${cartoApiKey}` : '';

	return {
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
			url: `https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png${cartoKey}`,
		},
		openStreetMap_Mapnik: {
			key: 'openStreetMap_Mapnik',
			name: 'OpenStreetMap',
			url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
		},
	};
};

/**
 * Static background layer metadata (no tile URLs).
 *
 * Safe for client components that only need names, thumbnails or keys.
 * For map rendering with the Carto API key, use {@link getBackgroundLayers} instead.
 */
export const backgroundLayers = getBackgroundLayers();

export function resolveBackgroundLayer(customProperties) {
	const value = customProperties?.background_layer;
	return typeof value === 'string' && value in backgroundLayers ? value : undefined;
}
