import formParams from './formParams';

export const downloadOfficialProductsDefaults = {
	collection: formParams.collection.options.find((o) => o.default)?.value as string | undefined,
	outputFileFormat: formParams.outputFileFormat.options.find((o) => o.default)?.value as 'GTiff' | 'NETCDF' | undefined,
};