'use client';

import { useEffect, useState } from 'react';
import { IconArrowRight } from '@tabler/icons-react';
import { Button, Checkbox, Group, Input, Select, Space, Stack, TextInput } from '@mantine/core';
import { useQueryStates } from 'nuqs';
import TwoColumns, { Column } from '@features/(shared)/_layout/_components/Content/TwoColumns';
import formParams from '@features/(processes)/_constants/generate-custom-products/formParams';
import {
	generateCustomProductsSearchParams,
	serializeGenerateCustomProductsSearchParams,
} from '@features/(processes)/_constants/generate-custom-products/searchParams';
import { customProductsProductTypes } from '@features/(processes)/_constants/app';
import './CreateProductsStep1Client.css';

const zipUrlRegex = /^https?:\/\/.+\.zip$/i;

export default function CreateProductsStep1Client() {
	const [
		{
			product,
			cropTypeModelType,
			seasonalModelZip,
			enableCroplandHead,
			landcoverHeadZip,
			croptypeHeadZip,
		},
		setParams,
	] = useQueryStates(generateCustomProductsSearchParams);

	const isCropType = product === customProductsProductTypes.cropType;
	const isCropExtent = product === customProductsProductTypes.cropExtent;
	const isCustomModel = cropTypeModelType === 'custom';

	const [localSeasonalModelZip, setLocalSeasonalModelZip] = useState<string>(seasonalModelZip ?? '');
	const [localLandcoverHeadZip, setLocalLandcoverHeadZip] = useState<string>(landcoverHeadZip ?? '');
	const [localCroptypeHeadZip, setLocalCroptypeHeadZip] = useState<string>(croptypeHeadZip ?? '');

	const isSeasonalModelZipValid = localSeasonalModelZip === '' || zipUrlRegex.test(localSeasonalModelZip);
	const isLandcoverHeadZipValid = localLandcoverHeadZip === '' || zipUrlRegex.test(localLandcoverHeadZip);
	const isCroptypeHeadZipValid = localCroptypeHeadZip === '' || zipUrlRegex.test(localCroptypeHeadZip);

	const hasValidationErrors =
		isCustomModel &&
		(!isSeasonalModelZipValid ||
			((isCropType ? (enableCroplandHead ?? true) : true) && !isLandcoverHeadZipValid) ||
			(isCropType && !isCroptypeHeadZipValid));

	const nextStepDisabled = !product || hasValidationErrors;

	const setProduct = (value: string | null) => {
		if (value && value !== product) {
			setLocalSeasonalModelZip('');
			setLocalLandcoverHeadZip('');
			setLocalCroptypeHeadZip('');
			setParams({
				product: value as typeof product,
				model: 'default',
				cropTypeModelType: 'default',
				seasonalModelZip: null,
				landcoverHeadZip: null,
				croptypeHeadZip: null,
			});
		}
	};

	const setCropTypeModelType = (value: string | null) => {
		if (value === 'default' || value === 'custom') {
			setParams({ cropTypeModelType: value });
			if (value === 'default') {
				setParams({
					model: 'default',
					seasonalModelZip: null,
					landcoverHeadZip: null,
					croptypeHeadZip: null,
				});
				setLocalSeasonalModelZip('');
				setLocalLandcoverHeadZip('');
				setLocalCroptypeHeadZip('');
			} else {
				setParams({ model: 'default' });
			}
		}
	};

	const handleSeasonalModelZipChange = (value: string) => {
		setLocalSeasonalModelZip(value);
		const isValid = value === '' || zipUrlRegex.test(value);
		setParams({ seasonalModelZip: isValid && value !== '' ? value : null });
	};

	const handleLandcoverHeadZipChange = (value: string) => {
		setLocalLandcoverHeadZip(value);
		const isValid = value === '' || zipUrlRegex.test(value);
		setParams({ landcoverHeadZip: isValid && value !== '' ? value : null });
	};

	const handleCroptypeHeadZipChange = (value: string) => {
		setLocalCroptypeHeadZip(value);
		const isValid = value === '' || zipUrlRegex.test(value);
		setParams({ croptypeHeadZip: isValid && value !== '' ? value : null });
	};

	const handleEnableCroplandHeadChange = (checked: boolean) => {
		setParams({ enableCroplandHead: checked });
		if (!checked) {
			setParams({ landcoverHeadZip: null });
			setLocalLandcoverHeadZip('');
		}
	};

	useEffect(() => {
		if (product && !cropTypeModelType) {
			setParams({ cropTypeModelType: 'default', model: 'default' });
		}
		if (isCropType && enableCroplandHead === undefined) {
			setParams({ enableCroplandHead: true });
		}
	}, [product, isCropType]);

	const continueHref = serializeGenerateCustomProductsSearchParams('/generate-custom-products/steps/2', {
		product,
		model: 'default',
		cropTypeModelType,
		seasonalModelZip,
		enableCroplandHead,
		landcoverHeadZip,
		croptypeHeadZip,
	});

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
									<Input.Wrapper
										className="worldCereal-Input"
										size="md"
										label="1.3. Base model"
										description="Optional. Provide a publicly accessible URL to a complete WorldCereal model package (.zip). This replaces the default model, including the feature extractor and all prediction heads. If no model is provided, the default WorldCereal model is used."
									>
										<TextInput
											size="md"
											placeholder="https://example.zip"
											error={!isSeasonalModelZipValid ? 'URL not valid (must end with .zip)' : null}
											value={localSeasonalModelZip}
											onChange={(e) => handleSeasonalModelZipChange(e.currentTarget.value)}
										/>
									</Input.Wrapper>

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
												error={!isLandcoverHeadZipValid ? 'URL not valid (must end with .zip)' : null}
												value={localLandcoverHeadZip}
												onChange={(e) => handleLandcoverHeadZipChange(e.currentTarget.value)}
											/>
										</Input.Wrapper>
									)}

									{isCropType && (
										<>
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
													<br />
													{(enableCroplandHead ?? true) && (
														<Input.Wrapper
															className="worldCereal-Input"
															size="md"
															label="1.4.1 Cropland Head Override"
															description="Optional. Provide a publicly accessible URL to a custom cropland prediction head (.zip). When provided, it replaces the cropland head of either the default model or the specified base model."
														>
															<TextInput
																size="md"
																placeholder="https://example.zip"
																error={!isLandcoverHeadZipValid ? 'URL not valid (must end with .zip)' : null}
																value={localLandcoverHeadZip}
																onChange={(e) => handleLandcoverHeadZipChange(e.currentTarget.value)}
															/>
														</Input.Wrapper>
													)}
												</Input.Wrapper>
											</Stack>

											<Input.Wrapper
												className="worldCereal-Input"
												size="md"
												label="1.5. Crop Type Head Override"
												description="Optional. Provide a publicly accessible URL to a custom crop type prediction head (.zip). When provided, it replaces the crop type head of either the default model or the specified base model."
											>
												<TextInput
													size="md"
													placeholder="https://example.zip"
													error={!isCroptypeHeadZipValid ? 'URL not valid (must end with .zip)' : null}
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
						<a href={continueHref}>
							<Button
								rightSection={<IconArrowRight size={14} />}
								disabled={nextStepDisabled}
								className={`worldCereal-Button${nextStepDisabled ? ' is-disabled' : ''}`}
								onClick={() => {}}
							>
								Continue to set parameters & create process
							</Button>
						</a>
					</Group>
				</div>
			</Column>
			<Column>{null}</Column>
		</TwoColumns>
	);
}
