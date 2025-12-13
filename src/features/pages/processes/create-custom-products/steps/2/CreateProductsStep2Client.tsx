'use client';
import useSWR from 'swr';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconArrowLeft, IconCheck } from '@tabler/icons-react';
import { WorldCerealStateActionType } from '@features/state/state.actionTypes';
import { useSharedState } from '@gisatcz/ptr-fe-core/client';
import {
	CreateCustomProductsBackgroundLayerModel,
	CreateCustomProductsBBoxModel,
	CreateCustomProductsEndDateModel,
	CreateCustomProductsOutputFileFormatModel,
	WorldCerealState,
} from '@features/state/state.models';
import { OneOfWorldCerealActions } from '@features/state/state.actions';
import TwoColumns, { Column } from '@features/(shared)/_layout/_components/Content/TwoColumns';
import { SectionContainer } from '@features/(shared)/_layout/_components/Content/SectionContainer';
import { Button, Group, SegmentedControl, Stack } from '@mantine/core';
import FormLabel from '@features/(shared)/_layout/_components/Content/FormLabel';
import { TextDescription } from '@features/(shared)/_layout/_components/Content/TextDescription';
import { MapBBox } from '@features/(shared)/_components/map/MapBBox';
import {
	bboxSizeLimits,
	customProductsDateLimits,
	customProductsPostprocessMethods,
	customProductsProductTypes,
	defaultProductsDates,
} from '@features/(processes)/_constants/app';
import { TextLink } from '@features/(shared)/_layout/_components/Content/TextLink';
import formParams from '@features/(processes)/_constants/generate-custom-products/formParams';
import { apiFetcher } from '@features/(shared)/_url/apiFetcher';
import { getOutputFileFormat_customProducts } from '@features/state/selectors/createCustomProducts/getOutputFileFormat';
import { getBBox_customProducts } from '@features/state/selectors/createCustomProducts/getBBox';
import { getBackgroundLayer_customProducts } from '@features/state/selectors/createCustomProducts/getBackgroundLayer';
import { getModel_customProducts } from '@features/state/selectors/createCustomProducts/getModel';
import { getProduct_customProducts } from '@features/state/selectors/createCustomProducts/getProduct';
import { getEndDate_customProducts } from '@features/state/selectors/createCustomProducts/getEndDate';
import { SelectMonth } from '@features/(processes)/_components/SelectMonth';
import { getOrbitState_customProducts } from '@features/state/selectors/createCustomProducts/getOrbitState';
import { getPostProcessMethod_customProducts } from '@features/state/selectors/createCustomProducts/getPostProcessMethod';
import { getPostProcessKernelSize_customProducts } from '@features/state/selectors/createCustomProducts/getPostProcessKernelSize';

/**
 * Component representing the second step in the "Create Custom Products" process.
 *
 * This step allows users to define the bounding box, select output file format, and create a process.
 *
 * @component
 * @returns {JSX.Element} The rendered component for step 2 of the process.
 */
export default function CreateProductsStep2Client() {
	/**
	 * API URL for creating a process from a collection.
	 * @type {string}
	 */
	const apiUrl = '/api/jobs/create/from-process';

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
	const outputFileFormat = getOutputFileFormat_customProducts(state);

	/**
	 * Selector to retrieve the bounding box from the state.
	 * @type {string[] | undefined}
	 */
	const bbox = getBBox_customProducts(state);

	/**
	 * Selector to retrieve the background layer from the state.
	 * @type {string | undefined}
	 */
	const backgroundLayer = getBackgroundLayer_customProducts(state);

	/**
	 * Selector to retrieve the collection from the state.
	 * @type {string | undefined}
	 */
	const model = getModel_customProducts(state);

	/**
	 * Selector to retrieve the product from the state.
	 * @type {string | undefined}
	 */
	const product = getProduct_customProducts(state);

	/**
	 * Selector to retrieve the end date from the state.
	 * @type {string | undefined}
	 */
	const endDate = getEndDate_customProducts(state);

	const orbitState = getOrbitState_customProducts(state);
	const postprocessMethod = getPostProcessMethod_customProducts(state);
	const postprocessKernelSize = getPostProcessKernelSize_customProducts(state);

	/**
	 * Determines whether the next step is disabled based on the current state.
	 * @type {boolean}
	 */
	const nextStepDisabled = !bboxIsInBounds || !bbox || !model || !product || !outputFileFormat || !endDate;

	/**
	 * Effect to initialize the active step and set default output file format and end date.
	 */
	useEffect(() => {
		dispatch({
			type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_ACTIVE_STEP,
			payload: 2,
		});

		if (!outputFileFormat) {
			const defaultValue = formParams.outputFileFormat.options.find((option) => option.default)?.value;
			if (defaultValue) {
				setOutputFileFormat(defaultValue as CreateCustomProductsOutputFileFormatModel);
			}
		}

		if (!endDate) {
			const defaultEndDate = defaultProductsDates?.endDate;
			if (defaultEndDate) {
				setEndDate(defaultEndDate as unknown as CreateCustomProductsEndDateModel);
			}
		}
	}, []);

	/**
	 * Updates the output file format in the state.
	 * @param {CreateCustomProductsOutputFileFormatModel} value - The selected output file format.
	 */
	const setOutputFileFormat = (value: CreateCustomProductsOutputFileFormatModel) => {
		dispatch({
			type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_OUTPUT_FILE_FORMAT,
			payload: value,
		});
	};

	/**
	 * Updates the background layer in the state.
	 * @param {CreateCustomProductsBackgroundLayerModel} value - The selected background layer.
	 */
	const setBackgroundLayer = (value: CreateCustomProductsBackgroundLayerModel) => {
		if (value) {
			dispatch({
				type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_BACKGROUND_LAYER,
				payload: value,
			});
		}
	};

	/**
	 * Updates the bounding box extent in the state.
	 * @param {CreateCustomProductsBBoxModel | null} extent - The selected bounding box extent.
	 */
	const setBBoxExtent = (extent: CreateCustomProductsBBoxModel | null) => {
		dispatch({
			type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_BBOX,
			payload: extent ?? undefined,
		});
	};

	/**
	 * Updates the end date in the state.
	 * @param {CreateCustomProductsEndDateModel | null} value - The selected end date.
	 */
	const setEndDate = (value: CreateCustomProductsEndDateModel | null) => {
		if (value && value !== endDate) {
			dispatch({
				type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_END_DATE,
				payload: value ?? undefined,
			});
		}
	};

	/**
	 * URL parameters for the API request.
	 * @type {URLSearchParams}
	 */
	const params: Record<string, string> = {
		bbox: bbox ? bbox.join(',') : '',
		outputFileFormat: outputFileFormat?.toString() || '',
		model: model?.toString() || '',
		product: product?.toString() || '',
		endDate: endDate?.toString() || '',
	};

	if (product === customProductsProductTypes.cropType) {
		if (orbitState) params.orbitState = orbitState.toString();
		if (postprocessMethod) params.postprocessMethod = postprocessMethod.toString();
		if (postprocessMethod === customProductsPostprocessMethods.majorityVote && postprocessKernelSize !== undefined) {
			params.postprocessKernelSize = postprocessKernelSize.toString();
		}
	}

	const urlParams = new URLSearchParams(params);

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
		router.push(`/generate-custom-products/steps/1`);
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
			dispatch({
				type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_CURRENT_JOB_KEY,
				payload: data.key,
			});
			router.push(`/generate-custom-products/steps/3`);
		}
	}, [data, router]);

	return (
		<TwoColumns>
			<Column>
				<SectionContainer>
					<Group gap={'0.3rem'} align="baseline">
						<FormLabel>Draw the extent</FormLabel>
						<TextDescription color={'var(--textSecondaryColor)'}>
							(MIN: 900 m<sup>2</sup>, MAX: 2 500 km<sup>2</sup>)
						</TextDescription>
					</Group>
					<MapBBox
						mapSize={[650, 400]}
						minBboxArea={bboxSizeLimits.customProducts.min}
						maxBboxArea={bboxSizeLimits.customProducts.max}
						bbox={bbox?.map(Number)}
						setBboxDescription={setBboxDescription}
						setBboxExtent={setBBoxExtent}
						setBboxIsInBounds={setBboxIsInBounds}
						backgroundLayer={backgroundLayer}
						setBackgroundLayer={(value) => setBackgroundLayer(value as CreateCustomProductsBackgroundLayerModel)}
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
					<b>Avoid too large areas to prevent excessive credit usage and long processing times!</b>
				</TextDescription>
				<TextDescription>
					A run of 250 km<sup>2</sup> will typically consume 40 credits and last around 20min.
				</TextDescription>
				<TextDescription>
					A run of 750 km<sup>2</sup> will typically consume 90 credits and last around 50min.
				</TextDescription>
				<TextDescription>
					A run of 2500 km<sup>2</sup> will typically consume 250 credits and last around 1h 40min.
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
					<div>
						<FormLabel>Select season of interest</FormLabel>
						<div>
							<TextDescription>
								Define the end month of your processing period. The default length of the period is 12 months.
							</TextDescription>
							<TextDescription>
								To guide your decision concerning the processing period, you can consult the{' '}
								<TextLink url="https://ipad.fas.usda.gov/ogamaps/cropcalendar.aspx">USDA crop calendars</TextLink>
							</TextDescription>
						</div>
					</div>
					<div style={{ width: '20rem' }}>
						<SelectMonth
							label="Ending month"
							disabled={false}
							value={endDate}
							minDate={new Date(customProductsDateLimits.min)}
							maxDate={new Date(customProductsDateLimits.max)}
							onChange={setEndDate}
						/>
					</div>
					<div style={{ width: '100%' }}>
						<FormLabel>Choose output file format</FormLabel>
						<SegmentedControl
							onChange={(value) => setOutputFileFormat(value as CreateCustomProductsOutputFileFormatModel)}
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
