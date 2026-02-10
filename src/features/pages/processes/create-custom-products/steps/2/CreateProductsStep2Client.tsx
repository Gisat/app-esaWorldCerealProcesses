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
import { Button, Group, SegmentedControl, Stack, Radio, RangeSlider, Box } from '@mantine/core';
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
import {
	getPostProcessMethod_customProducts
} from '@features/state/selectors/createCustomProducts/getPostProcessMethod';
import {
	getPostProcessKernelSize_customProducts
} from '@features/state/selectors/createCustomProducts/getPostProcessKernelSize';
import './CreateProductsStep2Client.css';

const START_YEAR = 2020;
const SLIDER_MAX = 48; //4 years * 12 months = 48 (Jan 2020 to Jan 2024)

/**
 * Convert a date into a slider index (months since START_YEAR).
 * @param {Date | string | null | undefined} date - Source date value.
 * @returns {number} Slider index in the 0...SLIDER_MAX range.
 */
const getSliderValueFromDate = (date: Date | string | null | undefined): number => {
	if (!date) return 0;
	const tmpDate = new Date(date);
	const months = (tmpDate.getFullYear() - START_YEAR) * 12 + tmpDate.getMonth();
	return Math.max(0, Math.min(months, SLIDER_MAX));
};

/**
 * Convert a slider index back to a Date.
 * @param {number} sliderVal - Slider index in months since START_YEAR.
 * @param {boolean} isEnd - When true, return last day of month; otherwise first day.
 * @returns {Date} Normalized date corresponding to the slider position.
 */
const getDateFromSliderValue = (sliderVal: number, isEnd = false) => {
	const year = START_YEAR + Math.floor(sliderVal / 12);
	const month = sliderVal % 12;
	if (isEnd) {
		return new Date(year, month + 1, 0);
	}
	return new Date(year, month, 1);
};

/**
 * Format a YYYY-MM string into a human-readable month/year label.
 * @param {string} dateStr - Date in YYYY-MM format.
 * @returns {string} Formatted label, e.g. "January 2021".
 */
const formatPeriodDate = (dateStr: string) => {
	const [year, month] = dateStr.split('-').map(Number);
	// Create date in local time for consistent display.
	const date = new Date(year, month - 1);
	return date.toLocaleString('en-US', {month: 'long', year: 'numeric'});
};

/**
 * Build a suggested period label from start and end values.
 * @param {string} start - Start date in YYYY-MM format.
 * @param {string} end - End date in YYYY-MM format.
 * @returns {string} Combined label, e.g. "January 2021/December 2021".
 */
const formatPeriodLabel = (start: string, end: string) => {
	return `${formatPeriodDate(start)}/${formatPeriodDate(end)}`;
};

/**
 * Convert a Date to the first day of that month (YYYY-MM-01).
 * @param {Date | null} date - Source date value.
 * @returns {string} Formatted date or "-" if undefined.
 */
const formatToFirstOfMonth = (date: Date | null) => {
	if (!date) return '-';
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	return `${year}-${month}-01`;
};

/**
 * Convert a date string to the last day of that month (YYYY-MM-DD).
 * @param {string | null | undefined} dateStr - Source date string.
 * @returns {string} Formatted date or "-" if invalid.
 */
const formatToEndOfMonth = (dateStr: string | null | undefined) => {
	if (!dateStr) return '-';
	const date = new Date(dateStr);
	// Check if date is valid.
	if (isNaN(date.getTime())) return '-';

	const year = date.getFullYear();
	const month = date.getMonth();
	const lastDay = new Date(year, month + 1, 0); // 0th day of next month is last day of current.

	const y = lastDay.getFullYear();
	const m = String(lastDay.getMonth() + 1).padStart(2, '0');
	const d = String(lastDay.getDate()).padStart(2, '0');
	return `${y}-${m}-${d}`;
};

/**
 * Component representing the second step in the "Create Custom Products" process.
 *
 * This step allows users to define the bounding box, select the processing period,
 * choose output file format, and create a process.
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
	 * Local start date used for slider-based range selection.
	 * @type {Date | null}
	 */
	const [startDate, setStartDate] = useState<Date | null>(null);
	/**
	 * Suggested periods returned by the backend for the selected extent.
	 * @type {Array<{ id: string; startDate: string; endDate: string }>}
	 */
	const [suggestedPeriods, setSuggestedPeriods] = useState<
		Array<{ id: string; startDate: string; endDate: string }>
	>([]);
	/**
	 * Currently selected suggested period id.
	 * @type {string | null}
	 */
	const [selectedPeriodId, setSelectedPeriodId] = useState<string | null>(null);

	const isCropType = product === customProductsProductTypes.cropType;

	/**
	 * Determines whether the next step is disabled based on the current state.
	 * @type {boolean}
	 */
	const nextStepDisabled = !bboxIsInBounds || !bbox || !model || !product || !outputFileFormat || !endDate;

	// Fetch suggested periods when bbox changes.
	const suggestedPeriodsApiUrl = '/api/jobs/get/periods';
	const [debouncedBbox, setDebouncedBbox] = useState<string | null>(null);

	useEffect(() => {
		if (bbox && bboxIsInBounds && isCropType) {
			// Debounce bbox changes to avoid excessive calls while drawing.
			const timer = setTimeout(() => {
				setDebouncedBbox(bbox.join(','));
			}, 500);
			return () => clearTimeout(timer);
		} else {
			setDebouncedBbox(null);
			setSuggestedPeriods([]);
			setSelectedPeriodId(null);
		}
	}, [bbox, bboxIsInBounds, isCropType]);

	const {data: periodsData} = useSWR(
		debouncedBbox ? [suggestedPeriodsApiUrl, debouncedBbox] : null,
		() => apiFetcher(suggestedPeriodsApiUrl, `bbox=${debouncedBbox}`)
	);

	useEffect(() => {
		if (periodsData) {
			setSuggestedPeriods(periodsData);
		}
	}, [periodsData]);

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

				// Default start date could be 1 year prior if needed, but keeping null requires user selection or default logic
				// If we want to pre-fill 12 months prior:
				const endD = new Date(defaultEndDate);
				const startD = new Date(endD);
				startD.setFullYear(endD.getFullYear() - 1);
				setStartDate(startD);
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

	const onSuggestedPeriodChange = (value: string) => {
		const period = suggestedPeriods.find((p) => p.id === value);
		if (period) {
			setSelectedPeriodId(value);
			// startDate: YYYY-MM -> YYYY-MM-01
			const [startYear, startMonth] = period.startDate.split('-').map(Number);
			const newStartDate = new Date(startYear, startMonth - 1, 1);
			setStartDate(newStartDate);

			// endDate: YYYY-MM -> Last day of month
			const [endYear, endMonth] = period.endDate.split('-').map(Number);
			const newEndDate = new Date(endYear, endMonth, 0); // 0th day of next month is last day of current month

			const endDateStr = newEndDate.toISOString().split('T')[0] as CreateCustomProductsEndDateModel;
			setEndDate(endDateStr);
		}
	};

	const onSliderChange = ([startVal, endVal]: [number, number]) => {
		// Manual slider change overrides suggested period selection.
		setSelectedPeriodId(null);

		// Clamp endVal to 47 (Dec 2023) because we shouldn't enter 2024.
		let newEndVal = endVal;
		if (newEndVal > 47) newEndVal = 47;

		// Ensure minRange of 1 month is maintained after clamping.
		let newStartVal = startVal;
		if (newEndVal - newStartVal < 1) {
			newStartVal = Math.max(0, newEndVal - 1);
		}

		const newStart = getDateFromSliderValue(newStartVal);
		const newEnd = getDateFromSliderValue(newEndVal, true);

		setStartDate(newStart);
		const endDateStr = newEnd.toISOString().split('T')[0] as CreateCustomProductsEndDateModel;
		setEndDate(endDateStr);

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
		startDate: startDate ? startDate.toISOString().split('T')[0] : '',

	};

	if (product === customProductsProductTypes.cropType) {
		// Include extra Crop Type options when available.
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
	const {data, isLoading} = useSWR(shouldFetch ? [apiUrl, urlParams.toString()] : null, () =>
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
						leftSection={<IconArrowLeft size={14}/>}
					>
						Back
					</Button>
					<Button
						leftSection={<IconCheck size={14}/>}
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
					{!isCropType ? (
						<>
							<div>
								<FormLabel>Select season of interest</FormLabel>
								<div>
									<TextDescription>
										Define the end month of your processing period. The default length of the period
										is 12 months.
									</TextDescription>
									<TextDescription>
										To guide your decision concerning the processing period, you can consult
										the{' '}
										<TextLink url="https://ipad.fas.usda.gov/ogamaps/cropcalendar.aspx">USDA crop
											calendars</TextLink>
									</TextDescription>
								</div>
							</div>
							<div style={{width: '20rem'}}>
								<SelectMonth
									label="Ending month"
									disabled={false}
									value={endDate}
									minDate={new Date(customProductsDateLimits.min)}
									maxDate={new Date(customProductsDateLimits.max)}
									onChange={setEndDate}
								/>
							</div>
						</>
					) : (
						<>
							<div>
								<FormLabel>Pick a suggested period</FormLabel>
								<TextDescription>Select a predefined period based on the area of
									interest.</TextDescription>
								{suggestedPeriods.length > 0 ? (
									<Radio.Group
										value={selectedPeriodId}
										onChange={onSuggestedPeriodChange}
										name="suggestedPeriod"
										style={{marginTop: '0.5rem'}}
									>
										<Stack gap="xs">
											{suggestedPeriods.map((period) => (
												<Radio
													key={period.id}
													value={period.id}
													label={formatPeriodLabel(period.startDate, period.endDate)}
												/>
											))}
										</Stack>
									</Radio.Group>
								) : (
									<TextDescription color="dimmed">
										{bbox ? 'Loading suggested periods...' : 'Please draw an extent first.'}
									</TextDescription>
								)}
							</div>

							<div style={{width: '100%'}}>
								<FormLabel>Adjust the date range</FormLabel>
								<div>
									<TextDescription>
										Select a period between 2020 and 2024. Min 1 month, Max 12 months.
									</TextDescription>

									<Box p="lg" bg="#1A1A1A" style={{borderRadius: '8px', marginTop: '0.5rem'}}>
										<RangeSlider
											min={0}
											max={SLIDER_MAX}
											step={1}
											minRange={1}
											maxRange={11}
											marks={[
												{value: 0, label: '2020'},
												{value: 12, label: '2021'},
												{value: 24, label: '2022'},
												{value: 36, label: '2023'},
												{value: 48, label: '2024'},
											]}
											value={[getSliderValueFromDate(startDate), getSliderValueFromDate(endDate)]}
											onChange={onSliderChange}
											classNames={{
												root: 'step2-slider-root',
												track: 'step2-slider-track',
												bar: 'step2-slider-bar',
												thumb: 'step2-slider-thumb',
												mark: 'step2-slider-mark',
												markLabel: 'step2-slider-mark-label',
												label: 'step2-slider-label',
											}}
											labelAlwaysOn
											label={(value) => {
												const date = getDateFromSliderValue(value);
												const text = date.toLocaleString('en-US', {month: 'short'});
												return (
													<div className="step2-thumb-label">
														{text}
														<div className="step2-thumb-label-arrow"/>
													</div>
												);
											}}
										/>
									</Box>

									{(startDate || endDate) && (
										<Stack gap={2} mt="xs">
											<TextDescription>
												Selected start date: <b>{formatToFirstOfMonth(startDate)}</b>
											</TextDescription>
											<TextDescription>
												Selected end date: <b>{formatToEndOfMonth(endDate)}</b>
											</TextDescription>
										</Stack>
									)}
								</div>
							</div>
						</>
					)}
					<div style={{width: '100%'}}>
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
