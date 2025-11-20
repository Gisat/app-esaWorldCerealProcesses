import {
	customProductsDateLimits,
	customProductsPostprocessMethods,
	customProductsProductTypes,
} from '@features/(processes)/_constants/app';

const formParams: {
	product: {
		required?: boolean;
		options: {
			label: string;
			value: string;
			namespace?: string;
			default?: boolean;
			disabled?: boolean;
		}[];
	};
	model: {
		required?: boolean;
		options: {
			label: string;
			value: string;
			default?: boolean;
		}[];
	};
	endDate: {
		required?: boolean;
		options: {
			value: string;
			default?: boolean;
		}[];
	};
	outputFileFormat: {
		required?: boolean;
		options: {
			label: string;
			value: string;
			default?: boolean;
		}[];
	};
	orbitState: {
		required?: boolean;
		options: {
			label: string;
			value: string;
			default?: boolean;
		}[];
	};
	postprocessMethod: {
		required?: boolean;
		options: {
			label: string;
			value: string;
			default?: boolean;
		}[];
	};
} = {
	product: {
		required: true,
		options: [
			{
				value: customProductsProductTypes.cropExtent,
				label: 'Cropland',
				namespace:
					'https://raw.githubusercontent.com/WorldCereal/worldcereal-classification/refs/heads/update-croptype-udp/src/worldcereal/udp/worldcereal_crop_extent.json'
			},
			{
				value: customProductsProductTypes.cropType,
				label: 'Crop type',
				namespace:
					'https://raw.githubusercontent.com/WorldCereal/worldcereal-classification/refs/heads/update-croptype-udp/src/worldcereal/udp/worldcereal_crop_type.json'
			},
			{
				value: customProductsProductTypes.activeCropland,
				label: 'Active cropland',
				disabled: true,
			},
		],
	},
	model: {
		required: true,
		options: [
			{
				value: 'default',
				label: 'Default',
				default: true,
			},
		],
	},
	endDate: {
		required: true,
		options: [
			{
				value: customProductsDateLimits.max,
				default: true,
			},
		],
	},
	outputFileFormat: {
		required: true,
		options: [
			{
				value: 'GTiff',
				label: 'GeoTIFF',
				default: true,
			},
			{
				label: 'NetCDF',
				value: 'NETCDF',
			},
		],
	},
	orbitState: {
		required: false,
		options: [
			{
				value: 'ASCENDING',
				label: 'Ascending',
			},
			{
				value: 'DESCENDING',
				label: 'Descending',
				default: true,
			},
		],
	},
	postprocessMethod: {
		required: false,
		options: [
			{
				value: customProductsPostprocessMethods.smoothProbabilities,
				label: 'Smooth probabilities',
				default: true,
			},
			{
				value: customProductsPostprocessMethods.majorityVote,
				label: 'Majority vote',
			},
		],
	},
};

export default formParams;
