import { SUPPORTED_OUTPUT_FORMAT } from '@features/(processes)/_constants/defaults';
import {
	fromCollectionParamsSchema,
	fromProcessParamsSchema,
} from '@features/(processes)/_constants/validation';

describe('output format configuration', () => {
	it('uses GeoTIFF as the backend-supported output format', () => {
		expect(SUPPORTED_OUTPUT_FORMAT).toBe('GTiff');
	});

	it('removes client-supplied format from collection job parameters', () => {
		const result = fromCollectionParamsSchema.safeParse({
			collection: '2021',
			product: 'ESA_WORLDCEREAL_ACTIVECROPLAND',
			bbox: '3,48,4,49',
			format: 'NETCDF',
		});

		expect(result.success).toBe(true);
		if (!result.success) throw result.error;
		expect(result.data).not.toHaveProperty('format');
	});

	it('removes client-supplied format from process job parameters', () => {
		const result = fromProcessParamsSchema.safeParse({
			processId: 'worldcereal_crop_extent',
			bbox: '3,48,4,49',
			endDate: '2025-09-30',
			seasonWindows: JSON.stringify({ 2025: ['2024-10-01', '2025-09-30'] }),
			format: 'NETCDF',
		});

		expect(result.success).toBe(true);
		if (!result.success) throw result.error;
		expect(result.data).not.toHaveProperty('format');
	});
});
