'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { IconArrowRight } from '@tabler/icons-react';
import { Button, Checkbox, Group, Input, Select, Space, Stack, TextInput } from '@mantine/core';
import { useSharedState } from '@gisatcz/ptr-fe-core/client';
import TwoColumns, { Column } from '@features/(shared)/_layout/_components/Content/TwoColumns';
import formParams from '@features/(processes)/_constants/generate-custom-products/formParams';
import { WorldCerealState } from '@features/state/state.models';
import { OneOfWorldCerealActions } from '@features/state/state.actions';
import { WorldCerealStateActionType } from '@features/state/state.actionTypes';
import { getProduct_customProducts } from '@features/state/selectors/createCustomProducts/getProduct';
import { getCropTypeModelType_customProducts } from '@features/state/selectors/createCustomProducts/getCropTypeModelType';
import { getSeasonalModelZip_customProducts } from '@features/state/selectors/createCustomProducts/getSeasonalModelZip';
import { getEnableCroplandHead_customProducts } from '@features/state/selectors/createCustomProducts/getEnableCroplandHead';
import { getLandcoverHeadZip_customProducts } from '@features/state/selectors/createCustomProducts/getLandcoverHeadZip';
import { getCroptypeHeadZip_customProducts } from '@features/state/selectors/createCustomProducts/getCroptypeHeadZip';
import { customProductsProductTypes } from '@features/(processes)/_constants/app';
import './CreateProductsStep1Client.css';

const zipUrlRegex = /^https?:\/\/.+\.zip$/i;

/**
 * React component for the first step of creating custom products.
 *
 * This component allows users to select a product and model, and proceed to the next step.
 *
 * @returns {JSX.Element} The rendered step 1 UI for creating custom products.
 */
export default function CreateProductsStep1Client() {
	const [state, dispatch] = useSharedState<WorldCerealState, OneOfWorldCerealActions>();

	const product = getProduct_customProducts(state);
	const cropTypeModelType = getCropTypeModelType_customProducts(state);
	const seasonalModelZip = getSeasonalModelZip_customProducts(state);
	const enableCroplandHead = getEnableCroplandHead_customProducts(state);
	const landcoverHeadZip = getLandcoverHeadZip_customProducts(state);
	const croptypeHeadZip = getCroptypeHeadZip_customProducts(state);

	const isCropType = product === customProductsProductTypes.cropType;
	const isCropExtent = product === customProductsProductTypes.cropExtent;
	const isCustomModel = cropTypeModelType === 'custom';

	// Local state for URL inputs (for immediate visual feedback)
	const [localSeasonalModelZip, setLocalSeasonalModelZip] = useState<string>(seasonalModelZip ?? '');
	const [localLandcoverHeadZip, setLocalLandcoverHeadZip] = useState<string>(landcoverHeadZip ?? '');
	const [localCroptypeHeadZip, setLocalCroptypeHeadZip] = useState<string>(croptypeHeadZip ?? '');

	const isSeasonalModelZipValid = localSeasonalModelZip === '' || zipUrlRegex.test(localSeasonalModelZip);
	const isLandcoverHeadZipValid = localLandcoverHeadZip === '' || zipUrlRegex.test(localLandcoverHeadZip);
	const isCroptypeHeadZipValid = localCroptypeHeadZip === '' || zipUrlRegex.test(localCroptypeHeadZip);

	const hasValidationErrors = isCustomModel && (
		!isSeasonalModelZipValid ||
		((isCropType ? (enableCroplandHead ?? true) : true) && !isLandcoverHeadZipValid) ||
		(isCropType && !isCroptypeHeadZipValid)
	);

	const nextStepDisabled = !product || hasValidationErrors;

	const setProduct = (value: string | null) => {
		if (value && value !== product) {
			setLocalSeasonalModelZip('');
			setLocalLandcoverHeadZip('');
			setLocalCroptypeHeadZip('');
			dispatch({
				type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_PRODUCT,
				payload: value,
			});
			dispatch({
				type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_MODEL,
				payload: 'default',
			});
			// Reset model type to 'default' when product changes
			dispatch({
				type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_CROP_TYPE_MODEL_TYPE,
				payload: 'default',
			});
			dispatch({ type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_SEASONAL_MODEL_ZIP, payload: null });
			dispatch({ type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_LANDCOVER_HEAD_ZIP, payload: null });
			dispatch({ type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_CROPTYPE_HEAD_ZIP, payload: null });
		}
	};

	const setCropTypeModelType = (value: string | null) => {
		if (value === 'default' || value === 'custom') {
			dispatch({
				type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_CROP_TYPE_MODEL_TYPE,
				payload: value,
			});
			// When switching to default, clear custom fields and set model to 'default'
			if (value === 'default') {
				dispatch({ type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_MODEL, payload: 'default' });
				dispatch({ type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_SEASONAL_MODEL_ZIP, payload: null });
				dispatch({ type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_LANDCOVER_HEAD_ZIP, payload: null });
				dispatch({ type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_CROPTYPE_HEAD_ZIP, payload: null });
				setLocalSeasonalModelZip('');
				setLocalLandcoverHeadZip('');
				setLocalCroptypeHeadZip('');
			} else {
				// custom — model stays 'default'; actual custom model files passed via seasonalModelZip etc.
				dispatch({ type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_MODEL, payload: 'default' });
			}
		}
	};

	const handleSeasonalModelZipChange = (value: string) => {
		setLocalSeasonalModelZip(value);
		const isValid = value === '' || zipUrlRegex.test(value);
		dispatch({
			type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_SEASONAL_MODEL_ZIP,
			payload: isValid && value !== '' ? value : null,
		});
	};

	const handleLandcoverHeadZipChange = (value: string) => {
		setLocalLandcoverHeadZip(value);
		const isValid = value === '' || zipUrlRegex.test(value);
		dispatch({
			type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_LANDCOVER_HEAD_ZIP,
			payload: isValid && value !== '' ? value : null,
		});
	};

	const handleCroptypeHeadZipChange = (value: string) => {
		setLocalCroptypeHeadZip(value);
		const isValid = value === '' || zipUrlRegex.test(value);
		dispatch({
			type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_CROPTYPE_HEAD_ZIP,
			payload: isValid && value !== '' ? value : null,
		});
	};

	const handleEnableCroplandHeadChange = (checked: boolean) => {
		dispatch({
			type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_ENABLE_CROPLAND_HEAD,
			payload: checked,
		});
		if (!checked) {
			dispatch({ type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_LANDCOVER_HEAD_ZIP, payload: null });
			setLocalLandcoverHeadZip('');
		}
	};

	useEffect(() => {
		dispatch({
			type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_ACTIVE_STEP,
			payload: 1,
		});
	}, []);

	// Initialize model type and enableCroplandHead default
	useEffect(() => {
		if (product && !cropTypeModelType) {
			dispatch({
				type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_CROP_TYPE_MODEL_TYPE,
				payload: 'default',
			});
			dispatch({
				type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_MODEL,
				payload: 'default',
			});
		}
		if (isCropType && enableCroplandHead === undefined) {
			dispatch({
				type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_ENABLE_CROPLAND_HEAD,
				payload: true,
			});
		}
	}, [product, isCropType]);

	return (
		<TwoColumns>
			<Column>
				<div className="step1-container">
				<Select
					withAsterisk
					className="worldCereal-Select"
					size="md"
					allowDeselect={false}
					label="1.1. Select your product"
					placeholder="Pick one"
					data={formParams.product.options}
					value={product}
					onChange={(value) => setProduct(value)}
				/>
				<Space h="md" />

				{product && (
					<Stack gap="md">
						<Select
							withAsterisk
							className="worldCereal-Select"
							size="md"
							allowDeselect={false}
							label="1.2. Select model"
							placeholder="Pick one"
							data={formParams.cropTypeModelType.options}
							value={cropTypeModelType ?? 'default'}
							onChange={(value) => setCropTypeModelType(value)}
						/>

						{isCustomModel && (
							<Stack gap="lg">
								{/* 1.3 Base Model */}
								<Input.Wrapper
									className="worldCereal-Input"
									size="md"
									label="1.3. Base model"
									description="Optional. Provide a publicly accessible URL to a complete WorldCereal model package (.zip). This replaces the default model, including the feature extractor and all prediction heads. If no model is provided, the default WorldCereal model is used."
								>
									<TextInput
										size="md"
										placeholder="https://example.zip"
										error={
											!isSeasonalModelZipValid
												? 'URL not valid (must end with .zip)'
												: null
										}
										value={localSeasonalModelZip}
										onChange={(e) => handleSeasonalModelZipChange(e.currentTarget.value)}
									/>
								</Input.Wrapper>

								{/* Cropland Extent custom fields */}
								{isCropExtent && (
									<Input.Wrapper
										className="worldCereal-Input"
										size="md"
										label="1.4. Cropland Head Override"
										description="Optional. Provide a publicly accessible URL to a custom cropland prediction head (.zip). When provided, it replaces the cropland head of either the default model or the specified base model."
									>
										<TextInput
											size="md"
											placeholder="https://example.zip"
											error={
												!isLandcoverHeadZipValid
													? 'URL not valid (must end with .zip)'
													: null
											}
											value={localLandcoverHeadZip}
											onChange={(e) => handleLandcoverHeadZipChange(e.currentTarget.value)}
										/>
									</Input.Wrapper>
								)}

								{/* Crop Type custom fields */}
								{isCropType && (
									<>
										{/* 1.4 Generate Cropland Product */}
										<Stack gap="xs">
										<Input.Wrapper
											className="worldCereal-Input"
											size="md"
											label="1.4. Generate cropland product"
											description="Generate a cropland mask alongside the crop type product"
										>
											<Checkbox
												style={{ marginTop: '0.5rem' }}
												className="worldCereal-Checkbox"
												size="md"
												label="Enable cropland head"
												checked={enableCroplandHead ?? true}
												onChange={(e) => handleEnableCroplandHeadChange(e.currentTarget.checked)}
											/>
											<br/>
											{(enableCroplandHead ?? true) && (
												<Input.Wrapper
													className="worldCereal-Input"
													size="md"
													label="1.4.1 Cropland Head Override"
													description="Optional. Provide a publicly accessible URL to a custom croplan prediction head (.zip). When provided, it replaces the cropland head of either the default model or the specified base model."
												>
													<TextInput
														size="md"
														placeholder="https://example.zip"
														error={
															!isLandcoverHeadZipValid
																? 'URL not valid (must end with .zip)'
																: null
														}
														value={localLandcoverHeadZip}
														onChange={(e) => handleLandcoverHeadZipChange(e.currentTarget.value)}
													/>
												</Input.Wrapper>
											)}
										</Input.Wrapper>
										</Stack>

										{/* 1.5 Crop Type Head Override */}
										<Input.Wrapper
											className="worldCereal-Input"
											size="md"
											label="1.5. Crop Type Head Override"
											description="Optional. Provide a publicly accessible URL to a custom crop type prediction head (.zip). When provided, it replaces the crop type head of either the default model or the specified base model."
										>
											<TextInput
												size="md"
												placeholder="https://example.zip"
												error={
													!isCroptypeHeadZipValid
														? 'URL not valid (must end with .zip)'
														: null
												}
												value={localCroptypeHeadZip}
												onChange={(e) => handleCroptypeHeadZipChange(e.currentTarget.value)}
											/>
										</Input.Wrapper>
									</>
								)}
							</Stack>
						)}
					</Stack>
				)}

				<Group mt="xl">
					<Link href="/generate-custom-products/steps/2">
						<Button
							rightSection={<IconArrowRight size={14} />}
							disabled={nextStepDisabled}
							className={`worldCereal-Button${nextStepDisabled ? ' is-disabled' : ''}`}
							onClick={() => {}}
						>
							Continue to set parameters & create process
						</Button>
					</Link>
				</Group>
				</div>
			</Column>
			<Column>{null}</Column>
		</TwoColumns>
	);
}
