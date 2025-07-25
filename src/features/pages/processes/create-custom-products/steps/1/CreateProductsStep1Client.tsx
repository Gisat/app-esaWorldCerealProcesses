'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { IconArrowRight } from '@tabler/icons-react';
import { Button, Group, Input, Select, Space, Stack, Text, TextInput } from '@mantine/core';
import { useSharedState } from '@gisatcz/ptr-fe-core/client';
import TwoColumns, { Column } from '@features/(shared)/_layout/_components/Content/TwoColumns';
import formParams from '@features/(processes)/_constants/generate-custom-products/formParams';
import { WorldCerealState } from '@features/state/state.models';
import { OneOfWorldCerealActions } from '@features/state/state.actions';
import { WorldCerealStateActionType } from '@features/state/state.actionTypes';
import { getModel_customProducts } from '@features/state/selectors/createCustomProducts/getModel';
import { getProduct_customProducts } from '@features/state/selectors/createCustomProducts/getProduct';
import { TextLink } from '@features/(shared)/_layout/_components/Content/TextLink';
import CropTypeOptions from './CropTypeOptions/CropTypeOptions';
import { getOrbitState_customProducts } from '@features/state/selectors/createCustomProducts/getOrbitState';
import { getPostProcessMethod_customProducts } from '@features/state/selectors/createCustomProducts/getPostProcessMethod';
import { getPostProcessKernelSize_customProducts } from '@features/state/selectors/createCustomProducts/getPostProcessKernelSize';
import { customProductsProductTypes } from '@features/(processes)/_constants/app';

/**
 * React component for the first step of creating custom products.
 *
 * This component allows users to select a product and model, and proceed to the next step.
 *
 * @returns {JSX.Element} The rendered step 1 UI for creating custom products.
 */
export default function CreateProductsStep1Client() {
	/**
	 * Shared state hook for accessing and dispatching application state.
	 * @type {[WorldCerealState, React.Dispatch<OneOfWorldCerealActions>]}
	 */
	const [state, dispatch] = useSharedState<WorldCerealState, OneOfWorldCerealActions>();

	/**
	 * Selector to retrieve the selected model from the state.
	 * @type {string | undefined}
	 */
	const model = getModel_customProducts(state);

	/**
	 * Local state for the current model URL input.
	 * @type {[string | null, Function]}
	 */
	const [currentModelUrl, setCurrentModelUrl] = useState<string | null>(model ? model : '');

	/**
	 * Selector to retrieve the selected product from the state.
	 * @type {string | undefined}
	 */
	const product = getProduct_customProducts(state);

	const orbitState = getOrbitState_customProducts(state);
	const postprocessMethod = getPostProcessMethod_customProducts(state);
	const kernelSize = getPostProcessKernelSize_customProducts(state);

	// Enhanced nextStepDisabled logic
	const isCropType = product === customProductsProductTypes.cropType;
	const isKernelValid = !isCropType || (typeof kernelSize === 'number' && kernelSize >= 1 && kernelSize <= 25);

	const areCropTypeParamsValid =
		!isCropType || (orbitState && postprocessMethod && (postprocessMethod !== 'majority_vote' || isKernelValid));

	/**
	 * Determines whether the next step is disabled based on the current state.
	 * @type {boolean}
	 */
	const nextStepDisabled = !model || !product || !areCropTypeParamsValid;

	/**
	 * Updates the selected model in the state.
	 * @param {string | null} value - The selected model.
	 */
	const setModel = (value: string | null) => {
		dispatch({
			type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_MODEL,
			payload: value,
		});
	};

	/**
	 * Updates the selected product in the state and resets the model.
	 * @param {string | null} value - The selected product.
	 */
	const setProduct = (value: string | null) => {
		if (value && value !== product) {
			setCurrentModelUrl(''); // Reset model URL when product changes
			dispatch({
				type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_PRODUCT,
				payload: value,
			});
			dispatch({
				type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_MODEL,
				payload: null, // Reset model when product changes
			});
		}
	};

	/**
	 * Effect to initialize the active step in the state when the component mounts.
	 */
	useEffect(() => {
		dispatch({
			type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_ACTIVE_STEP,
			payload: 1,
		});
	}, []);

	/**
	 * Effect to update the current model URL when the model changes.
	 */
	useEffect(() => {
		if (model) {
			setCurrentModelUrl(model);
		}
	}, [model]);

	/**
	 * Validates and updates the model URL input.
	 * If the URL is valid, dispatches it to the state; otherwise, resets the model in the state.
	 *
	 * @param {string} value - The model URL to validate and set.
	 */
	const setModelUrl = (value: string) => {
		setCurrentModelUrl(value);
		const regex = /^https?:\/\/.+\.onnx$/i;
		const isValid = regex.test(value);

		if (isValid) {
			setModel(value);
		} else if (model) {
			setModel(null);
		}
	};

	return (
		/**
		 * Layout with two columns for the step UI.
		 */
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
						<Text>
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
			</Column>
			<Column>{product === customProductsProductTypes.cropType ? <CropTypeOptions /> : null}</Column>
		</TwoColumns>
	);
}
