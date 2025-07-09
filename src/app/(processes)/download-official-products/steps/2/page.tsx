'use client';
import useSWR from 'swr';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { WorldCerealStateActionType } from '@features/state/state.actionTypes';
import { useSharedState } from '@gisatcz/ptr-fe-core/client';
import {
	DownloadOfficialProductsBackgroundLayerModel,
	DownloadOfficialProductsBBoxModel,
	DownloadOfficialProductsOutputFileFormatModel,
	WorldCerealState,
} from '@features/state/state.models';
import { OneOfWorldCerealActions } from '@features/state/state.actions';
import TwoColumns, { Column } from '@features/(shared)/_layout/_components/Content/TwoColumns';
import { SectionContainer } from '@features/(shared)/_layout/_components/Content/SectionContainer';
import { Button, Group, SegmentedControl, Stack } from '@mantine/core';
import FormLabel from '@features/(shared)/_layout/_components/Content/FormLabel';
import { TextDescription } from '@features/(shared)/_layout/_components/Content/TextDescription';
import { MapBBox } from '@features/(shared)/_components/map/MapBBox';
import { bboxSizeLimits } from '@features/(processes)/_constants/app';
import { TextLink } from '@features/(shared)/_layout/_components/Content/TextLink';
import formParams from '@features/(processes)/_constants/download-official-products/formParams';
import { getOutputFileFormat } from '@features/state/selectors/downloadOfficialProducts/getOutputFileFormat';
import { getBBox } from '@features/state/selectors/downloadOfficialProducts/getBBox';
import { getBackgroundLayer } from '@features/state/selectors/downloadOfficialProducts/getBackgroundLayer';
import { getCollection } from '@features/state/selectors/downloadOfficialProducts/getCollection';
import { getProduct } from '@features/state/selectors/downloadOfficialProducts/getProduct';
import { IconArrowLeft, IconCheck } from '@tabler/icons-react';
import { apiFetcher } from '@features/(shared)/_url/apiFetcher';

/**
 * Component representing the second step in the "Download Official Products" process.
 *
 * This step allows users to define the bounding box, select output file format, and create a process.
 *
 * @component
 * @returns {JSX.Element} The rendered component for step 2 of the process.
 */
export default function DownloadStep2() {
	/**
	 * API URL for creating a process from a collection.
	 * @type {string}
	 */
	const apiUrl = '/api/jobs/create/from-collection';

	/**
	 * Router instance for navigation.
	 */
	const router = useRouter();

	/**
	 * Shared state hook for accessing and dispatching application state.
	 * @type {[WorldCerealState, React.Dispatch<OneOfWorldCerealActions>]}
	 */
	const [state, dispatch] = useSharedState<WorldCerealState, OneOfWorldCerealActions>();

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
	 * Selector to retrieve the output file format from the state.
	 * @type {string | undefined}
	 */
	const outputFileFormat = getOutputFileFormat(state);

	/**
	 * Selector to retrieve the bounding box from the state.
	 * @type {string[] | undefined}
	 */
	const bbox = getBBox(state);

	/**
	 * Selector to retrieve the background layer from the state.
	 * @type {string | undefined}
	 */
	const backgroundLayer = getBackgroundLayer(state);

	/**
	 * Selector to retrieve the collection from the state.
	 * @type {string | undefined}
	 */
	const collection = getCollection(state);

	/**
	 * Selector to retrieve the product from the state.
	 * @type {string | undefined}
	 */
	const product = getProduct(state);

	/**
	 * Determines whether the next step is disabled based on the current state.
	 * @type {boolean}
	 */
	const nextStepDisabled = !bboxIsInBounds || !bbox || !collection || !product || !outputFileFormat;

	/**
	 * Effect to initialize the active step and set default output file format.
	 */
	useEffect(() => {
		dispatch({
			type: WorldCerealStateActionType.DOWNLOAD_OFFICIAL_PRODUCT_SET_ACTIVE_STEP,
			payload: 2,
		});

		if (!outputFileFormat) {
			const defaultValue = formParams.outputFileFormat.options.find((option) => option.default)?.value;
			if (defaultValue) {
				setOutputFileFormat(defaultValue as DownloadOfficialProductsOutputFileFormatModel);
			}
		}
	}, []);

	/**
	 * Updates the output file format in the state.
	 * @param {DownloadOfficialProductsOutputFileFormatModel} value - The selected output file format.
	 */
	const setOutputFileFormat = (value: DownloadOfficialProductsOutputFileFormatModel) => {
		dispatch({
			type: WorldCerealStateActionType.DOWNLOAD_OFFICIAL_PRODUCT_SET_OUTPUT_FILE_FORMAT,
			payload: value,
		});
	};

	/**
	 * Updates the background layer in the state.
	 * @param {DownloadOfficialProductsBackgroundLayerModel} value - The selected background layer.
	 */
	const setBackgroundLayer = (value: DownloadOfficialProductsBackgroundLayerModel) => {
		if (value) {
			dispatch({
				type: WorldCerealStateActionType.DOWNLOAD_OFFICIAL_PRODUCT_SET_BACKGROUND_LAYER,
				payload: value,
			});
		}
	};

	/**
	 * Updates the bounding box extent in the state.
	 * @param {DownloadOfficialProductsBBoxModel | null} extent - The bounding box extent.
	 */
	const setBBoxExtent = (extent: DownloadOfficialProductsBBoxModel | null) => {
		if (extent) {
			dispatch({
				type: WorldCerealStateActionType.DOWNLOAD_OFFICIAL_PRODUCT_SET_BBOX,
				payload: extent,
			});
		}
	};

	/**
	 * URL parameters for the API request.
	 * @type {URLSearchParams}
	 */
	const urlParams = new URLSearchParams({
		bbox: bbox ? bbox.join(',') : '',
		outputFileFormat: outputFileFormat?.toString() || '',
		collection: collection?.toString() || '',
		product: product?.toString() || '',
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
		router.push(`/download-official-products/steps/1`);
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
	 * Effect to update URL parameters and navigate to the next step when job data is received.
	 */
	useEffect(() => {
		if (data?.key) {
			setTimeout(() => {
				dispatch({
					type: WorldCerealStateActionType.DOWNLOAD_OFFICIAL_PRODUCT_SET_CURRENT_JOB_KEY,
					payload: data.key,
				});
				router.push(`/download-official-products/steps/3`);
			}, 50);
		}
	}, [data, router]);

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
						bbox={bbox?.map(Number)}
						setBboxDescription={setBboxDescription}
						setBboxExtent={setBBoxExtent}
						setBboxIsInBounds={setBboxIsInBounds}
						backgroundLayer={backgroundLayer}
						setBackgroundLayer={(value) => setBackgroundLayer(value as DownloadOfficialProductsBackgroundLayerModel)}
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
							onChange={(value) => setOutputFileFormat(value as DownloadOfficialProductsOutputFileFormatModel)}
							className="worldCereal-SegmentedControl"
							size="md"
							value={outputFileFormat}
							data={formParams.outputFileFormat.options}
						/>
					</div>
				</Stack>
			</Column>
		</TwoColumns>
	);
}
