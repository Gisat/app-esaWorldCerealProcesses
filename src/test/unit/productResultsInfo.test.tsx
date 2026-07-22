import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import ProductResultsInfo from '@features/(processes)/_components/ProcessesTable/ProductResultsInfo';
import { customProductsProductTypes } from '@features/(processes)/_constants/app';

const renderWithMantine = (ui: React.ReactElement) => {
	return render(<MantineProvider>{ui}</MantineProvider>);
};

describe('ProductResultsInfo', () => {
	/** Returns the rendered text content of the root container. */
	const getRenderedText = () => screen.getByRole('list', { hidden: true }).textContent ?? '';

	describe('Cropland Extent', () => {
		it('renders the three cropland bands', () => {
			renderWithMantine(<ProductResultsInfo oeoProcessId={customProductsProductTypes.cropExtent} />);
			const text = getRenderedText();
			expect(text).toMatch(/cropland_classification/);
			expect(text).toMatch(/probability_cropland/);
			expect(text).toMatch(/probability_other/);
		});

		it('does not mention croptype bands', () => {
			renderWithMantine(<ProductResultsInfo oeoProcessId={customProductsProductTypes.cropExtent} />);
			const text = getRenderedText();
			expect(text).not.toMatch(/croptype_classification/);
			expect(text).not.toMatch(/croptype_probability/);
		});

		it('ignores enableCroplandHead and maskCropland (not relevant for crop extent)', () => {
			renderWithMantine(
				<ProductResultsInfo
					oeoProcessId={customProductsProductTypes.cropExtent}
					enableCroplandHead={false}
					maskCropland={false}
				/>
			);
			const text = getRenderedText();
			expect(text).toMatch(/cropland_classification/);
			expect(text).not.toMatch(/NoCrop/);
		});
	});

	describe('Crop Type, Cropland Head disabled', () => {
		it('renders only croptype bands with the season_id placeholder', () => {
			renderWithMantine(
				<ProductResultsInfo
					oeoProcessId={customProductsProductTypes.cropType}
					enableCroplandHead={false}
				/>
			);
			const text = getRenderedText();
			expect(text).toMatch(/croptype_classification:<season_id>/);
			expect(text).toMatch(/croptype_probability:<season_id>/);
			expect(text).toMatch(/croptype_probability:<season_id>:<class_name>/);
		});

		it('explicitly states that no cropland bands are included', () => {
			renderWithMantine(
				<ProductResultsInfo
					oeoProcessId={customProductsProductTypes.cropType}
					enableCroplandHead={false}
				/>
			);
			expect(screen.getByText(/No cropland classification or cropland probability bands/)).toBeInTheDocument();
		});

		it('does not mention cropland bands', () => {
			renderWithMantine(
				<ProductResultsInfo
					oeoProcessId={customProductsProductTypes.cropType}
					enableCroplandHead={false}
				/>
			);
			const text = getRenderedText();
			expect(text).not.toMatch(/cropland_classification/);
			expect(text).not.toMatch(/probability_cropland/);
		});
	});

	describe('Crop Type, Cropland Head enabled, Cropland masking disabled', () => {
		it('renders both cropland and croptype bands', () => {
			renderWithMantine(
				<ProductResultsInfo
					oeoProcessId={customProductsProductTypes.cropType}
					enableCroplandHead={true}
					maskCropland={false}
				/>
			);
			const text = getRenderedText();
			expect(text).toMatch(/cropland_classification/);
			expect(text).toMatch(/probability_cropland/);
			expect(text).toMatch(/probability_other/);
			expect(text).toMatch(/croptype_classification:<season_id>/);
			expect(text).toMatch(/croptype_probability:<season_id>/);
		});

		it('does not include the NoCrop masking note', () => {
			renderWithMantine(
				<ProductResultsInfo
					oeoProcessId={customProductsProductTypes.cropType}
					enableCroplandHead={true}
					maskCropland={false}
				/>
			);
			const text = getRenderedText();
			expect(text).not.toMatch(/NoCrop/);
		});

		it('mentions that predictions cover all pixels regardless of cropland', () => {
			renderWithMantine(
				<ProductResultsInfo
					oeoProcessId={customProductsProductTypes.cropType}
					enableCroplandHead={true}
					maskCropland={false}
				/>
			);
			expect(screen.getByText(/Crop type predictions are generated for all pixels/)).toBeInTheDocument();
		});
	});

	describe('Crop Type, Cropland Head enabled, Cropland masking enabled', () => {
		it('renders both cropland and croptype bands', () => {
			renderWithMantine(
				<ProductResultsInfo
					oeoProcessId={customProductsProductTypes.cropType}
					enableCroplandHead={true}
					maskCropland={true}
				/>
			);
			const text = getRenderedText();
			expect(text).toMatch(/cropland_classification/);
			expect(text).toMatch(/croptype_classification:<season_id>/);
		});

		it('mentions that crop type predictions are masked using the cropland extent', () => {
			renderWithMantine(
				<ProductResultsInfo
					oeoProcessId={customProductsProductTypes.cropType}
					enableCroplandHead={true}
					maskCropland={true}
				/>
			);
			expect(screen.getByText(/Crop type predictions are masked using the predicted cropland extent/)).toBeInTheDocument();
		});

		it('includes the NoCrop (254) value note on the croptype classification band', () => {
			renderWithMantine(
				<ProductResultsInfo
					oeoProcessId={customProductsProductTypes.cropType}
					enableCroplandHead={true}
					maskCropland={true}
				/>
			);
			const text = getRenderedText();
			expect(text).toMatch(
				/predicted crop type class for each selected season\. Pixels classified as non-cropland are assigned the NoCrop value \(254\)\./
			);
		});

		it('includes the NoCrop (254) value note on the croptype probability band', () => {
			renderWithMantine(
				<ProductResultsInfo
					oeoProcessId={customProductsProductTypes.cropType}
					enableCroplandHead={true}
					maskCropland={true}
				/>
			);
			const text = getRenderedText();
			expect(text).toMatch(
				/confidence \(0–100\) of the predicted crop type for each selected season\. Pixels classified as non-cropland are assigned the NoCrop value \(254\)\./
			);
		});
	});

	describe('Defaults', () => {
		it('treats missing enableCroplandHead as enabled (matches searchParams default)', () => {
			renderWithMantine(
				<ProductResultsInfo oeoProcessId={customProductsProductTypes.cropType} maskCropland={false} />
			);
			const text = getRenderedText();
			expect(text).toMatch(/cropland_classification/);
		});

		it('treats missing maskCropland as enabled (matches searchParams default)', () => {
			renderWithMantine(
				<ProductResultsInfo
					oeoProcessId={customProductsProductTypes.cropType}
					enableCroplandHead={true}
				/>
			);
			const text = getRenderedText();
			// Both croptype classification and probability bands mention NoCrop (254)
			const matches = text.match(/NoCrop value \(254\)/g) ?? [];
			expect(matches.length).toBe(2);
		});
	});

	describe('Fallback', () => {
		it('renders the generic band list when oeoProcessId is unknown', () => {
			renderWithMantine(<ProductResultsInfo oeoProcessId="some_unknown_process" />);
			expect(screen.getByText(/Each raster contains at least three bands/)).toBeInTheDocument();
			expect(screen.getByText(/Band 1: classification/)).toBeInTheDocument();
		});

		it('renders the generic band list when oeoProcessId is undefined', () => {
			renderWithMantine(<ProductResultsInfo />);
			expect(screen.getByText(/Each raster contains at least three bands/)).toBeInTheDocument();
		});
	});
});
