import {
	fromProcessParamsSchema,
	generateStep1Schema,
} from '@features/(processes)/_constants/validation';

const ZIP_URL_ERROR =
	'URL not valid (must be a valid http(s) URL whose path or a query parameter points to a .zip file)';

// Shape taken from WorldCereal/worldcereal-vdm#51, with placeholder values instead of a real
// credential. The trailing `?...` signature is exactly what the old `.zip$` regex rejected.
const PRE_SIGNED_MODEL_URL =
	'https://s3.waw3-1.openeo.v1.dataspace.copernicus.eu/openeo-artifacts-waw3-1/' +
	'0366620fe9858b41058be20a521ef4e209a0e733/2026/09/16/' +
	'PrestoDownstreamTorchHead_linear_croptype_march.zip' +
	'?AWSAccessKeyId=EXAMPLEACCESSKEYID&Signature=EXAMPLESIGNATURE%3D&' +
	'x-amz-security-token=EXAMPLESECURITYTOKEN&Expires=1790066566';

const baseStep1Params = {
	processId: 'worldcereal_crop_type',
	cropTypeModelType: 'custom',
	seasonalModelZip: '',
	enableCroplandHead: true,
	landcoverHeadZip: '',
	croptypeHeadZip: '',
};

const baseProcessParams = {
	processId: 'worldcereal_crop_type',
	bbox: '3,48,4,49',
	endDate: '2025-09-30',
	seasonWindows: JSON.stringify({ 2025: ['2024-10-01', '2025-09-30'] }),
};

describe('generateStep1Schema model URL validation', () => {
	it('accepts a plain .zip URL', () => {
		const result = generateStep1Schema.safeParse({
			...baseStep1Params,
			seasonalModelZip: 'https://example.com/model.zip',
		});

		expect(result.success).toBe(true);
	});

	it('accepts a pre-signed .zip URL with signature query parameters', () => {
		const result = generateStep1Schema.safeParse({
			...baseStep1Params,
			seasonalModelZip: PRE_SIGNED_MODEL_URL,
		});

		expect(result.success).toBe(true);
	});

	it('accepts pre-signed URLs on all three model fields', () => {
		const result = generateStep1Schema.safeParse({
			...baseStep1Params,
			seasonalModelZip: PRE_SIGNED_MODEL_URL,
			landcoverHeadZip: PRE_SIGNED_MODEL_URL,
			croptypeHeadZip: PRE_SIGNED_MODEL_URL,
		});

		expect(result.success).toBe(true);
	});

	it('accepts an uppercase .ZIP path alongside a query string', () => {
		const result = generateStep1Schema.safeParse({
			...baseStep1Params,
			seasonalModelZip: 'https://example.com/MODEL.ZIP?sig=1',
		});

		expect(result.success).toBe(true);
	});

	it('still accepts an empty string, preserving the default-model semantics', () => {
		const result = generateStep1Schema.safeParse(baseStep1Params);

		expect(result.success).toBe(true);
	});

	it('rejects a path that does not end in .zip', () => {
		const result = generateStep1Schema.safeParse({
			...baseStep1Params,
			seasonalModelZip: 'https://example.com/model.tar.gz',
		});

		expect(result.success).toBe(false);
		if (result.success) throw new Error('expected seasonalModelZip to be rejected');
		expect(result.error.flatten().fieldErrors.seasonalModelZip).toEqual([ZIP_URL_ERROR]);
	});

	it('rejects a non-http(s) scheme', () => {
		const result = generateStep1Schema.safeParse({
			...baseStep1Params,
			seasonalModelZip: 'ftp://example.com/model.zip',
		});

		expect(result.success).toBe(false);
		if (result.success) throw new Error('expected seasonalModelZip to be rejected');
		expect(result.error.flatten().fieldErrors.seasonalModelZip).toEqual([ZIP_URL_ERROR]);
	});

	it('rejects a bare string that is not a URL', () => {
		const result = generateStep1Schema.safeParse({
			...baseStep1Params,
			seasonalModelZip: 'model.zip',
		});

		expect(result.success).toBe(false);
		if (result.success) throw new Error('expected seasonalModelZip to be rejected');
		expect(result.error.flatten().fieldErrors.seasonalModelZip).toEqual([ZIP_URL_ERROR]);
	});

	it('accepts a download endpoint that names the .zip in a query parameter', () => {
		const result = generateStep1Schema.safeParse({
			...baseStep1Params,
			seasonalModelZip: 'https://eodata.dataspace.copernicus.eu/artifacts/download?file=model.zip',
		});

		expect(result.success).toBe(true);
	});

	it('accepts a download endpoint whose query parameter is not the last segment', () => {
		const result = generateStep1Schema.safeParse({
			...baseStep1Params,
			seasonalModelZip: 'https://example.com/download?file=model.zip&response=attachment',
		});

		expect(result.success).toBe(true);
	});

	it('rejects a URL that names no .zip in either the path or the query', () => {
		const result = generateStep1Schema.safeParse({
			...baseStep1Params,
			seasonalModelZip: 'https://example.com/artifacts/abc123?token=sig',
		});

		expect(result.success).toBe(false);
		if (result.success) throw new Error('expected seasonalModelZip to be rejected');
		expect(result.error.flatten().fieldErrors.seasonalModelZip).toEqual([ZIP_URL_ERROR]);
	});
});

describe('fromProcessParamsSchema model URL validation', () => {
	it('accepts a pre-signed .zip URL', () => {
		const result = fromProcessParamsSchema.safeParse({
			...baseProcessParams,
			seasonalModelZip: PRE_SIGNED_MODEL_URL,
		});

		expect(result.success).toBe(true);
		if (!result.success) throw result.error;
		expect(result.data.seasonalModelZip).toBe(PRE_SIGNED_MODEL_URL);
	});

	it('accepts a download endpoint that names the .zip in a query parameter', () => {
		const downloadUrl = 'https://eodata.dataspace.copernicus.eu/artifacts/download?file=model.zip';

		const result = fromProcessParamsSchema.safeParse({
			...baseProcessParams,
			seasonalModelZip: downloadUrl,
		});

		expect(result.success).toBe(true);
		if (!result.success) throw result.error;
		expect(result.data.seasonalModelZip).toBe(downloadUrl);
	});

	it('rejects a path that does not end in .zip', () => {
		const result = fromProcessParamsSchema.safeParse({
			...baseProcessParams,
			seasonalModelZip: 'https://example.com/model.tar.gz',
		});

		expect(result.success).toBe(false);
		if (result.success) throw new Error('expected seasonalModelZip to be rejected');
		expect(result.error.flatten().fieldErrors.seasonalModelZip).toEqual([ZIP_URL_ERROR]);
	});
});
