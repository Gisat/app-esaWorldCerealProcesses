'use client';
import useSWR from 'swr';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconArrowLeft, IconCheck } from '@tabler/icons-react';
import { useQueryStates } from 'nuqs';
import TwoColumns, { Column } from '@features/(shared)/_layout/_components/Content/TwoColumns';
import { SectionContainer } from '@features/(shared)/_layout/_components/Content/SectionContainer';
import { Button, Group, SegmentedControl, Stack } from '@mantine/core';
import FormLabel from '@features/(shared)/_layout/_components/Content/FormLabel';
import { TextDescription } from '@features/(shared)/_layout/_components/Content/TextDescription';
import { MapBBox } from '@features/(shared)/_components/map/MapBBox';
import { bboxSizeLimits, processTypes } from '@features/(processes)/_constants/app';
import { TextLink } from '@features/(shared)/_layout/_components/Content/TextLink';
import formParams from '@features/(processes)/_constants/download-official-products/formParams';
import {
	downloadOfficialProductsSearchParams,
	serializeDownloadOfficialProductsSearchParams,
} from '@features/(processes)/_constants/download-official-products/searchParams';
import { parseBbox, stringifyBbox } from '@features/(processes)/_utils/bbox';
import type { BBoxModel } from '@features/(processes)/_utils/bbox';
import { apiFetcher } from '@features/(shared)/_url/apiFetcher';

/**
 * Component representing the second step in the "Download Official Products" process.
 *
 * This step allows users to define the bounding box, select output file format, and create a process.
 *
 * @component
 * @returns {JSX.Element} The rendered component for step 2 of the process.
 */
export default function DownloadStep2Client() {
	/**
	 * API URL for creating a process from a collection.
	 * @type {string}
	 */
	const apiUrl = '/api/jobs/create/from-collection';

	/**
	 * Router instance for navigation.
	 */
	const router = useRouter();

	const [{ bbox, format, backgroundLayer, collection, product }, setParams] = useQueryStates(
		downloadOfficialProductsSearchParams
	);

	/**
	 * State to determine if the bounding box is within valid bounds.
	 * @type {boolean | null}
	 */
	const [bboxIsInBounds, setBboxIsInBounds] = useState<boolean | null>(null);

	/**
	 * State to store the description of the bounding box.
	 * @type {string | string[] | null}
	 */
	const [bboxDescription, setBboxDescription] = useState<string | string[] | null>(null);

	/**
	 * State to determine whether to fetch process data.
	 * @type {boolean}
	 */
	const [shouldFetch, setShouldFetch] = useState(false);

	/**
	 * Parsed bbox tuple from the URL state.
	 * @type {BBoxModel}
	 */
	const bboxArr = parseBbox(bbox);

	/**
	 * Determines whether the next step is disabled based on the current state.
	 * @type {boolean}
	 */
	const nextStepDisabled = !bboxIsInBounds || !bboxArr || !collection || !product || !format;

	/**
	 * Updates the output file format in the URL state.
	 * @param {'GTiff' | 'NETCDF'} value - The selected output file format.
	 */
	const setOutputFileFormat = (value: 'GTiff' | 'NETCDF') => {
		setParams({ format: value });
	};

	/**
	 * Updates the background layer in the URL state.
	 * @param {string | null} value - The selected background layer.
	 */
	const setBackgroundLayer = (value: string | null) => {
		if (value) setParams({ backgroundLayer: value });
	};

	/**
	 * Updates the bounding box extent in the URL state.
	 * @param {[number, number, number, number] | null} extent - The bounding box extent.
	 */
	const setBBoxExtent = (extent: [number, number, number, number] | null) => {
		setParams({ bbox: extent ? stringifyBbox(extent) : null });
	};

	/**
	 * URL parameters for the API request.
	 * @type {URLSearchParams}
	 */
	const productLabel = product ? (formParams.product.options.find((o) => o.value === product)?.label ?? product) : '';
	const collectionLabel = collection ? (formParams.collection.options.find((o) => o.value === collection)?.label ?? collection) : '';
	const title = productLabel && collectionLabel ? `Download: ${productLabel} (${collectionLabel})` : undefined;

	const urlParams = new URLSearchParams({
		bbox: bbox ?? '',
		format: format ?? '',
		collection: collection ?? '',
		product: product ?? '',
		...(title ? { title } : {}),
		...(product ? { customProperties: JSON.stringify({ process_type: processTypes.download, ...(backgroundLayer ? { background_layer: backgroundLayer } : {}) }) } : {}),
	});

	/**
	 * SWR hook for fetching process data.
	 */
	const { data, isLoading } = useSWR(shouldFetch ? [apiUrl, urlParams.toString()] : null, () =>
		apiFetcher(apiUrl, urlParams.toString())
	);

	/**
	 * Handler to initiate the process creation.
	 */
	const onCreateProcessClick = () => {
		setShouldFetch(true);
	};

	/**
	 * Handler to navigate back to the previous step.
	 */
	const onBackClick = () => {
		router.push(
			serializeDownloadOfficialProductsSearchParams('/download-official-products/steps/1', {
				collection,
				product,
			})
		);
	};

	/**
	 * Effect to reset fetch state when data is available.
	 */
	useEffect(() => {
		if (shouldFetch && data) {
			setShouldFetch(false);
		}
	}, [shouldFetch, data]);

	/**
	 * Effect to navigate to the next step when job data is received.
	 */
	useEffect(() => {
		if (data?.key) {
			const baseHref = serializeDownloadOfficialProductsSearchParams(
				'/download-official-products/steps/3',
				{ backgroundLayer }
			);
			const separator = baseHref.includes('?') ? '&' : '?';
			router.push(`${baseHref}${separator}jobKey=${encodeURIComponent(data.key)}`);
		}
	}, [data, router, backgroundLayer]);

	return (
		<TwoColumns>
			<Column>
				<SectionContainer>
					<Group gap={'0.3rem'} align="baseline">
						<FormLabel>Draw the extent</FormLabel>
						<TextDescription color={'var(--textSecondaryColor)'}>
							(MIN: 900 m<sup>2</sup>, MAX: 100 000 km<sup>2</sup>)
						</TextDescription>
					</Group>
					<MapBBox
						mapSize={[650, 400]}
						minBboxArea={bboxSizeLimits.downloadProducts.min}
						maxBboxArea={bboxSizeLimits.downloadProducts.max}
						bbox={bboxArr}
						setBboxDescription={setBboxDescription}
						setBboxExtent={setBBoxExtent}
						setBboxIsInBounds={setBboxIsInBounds}
						backgroundLayer={backgroundLayer ?? undefined}
						setBackgroundLayer={(value) => setBackgroundLayer(typeof value === 'function' ? value(backgroundLayer) : value)}
					/>
					<TextDescription>
						Current extent:{' '}
						{bboxDescription ? (
							<>
								{bboxDescription} km<sup>2</sup>
							</>
						) : (
							'No extent selected'
						)}
					</TextDescription>
				</SectionContainer>
				<TextDescription>
					In case you are interested in larger areas, we recommend to download the AEZ-based products directly from{' '}
					<TextLink url="https://zenodo.org/records/7875105">Zenodo</TextLink>.
				</TextDescription>
				<Group mt="xl">
					<Button
						className="worldCereal-Button is-secondary is-ghost"
						variant="outline"
						onClick={onBackClick}
						leftSection={<IconArrowLeft size={14} />}
					>
						Back
					</Button>
					<Button
						leftSection={<IconCheck size={14} />}
						disabled={isLoading || nextStepDisabled}
						className="worldCereal-Button"
						onClick={onCreateProcessClick}
					>
						{isLoading ? 'Creating...' : 'Create process'}
					</Button>
				</Group>
			</Column>
			<Column>
				<Stack gap="lg" w="100%" align="flex-start">
					<div style={{ width: '100%' }}>
						<FormLabel>Choose output file format</FormLabel>
						<SegmentedControl
							onChange={(value) => setOutputFileFormat(value as 'GTiff' | 'NETCDF')}
							className="worldCereal-SegmentedControl"
							size="md"
						value={format}
						data={formParams.format.options}
						/>
					</div>
				</Stack>
			</Column>
		</TwoColumns>
	);
}