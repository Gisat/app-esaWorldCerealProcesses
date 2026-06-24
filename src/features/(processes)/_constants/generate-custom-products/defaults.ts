import formParams from './formParams';

export const generateCustomProductsDefaults = {
	model: formParams.model.options.find((o) => o.default)?.value as string | undefined,
	outputFileFormat: formParams.outputFileFormat.options.find((o) => o.default)?.value as 'GTiff' | 'NETCDF' | undefined,
	endDate: formParams.endDate.options.find((o) => o.default)?.value as string | undefined,
	orbitState: formParams.orbitState.options.find((o) => o.default)?.value as 'ASCENDING' | 'DESCENDING' | undefined,
	postprocessMethod: formParams.postprocessMethod.options.find((o) => o.default)?.value as
		| 'smooth_probabilities'
		| 'majority_vote'
		| undefined,
};
