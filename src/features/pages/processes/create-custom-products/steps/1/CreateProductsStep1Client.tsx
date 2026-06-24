'use client';

import { useEffect, useState } from 'react';
import { IconArrowRight } from '@tabler/icons-react';
import { Button, Group, Input, Select, Space, Stack, Text, TextInput } from '@mantine/core';
import { useQueryStates } from 'nuqs';
import TwoColumns, { Column } from '@features/(shared)/_layout/_components/Content/TwoColumns';
import formParams from '@features/(processes)/_constants/generate-custom-products/formParams';
import {
	generateCustomProductsSearchParams,
	serializeGenerateCustomProductsSearchParams,
} from '@features/(processes)/_constants/generate-custom-products/searchParams';
import { TextLink } from '@features/(shared)/_layout/_components/Content/TextLink';
import CropTypeOptions from './CropTypeOptions/CropTypeOptions';
import { customProductsPostprocessMethods, customProductsProductTypes } from '@features/(processes)/_constants/app';

export default function CreateProductsStep1Client() {
	const [{ product, model, orbitState, postprocessMethod, postprocessKernelSize }, setParams] = useQueryStates(
		generateCustomProductsSearchParams
	);

	const [currentModelUrl, setCurrentModelUrl] = useState<string | null>(model ?? '');

	const isCropType = product === customProductsProductTypes.cropType;
	const isKernelValid =
		!isCropType ||
		(typeof postprocessKernelSize === 'number' &&
			postprocessKernelSize >= 1 &&
			postprocessKernelSize <= 25 &&
			postprocessKernelSize % 2 === 1);

	const areCropTypeParamsValid =
		!isCropType ||
		(orbitState &&
			postprocessMethod &&
			(postprocessMethod !== customProductsPostprocessMethods.majorityVote || isKernelValid));

	const nextStepDisabled = !model || !product || !areCropTypeParamsValid;

	const setModel = (value: string | null) => {
		setParams({ model: value });
	};

	const setProduct = (value: string | null) => {
		if (value && value !== product) {
			setCurrentModelUrl('');
			setParams({ product: value, model: null });
		}
	};

	useEffect(() => {
		if (model) {
			setCurrentModelUrl(model);
		}
	}, [model]);

	const setModelUrl = (value: string) => {
		setCurrentModelUrl(value);
		const regex = /^https?:\/\/.+\.(onnx|zip)$/i;
		const isValid = regex.test(value);

		if (isValid) {
			setModel(value);
		} else if (model) {
			setModel(null);
		}
	};

	const continueHref = serializeGenerateCustomProductsSearchParams('/generate-custom-products/steps/2', {
		product,
		model,
		orbitState,
		postprocessMethod,
		postprocessKernelSize,
	});

	return (
		<TwoColumns>
			<Column>
				<Select
					withAsterisk
					className="worldCereal-Select"
					size="md"
					allowDeselect={false}
					label="Select your product"
					placeholder="Pick one"
					data={formParams.product.options}
					value={product}
					onChange={(value) => setProduct(value)}
				/>
				<Space h="md" />
				{product === customProductsProductTypes.cropType ? (
					<Stack>
						<Input.Wrapper
							className="worldCereal-Input"
							size="md"
							label="Enter model URL"
							description="Write the URL of the product model"
							withAsterisk
						>
							<TextInput
								size="md"
								placeholder="Valid URL..."
								error={!model && currentModelUrl !== '' ? 'URL not valid' : null}
								value={currentModelUrl ?? ''}
								onChange={(event) => setModelUrl(event.currentTarget.value)}
							/>
						</Input.Wrapper>
						<Text size="sm" c="var(--textSecondaryColor)">
							This service only works with custom models, learn more{' '}
							<TextLink
								url={
									'https://github.com/WorldCereal/worldcereal-classification/blob/main/notebooks/worldcereal_custom_croptype.ipynb'
								}
							>
								here
							</TextLink>
							.
						</Text>
					</Stack>
				) : (
					<Select
						withAsterisk
						className="worldCereal-Select"
						size="md"
						allowDeselect={false}
						label="Select model"
						placeholder="Pick one"
						description="Select model for the product"
						data={formParams.model.options}
						value={model}
						onChange={(value) => setModel(value)}
					/>
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
			</Column>
			<Column>{product === customProductsProductTypes.cropType ? <CropTypeOptions /> : null}</Column>
		</TwoColumns>
	);
}
