'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { IconArrowRight } from '@tabler/icons-react';
import { Button, Group, Select, Space } from '@mantine/core';
import { useSharedState } from '@gisatcz/ptr-fe-core/client';
import TwoColumns, { Column } from '@features/(shared)/_layout/_components/Content/TwoColumns';
import formParams from '@features/(processes)/_constants/generate-custom-products/formParams';
import { WorldCerealState } from '@features/state/state.models';
import { OneOfWorldCerealActions } from '@features/state/state.actions';
import { WorldCerealStateActionType } from '@features/state/state.actionTypes';
import { getModel_customProducts } from '@features/state/selectors/createCustomProducts/getModel';
import { getProduct_customProducts } from '@features/state/selectors/createCustomProducts/getProduct';

/**
 * React component for the first step of creating custom products.
 *
 * This component allows users to select a product and model, and proceed to the next step.
 *
 * @function CreateProductsStep1Client
 * @returns {JSX.Element} - The rendered step 1 UI for creating custom products.
 */
export default function CreateProductsStep1Client() {
	/**
	 * Shared state hook for accessing and dispatching application state.
	 * @type {[WorldCerealState, React.Dispatch<OneOfWorldCerealActions>]}
	 */
	const [state, dispatch] = useSharedState<WorldCerealState, OneOfWorldCerealActions>();

	/**
	 * Selector to retrieve the selected product collection from the state.
	 * @type {string | undefined}
	 */
	const model = getModel_customProducts(state);

	/**
	 * Selector to retrieve the selected product from the state.
	 * @type {string | undefined}
	 */
	const product = getProduct_customProducts(state);

	/**
	 * Determines whether the next step is disabled based on the current state.
	 * @type {boolean}
	 */
	const nextStepDisabled = !model || !product;

	/**
	 * Updates the selected model in the state.
	 * @param {string | null} value - The selected model.
	 */
	const setModel = (value: string | null) => {
		if (value) {
			dispatch({
				type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_MODEL,
				payload: value,
			});
		}
	};

	/**
	 * Updates the selected product in the state.
	 * @param {string | null} value - The selected product.
	 */
	const setProduct = (value: string | null) => {
		if (value) {
			dispatch({
				type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_PRODUCT,
				payload: value,
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
					data={formParams.product.options}
					value={product}
					onChange={(value) => setProduct(value)}
				/>
				<Space h="md" />
				<Select
					withAsterisk
					className="worldCereal-Select"
					size="md"
					allowDeselect={false}
					label="Select model"
					placeholder="Pick one"
					data={formParams.model.options}
					value={model}
					onChange={(value) => setModel(value)}
				/>
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
		</TwoColumns>
	);
}
