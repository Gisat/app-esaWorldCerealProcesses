'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { IconArrowRight } from '@tabler/icons-react';
import { Button, Group, Select, Space } from '@mantine/core';
import { useSharedState } from '@gisatcz/ptr-fe-core/client';
import { SectionContainer } from '@features/(shared)/_layout/_components/Content/SectionContainer';
import { TextDescription } from '@features/(shared)/_layout/_components/Content/TextDescription';
import { TextLink } from '@features/(shared)/_layout/_components/Content/TextLink';
import TwoColumns, { Column } from '@features/(shared)/_layout/_components/Content/TwoColumns';
import formParams from '@features/(processes)/_constants/download-official-products/formParams';
import { getCollection } from '@features/state/selectors/downloadOfficialProducts/getCollection';
import { getProduct } from '@features/state/selectors/downloadOfficialProducts/getProduct';
import { WorldCerealState } from '@features/state/state.models';
import { OneOfWorldCerealActions } from '@features/state/state.actions';
import { WorldCerealStateActionType } from '@features/state/state.actionTypes';

/**
 * Component representing the first step in the "Download Official Products" process.
 *
 * This step allows users to select a product collection and a specific product.
 *
 * @component
 * @returns {JSX.Element} The rendered component for step 1 of the process.
 */
export default function DownloadStep1Client() {
	/**
	 * Shared state hook for accessing and dispatching application state.
	 * @type {[WorldCerealState, React.Dispatch<OneOfWorldCerealActions>]}
	 */
	const [state, dispatch] = useSharedState<WorldCerealState, OneOfWorldCerealActions>();

	/**
	 * Selector to retrieve the selected product collection from the state.
	 * @type {string | undefined}
	 */
	const collection = getCollection(state);

	/**
	 * Selector to retrieve the selected product from the state.
	 * @type {string | undefined}
	 */
	const product = getProduct(state);

	/**
	 * Determines whether the next step is disabled based on the current state.
	 * @type {boolean}
	 */
	const nextStepDisabled = !collection || !product;

	/**
	 * Updates the selected product collection in the state.
	 * @param {string | null} value - The selected product collection.
	 */
	const setCollection = (value: string | null) => {
		if (value) {
			dispatch({
				type: WorldCerealStateActionType.DOWNLOAD_OFFICIAL_PRODUCT_SET_COLLECTION,
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
				type: WorldCerealStateActionType.DOWNLOAD_OFFICIAL_PRODUCT_SET_PRODUCT,
				payload: value,
			});
		}
	};

	/**
	 * Effect to initialize the active step in the state when the component mounts.
	 */
	useEffect(() => {
		dispatch({
			type: WorldCerealStateActionType.DOWNLOAD_OFFICIAL_PRODUCT_SET_ACTIVE_STEP,
			payload: 1,
		});
	}, []);

	return (
		<TwoColumns>
			<Column>
				<SectionContainer>
					<TextDescription color="var(--textSecondaryColor)">
						Currently the WorldCereal project has created several{' '}
						<TextLink url="https://esa-worldcereal.org/en/products/global-maps" color="var(--textSecondaryColor)">
							global products
						</TextLink>{' '}
						for the year 2021.
					</TextDescription>
					<TextDescription color="var(--textSecondaryColor)">
						By end of 2026, a new batch of global products for a more recent year will be released.
					</TextDescription>
				</SectionContainer>
				<Select
					withAsterisk
					className="worldCereal-Select"
					size="md"
					allowDeselect={false}
					label="Select the product collection"
					data={formParams.collection.options}
					value={collection}
					onChange={(value) => setCollection(value)}
				/>
				<Space h="md" />
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
				<Group mt="xl">
					<Link href="/download-official-products/steps/2">
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
