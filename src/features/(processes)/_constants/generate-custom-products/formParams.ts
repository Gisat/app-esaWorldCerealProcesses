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
	cropTypeModelType: {
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
	postprocessMethodCropland: {
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
				label: 'Cropland extent',
				namespace: 'https://raw.githubusercontent.com/WorldCereal/worldcereal-classification/refs/heads/main/scripts/udp/worldcereal_crop_extent.json',
			},
			{
				value: customProductsProductTypes.cropType,
				label: 'Crop type',
				namespace: 'https://raw.githubusercontent.com/WorldCereal/worldcereal-classification/refs/heads/main/scripts/udp/worldcereal_crop_type.json',
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
	cropTypeModelType: {
		required: true,
		options: [
			{
				value: 'default',
				label: 'Default',
				default: true,
			},
			{
				value: 'custom',
				label: 'Custom',
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
			},
			{
				value: customProductsPostprocessMethods.majorityVote,
				label: 'Majority vote',
				default: true,
			},
		],
	},
	postprocessMethodCropland: {
		required: false,
		options: [
			{
				value: customProductsPostprocessMethods.smoothProbabilities,
				label: 'Smooth probabilities',
			},
			{
				value: customProductsPostprocessMethods.majorityVote,
				label: 'Majority vote',
				default: true,
			},
		],
	},
};

export default formParams;
