import { customProductsDateLimits } from '@features/(processes)/_constants/app';
import { min } from 'lodash';

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
				value: 'worldcereal_crop_extent',
				label: 'Cropland',
				namespace:
					'https://raw.githubusercontent.com/WorldCereal/worldcereal-classification/refs/tags/worldcereal_crop_extent_v1.0.2/src/worldcereal/udp/worldcereal_crop_extent.json',
			},
			{
				value: 'worldcereal_crop_type',
				label: 'Crop type',
				namespace:
					'https://raw.githubusercontent.com/WorldCereal/worldcereal-classification/dc0173996e7a98308c77a81f161e3b75a8d32e23/src/worldcereal/udp/worldcereal_crop_type.json',
			},
			{
				value: 'worldcereal_active_cropland',
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
				value: 'smooth_probabilities',
				label: 'Smooth probabilities',
				default: true,
			},
			{
				value: 'majority_vote',
				label: 'Majority vote',
			},
		],
	},
};

export default formParams;
