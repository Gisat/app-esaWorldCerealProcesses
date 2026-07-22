import { List, Stack, Text } from '@mantine/core';
import { customProductsProductTypes } from '@features/(processes)/_constants/app';

import './style.css';

type ProductResultsInfoProps = {
	oeoProcessId?: string;
	enableCroplandHead?: boolean;
	maskCropland?: boolean;
};

const ProductResultsInfo = ({ oeoProcessId, enableCroplandHead, maskCropland }: ProductResultsInfoProps) => {
	const isCropType = oeoProcessId === customProductsProductTypes.cropType;
	const isCropExtent = oeoProcessId === customProductsProductTypes.cropExtent;
	const croplandHeadEnabled = isCropType && (enableCroplandHead ?? true);
	const croplandMaskingEnabled = croplandHeadEnabled && (maskCropland ?? true);

	const renderCroplandExtent = () => (
		<>
			<Text fw={500} mt="sm" mb={4} c="var(--textPrimaryColor)">
				A 10 m crop extent product that identifies cropland and non-cropland pixels for the selected period.
				The output contains the following bands:
			</Text>
			<List type="unordered" spacing="xs" withPadding>
				<List.Item>
					<b>cropland_classification</b> &ndash; binary cropland classification (0 = other, 1 = cropland).
				</List.Item>
				<List.Item>
					<b>probability_cropland</b> &ndash; probability (0&ndash;100) that a pixel is cropland.
				</List.Item>
				<List.Item>
					<b>probability_other</b> &ndash; probability (0&ndash;100) that a pixel is non-cropland.
				</List.Item>
			</List>
		</>
	);

	const renderCropTypeNoCroplandHead = () => (
		<>
			<Text fw={500} mt="sm" mb={4} c="var(--textPrimaryColor)">
				A 10 m crop type product that assigns a crop class to every pixel for each selected season. Because
				cropland detection is disabled, crop type predictions are generated across the full area.
			</Text>
			<Text fw={500} mt="sm" mb={4} c="var(--textPrimaryColor)">
				The output contains the following bands for each selected season:
			</Text>
			<List type="unordered" spacing="xs" withPadding>
				<List.Item>
					<b>croptype_classification:&lt;season_id&gt;</b> &ndash; predicted crop type class.
				</List.Item>
				<List.Item>
					<b>croptype_probability:&lt;season_id&gt;</b> &ndash; confidence of the predicted crop type (0&ndash;100).
				</List.Item>
				<List.Item>
					<b>croptype_probability:&lt;season_id&gt;:&lt;class_name&gt;</b> &ndash; probability (0&ndash;100) for each
					individual crop type class.
				</List.Item>
			</List>
			<Text fw={500} mt="sm" mb={4} c="var(--textPrimaryColor)">
				No cropland classification or cropland probability bands are included in this product.
			</Text>
		</>
	);

	const renderCropTypeWithCroplandHead = () => {
		const maskingNote = croplandMaskingEnabled
			? 'Crop type predictions are masked using the predicted cropland extent, so pixels classified as non-cropland are assigned the NoCrop class.'
			: 'Crop type predictions are generated for all pixels, regardless of the predicted cropland extent.';
		const croptypeClassificationNote = croplandMaskingEnabled
			? ' – predicted crop type class for each selected season. Pixels classified as non-cropland are assigned the NoCrop value (254).'
			: ' – predicted crop type class for each selected season.';
		const croptypeProbabilityNote = croplandMaskingEnabled
			? ' – confidence (0–100) of the predicted crop type for each selected season. Pixels classified as non-cropland are assigned the NoCrop value (254).'
			: ' – confidence (0–100) of the predicted crop type for each selected season.';

		return (
			<>
				<Text fw={500} mt="sm" mb={4} c="var(--textPrimaryColor)">
					A 10 m crop type product that predicts both cropland extent and crop type for each selected season.{' '}
					{maskingNote}
				</Text>
				<Text fw={500} mt="sm" mb={4} c="var(--textPrimaryColor)">
					The output contains the following bands:
				</Text>
				<List type="unordered" spacing="xs" withPadding>
					<List.Item>
						<b>cropland_classification</b> &ndash; binary cropland classification (0 = other, 1 = cropland).
					</List.Item>
					<List.Item>
						<b>probability_cropland</b> &ndash; probability (0&ndash;100) that a pixel is cropland.
					</List.Item>
					<List.Item>
						<b>probability_other</b> &ndash; probability (0&ndash;100) that a pixel is non-cropland.
					</List.Item>
					<List.Item>
						<b>croptype_classification:&lt;season_id&gt;</b>
						{croptypeClassificationNote}
					</List.Item>
					<List.Item>
						<b>croptype_probability:&lt;season_id&gt;</b>
						{croptypeProbabilityNote}
					</List.Item>
					<List.Item>
						<b>croptype_probability:&lt;season_id&gt;:&lt;class_name&gt;</b> &ndash; probability (0&ndash;100) for each
						individual crop type class and selected season.
					</List.Item>
				</List>
			</>
		);
	};

	const renderFallback = () => (
		<>
			<Text fw={500} mt="sm" mb={4} c="var(--textPrimaryColor)">
				Each raster contains at least three bands:
			</Text>
			<List type="unordered" spacing="xs" withPadding>
				<List.Item>Band 1: classification &ndash; The classification label of the pixel.</List.Item>
				<List.Item>Band 2: confidence &ndash; The class-specific probability of the winning class.</List.Item>
				<List.Item>
					Band 3 and beyond: probability_xxx &ndash; Class-specific probabilities. The &quot;xxx&quot; indicates the
					associated class.
				</List.Item>
			</List>
		</>
	);

	const renderBody = () => {
		if (isCropExtent) return renderCroplandExtent();
		if (isCropType && !croplandHeadEnabled) return renderCropTypeNoCroplandHead();
		if (isCropType && croplandHeadEnabled) return renderCropTypeWithCroplandHead();
		return renderFallback();
	};

	return (
		<Stack gap="sm" className="worldCereal-ProductResultsInfo">
			{renderBody()}
		</Stack>
	);
};

export default ProductResultsInfo;
