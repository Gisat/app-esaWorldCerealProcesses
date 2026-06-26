import formParams from './formParams';

export const generateCustomProductsDefaults = {
	cropTypeModelType: formParams.cropTypeModelType.options.find((o) => o.default)?.value as 'default' | 'custom' | undefined,
	format: formParams.format.options.find((o) => o.default)?.value as 'GTiff' | 'NETCDF' | undefined,
	endDate: formParams.endDate.options.find((o) => o.default)?.value as string | undefined,
	orbitState: formParams.orbitState.options.find((o) => o.default)?.value as 'ASCENDING' | 'DESCENDING' | undefined,
	postprocessMethodCroptype: formParams.postprocessMethodCroptype.options.find((o) => o.default)?.value as
		| 'smooth_probabilities'
		| 'majority_vote'
		| undefined,
	postprocessMethodCropland: formParams.postprocessMethodCropland.options.find((o) => o.default)?.value as
		| 'smooth_probabilities'
		| 'majority_vote'
		| undefined,
};
