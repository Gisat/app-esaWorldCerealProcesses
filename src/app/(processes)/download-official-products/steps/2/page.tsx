'use client';

import { useEffect, useState } from 'react';
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
import { IconArrowRight, IconCheck } from '@tabler/icons-react';
import useSWR from 'swr';
import { apiFetcher } from '@features/(shared)/_url/apiFetcher';
import { useRouter } from 'next/navigation';

export default function DownloadStep2() {
	const apiUrl = '/api/jobs/create/from-collection';
	const router = useRouter();
	const [state, dispatch] = useSharedState<WorldCerealState, OneOfWorldCerealActions>();
	const [bboxIsInBounds, setBboxIsInBounds] = useState<boolean | null>(null);
	const [bboxDescription, setBboxDescription] = useState<string | string[] | null>(null);
	const [shouldFetch, setShouldFetch] = useState(false);
	const outputFileFormat = getOutputFileFormat(state);
	const bbox = getBBox(state);
	const backgroundLayer = getBackgroundLayer(state);
	const collection = getCollection(state);
	const product = getProduct(state);
	const nextStepDisabled = !bboxIsInBounds || !bbox || !collection || !product || !outputFileFormat;

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

	const setOutputFileFormat = (value: DownloadOfficialProductsOutputFileFormatModel) => {
		dispatch({
			type: WorldCerealStateActionType.DOWNLOAD_OFFICIAL_PRODUCT_SET_OUTPUT_FILE_FORMAT,
			payload: value,
		});
	};

	const setBackgroundLayer = (value: DownloadOfficialProductsBackgroundLayerModel) => {
		if (value) {
			dispatch({
				type: WorldCerealStateActionType.DOWNLOAD_OFFICIAL_PRODUCT_SET_BACKGROUND_LAYER,
				payload: value,
			});
		}
	};

	const setBBoxExtent = (extent: DownloadOfficialProductsBBoxModel | null) => {
		if (extent) {
			dispatch({
				type: WorldCerealStateActionType.DOWNLOAD_OFFICIAL_PRODUCT_SET_BBOX,
				payload: extent,
			});
		}
	};

	const urlParams = new URLSearchParams({
		bbox: bbox ? bbox.join(',') : '',
		outputFileFormat: outputFileFormat?.toString() || '',
		collection: collection?.toString() || '',
		product: product?.toString() || '',
	});
	const { data, isLoading } = useSWR(shouldFetch ? [apiUrl, urlParams.toString()] : null, () =>
		apiFetcher(apiUrl, urlParams.toString())
	);

	const handleClick = () => {
		setShouldFetch(true);
	};

	// Reset fetch state when data is available
	useEffect(() => {
		if (shouldFetch && data) {
			setShouldFetch(false);
		}
	}, [shouldFetch, data]);

	// Update URL parameters when job data is received
	useEffect(() => {
		if (data?.key) {
			setTimeout(() => {
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
						leftSection={<IconCheck size={14} />}
						disabled={isLoading || nextStepDisabled}
						className="worldCereal-Button"
						onClick={handleClick}
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
