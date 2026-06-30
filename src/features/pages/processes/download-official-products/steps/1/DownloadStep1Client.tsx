'use client';

import Link from 'next/link';
import { IconArrowRight } from '@tabler/icons-react';
import { Button, Group, Select, Space } from '@mantine/core';
import { useQueryStates } from 'nuqs';
import { SectionContainer } from '@features/(shared)/_layout/_components/Content/SectionContainer';
import { TextDescription } from '@features/(shared)/_layout/_components/Content/TextDescription';
import { TextLink } from '@features/(shared)/_layout/_components/Content/TextLink';
import TwoColumns, { Column } from '@features/(shared)/_layout/_components/Content/TwoColumns';
import formParams from '@features/(processes)/_constants/download-official-products/formParams';
import {
	downloadOfficialProductsSearchParams,
	serializeDownloadOfficialProductsSearchParams,
} from '@features/(processes)/_constants/download-official-products/searchParams';
import { downloadStep1Schema, nullsToUndefined } from '@features/(processes)/_constants/validation';

/**
 * Component representing the first step in the "Download Official Products" process.
 *
 * This step allows users to select a product collection and a specific product.
 *
 * @component
 * @returns {JSX.Element} The rendered component for step 1 of the process.
 */
export default function DownloadStep1Client() {
	const [{ collection, product }, setParams] = useQueryStates(downloadOfficialProductsSearchParams);

	const validation = downloadStep1Schema.safeParse(nullsToUndefined({
		collection,
		product,
	}));

	const nextStepDisabled = !validation.success;

	/**
	 * Updates the selected product collection in the URL state.
	 * @param {string | null} value - The selected product collection.
	 */
	const setCollection = (value: string | null) => {
		if (value) setParams({ collection: value });
	};

	/**
	 * Updates the selected product in the URL state.
	 * @param {string | null} value - The selected product.
	 */
	const setProduct = (value: string | null) => {
		if (value) setParams({ product: value });
	};

	/**
	 * Forward the current URL state to step 2 so it survives the route change.
	 */
	const step2Href = serializeDownloadOfficialProductsSearchParams('/download-official-products/steps/2', {
		collection,
		product,
	});

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
					placeholder="Pick one"
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
					<Link href={step2Href}>
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