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
	customProductsPostprocessMethods,
	customProductsProductTypes,
} from '@features/(processes)/_constants/app';
import formParams from '@features/(processes)/_constants/generate-custom-products/formParams';
import { apiFetcher } from '@features/(shared)/_url/apiFetcher';
import { getOutputFileFormat_customProducts } from '@features/state/selectors/createCustomProducts/getOutputFileFormat';
import { getBBox_customProducts } from '@features/state/selectors/createCustomProducts/getBBox';
import { getBackgroundLayer_customProducts } from '@features/state/selectors/createCustomProducts/getBackgroundLayer';
import { getModel_customProducts } from '@features/state/selectors/createCustomProducts/getModel';
import { getProduct_customProducts } from '@features/state/selectors/createCustomProducts/getProduct';
import { getEndDate_customProducts } from '@features/state/selectors/createCustomProducts/getEndDate';
import { getOrbitState_customProducts } from '@features/state/selectors/createCustomProducts/getOrbitState';
import { getPostProcessMethod_customProducts } from '@features/state/selectors/createCustomProducts/getPostProcessMethod';
import { getPostProcessKernelSize_customProducts } from '@features/state/selectors/createCustomProducts/getPostProcessKernelSize';
import './CreateProductsStep2Client.css';

const START_YEAR = 2018;
const CURRENT_YEAR = new Date().getFullYear();
const SLIDER_MAX = (CURRENT_YEAR - START_YEAR) * 12; // months from START_YEAR to current year

// Number of years visible in the focused slider
const YEAR_WINDOW_SIZE = 3; // 3 years window

// Generate marks for year navigation slider (show every other year for visibility)
const generateYearMarks = () => {
	const marks = [];
	for (let year = START_YEAR; year <= CURRENT_YEAR; year++) {
		// Show label every other year, but include all marks for stepping
		const label = (year - START_YEAR) % 2 === 0 ? year.toString() : '';
		marks.push({ value: year - START_YEAR, label });
	}
	return marks;
};

const getMaxYearWindow = () => CURRENT_YEAR - START_YEAR - YEAR_WINDOW_SIZE + 1;

// Generate marks for focused month slider - 24 marks representing the 3-year window
const generateMonthMarks = (yearWindowStart: number) => {
	const marks = [];
	const startYear = START_YEAR + yearWindowStart;
	marks.push({ value: 0, label: startYear.toString() });
	marks.push({ value: 12, label: (startYear + 1).toString() });
	marks.push({ value: 24, label: (startYear + 2).toString() });
	return marks;
};

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
	return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
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
	 * State for year window selection (year navigator).
	 * Value is the starting year index (0 = START_YEAR, 1 = START_YEAR+1, etc.)
	 * Default to middle of available range
	 * @type {number}
	 */
	const [yearWindow, setYearWindow] = useState<number>(() => {
		// Start at middle of available years
		const maxYear = CURRENT_YEAR - START_YEAR - YEAR_WINDOW_SIZE + 1;
		return Math.floor(maxYear / 2);
	});
	/**
	 * Suggested periods returned by the backend for the selected extent.
	 * @type {Array<{ id: string; startDate: string; endDate: string }>}
	 */
	const [suggestedPeriods, setSuggestedPeriods] = useState<Array<{ id: string; startDate: string; endDate: string }>>(
		[]
	);
	/**
	 * Currently selected suggested period id.
	 * @type {string | null}
	 */
	const [selectedPeriodId, setSelectedPeriodId] = useState<string | null>(null);

	/**
	 * Slider values when a suggested period is selected.
	 * These override the calculated values from startDate/endDate.
	 * @type {number[] | null}
	 */
	const [suggestedPeriodSliderValues, setSuggestedPeriodSliderValues] = useState<number[] | null>(null);

	const isCropType = product === customProductsProductTypes.cropType;

	/**
	 * Determines whether the next step is disabled based on the current state.
	 * @type {boolean}
	 */
	const nextStepDisabled = !bboxIsInBounds || !bbox || !model || !product || !outputFileFormat || !endDate;

	// Fetch suggested periods when bbox changes.
	const suggestedPeriodsApiUrl = '/api/seasons/get';
	const [debouncedBbox, setDebouncedBbox] = useState<string | null>(null);

	useEffect(() => {
		if (bbox && bboxIsInBounds) {
			// Deselect period when bbox changes to a new extent
			setSelectedPeriodId(null);
			setSuggestedPeriodSliderValues(null);

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
	}, [bbox, bboxIsInBounds]);

	const { data: periodsData } = useSWR(debouncedBbox ? [suggestedPeriodsApiUrl, debouncedBbox] : null, () =>
		apiFetcher(suggestedPeriodsApiUrl, `bbox=${debouncedBbox}`)
	);

	useEffect(() => {
		if (periodsData) {
			setSuggestedPeriods(periodsData);
			// Clear selected period when new suggestions are loaded,
			// unless the current selection is still valid
			if (selectedPeriodId && !periodsData.find((p: { id: string }) => p.id === selectedPeriodId)) {
				setSelectedPeriodId(null);
				setSuggestedPeriodSliderValues(null);
			}
		}
	}, [periodsData, selectedPeriodId]);

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

			// endDate: YYYY-MM -> Last day of month (original behavior)
			const [endYear, endMonth] = period.endDate.split('-').map(Number);
			const newEndDate = new Date(endYear, endMonth, 0); // Last day of end month

			// Update yearWindow to position the slider correctly for the selected period.
			// Calculate the year index relative to START_YEAR.
			const periodYear = startYear - START_YEAR;
			// Clamp to valid range (max yearWindow allows yearWindow + YEAR_WINDOW_SIZE to not exceed max year)
			const maxYearWindow = getMaxYearWindow();
			const newYearWindow = Math.max(0, Math.min(periodYear, maxYearWindow));

			// Calculate slider-relative values: convert absolute months to year-window-relative position
			// The slider shows months within the 3-year window starting at yearWindow
			// Position = absolute_month - yearWindow_start_month
			const absoluteStartMonth = getSliderValueFromDate(newStartDate);
			const absoluteEndMonth = getSliderValueFromDate(newEndDate);
			const yearWindowStartMonth = newYearWindow * 12;

			const sliderStartValue = Math.max(0, Math.min(monthSliderMax, absoluteStartMonth - yearWindowStartMonth));
			const sliderEndValue = Math.max(0, Math.min(monthSliderMax, absoluteEndMonth - yearWindowStartMonth));

			setSuggestedPeriodSliderValues([sliderStartValue, sliderEndValue]);

			// Set the dates and yearWindow
			setStartDate(newStartDate);
			const endDateStr = newEndDate.toISOString().split('T')[0] as CreateCustomProductsEndDateModel;
			setEndDate(endDateStr);
			setYearWindow(newYearWindow);
		}
	};

	const MIN_MONTHS = 3; // 3 months minimum
	const minSliderRange = isCropType ? 3 : 11; // 3 for crop type (min 3 months), 11 for crop land (exactly 12 months)

	// Bottom slider: 24 marks representing the 3-year window (0 = start, 12 = middle, 24 = end)
	const monthSliderMax = 24;

	const handleSliderChange = ([startVal, endVal]: [number, number]) => {
		setSelectedPeriodId(null);
		setSuggestedPeriodSliderValues(null); // Clear the suggested period override

		// Ensure minimum months based on product type
		let newStartVal = startVal;
		let newEndVal = endVal;
		if (newEndVal - newStartVal < minSliderRange) {
			newStartVal = Math.max(0, newEndVal - minSliderRange);
		}

		const finalStartMonth = yearWindow * 12 + newStartVal;
		const finalEndMonth = yearWindow * 12 + newEndVal;

		const newStart = getDateFromSliderValue(finalStartMonth);
		const newEnd = getDateFromSliderValue(finalEndMonth, true);

		setStartDate(newStart);
		const endDateStr = newEnd.toISOString().split('T')[0] as CreateCustomProductsEndDateModel;
		setEndDate(endDateStr);
	};

	// Sync dates on first load - set to 12-month window centered on mark 12
	const isFirstRender = React.useRef(true);
	const prevYearWindow = React.useRef(yearWindow);

	useEffect(() => {
		// Skip this effect when a suggested period is selected - the dates are already set correctly
		if (selectedPeriodId) {
			prevYearWindow.current = yearWindow;
			return;
		}

		if (isFirstRender.current) {
			isFirstRender.current = false;
			// Bottom slider range is 0-24, 12-month window centered on mark 12
			// Jul-Jun = 12 months (start at 6, end at 17)
			const sliderStart = 6;
			const sliderEnd = 17;

			const windowStartMonth = yearWindow * 12 + sliderStart;
			const windowEndMonth = yearWindow * 12 + sliderEnd;

			const newStart = getDateFromSliderValue(windowStartMonth);
			const newEnd = getDateFromSliderValue(windowEndMonth, true);

			setStartDate(newStart);
			const endDateStr = newEnd.toISOString().split('T')[0] as CreateCustomProductsEndDateModel;
			setEndDate(endDateStr);
		} else if (prevYearWindow.current !== yearWindow && startDate && endDate) {
			// Year window changed - shift dates to maintain same slider positions
			const oldYearWindow = prevYearWindow.current;

			// Calculate current slider positions
			const oldStartSliderPos = getSliderValueFromDate(startDate) - oldYearWindow * 12;
			const oldEndSliderPos = getSliderValueFromDate(endDate) - oldYearWindow * 12;

			// Calculate new absolute month positions
			const newStartMonth = yearWindow * 12 + oldStartSliderPos;
			const newEndMonth = yearWindow * 12 + oldEndSliderPos;

			// Clamp to valid range
			const clampedStartMonth = Math.max(0, Math.min(newStartMonth, SLIDER_MAX));
			const clampedEndMonth = Math.max(0, Math.min(newEndMonth, SLIDER_MAX));

			const newStart = getDateFromSliderValue(clampedStartMonth);
			const newEnd = getDateFromSliderValue(clampedEndMonth, true);

			setStartDate(newStart);
			const endDateStr = newEnd.toISOString().split('T')[0] as CreateCustomProductsEndDateModel;
			setEndDate(endDateStr);
		}

		prevYearWindow.current = yearWindow;
	}, [yearWindow]);

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
						<FormLabel>Pick a suggested period</FormLabel>
						<TextDescription>Select a predefined period based on the area of interest.</TextDescription>
						{suggestedPeriods.length > 0 ? (
							<Radio.Group
								value={selectedPeriodId}
								onChange={onSuggestedPeriodChange}
								name="suggestedPeriod"
								style={{ marginTop: '0.5rem' }}
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

					<div style={{ width: '100%' }}>
						<FormLabel>Adjust the date range</FormLabel>
						<div>
							<TextDescription>
								Select a period between 2018 and {CURRENT_YEAR}.{' '}
								{isCropType ? 'Min 3 months, Max 12 months.' : 'Exactly 12 months.'}
							</TextDescription>

							<Box p="lg" pt={60} bg="#1A1A1A" style={{ borderRadius: '8px', marginTop: '0.5rem' }}>
								{/* Year Navigator Slider */}
								<Box mb="xl">
									<RangeSlider
										min={0}
										max={CURRENT_YEAR - START_YEAR}
										step={1}
										value={[yearWindow, yearWindow + YEAR_WINDOW_SIZE - 1]}
										onChange={(val) => {
											if (Array.isArray(val)) {
												const maxVal = getMaxYearWindow();
												// Calculate which thumb moved more
												const prevStart = yearWindow;
												const prevEnd = yearWindow + YEAR_WINDOW_SIZE - 1;
												const startDiff = Math.abs(val[0] - prevStart);
												const endDiff = Math.abs(val[1] - prevEnd);

												let newStart: number;
												if (startDiff >= endDiff) {
													// Left thumb moved more or equal - use its position
													newStart = Math.max(0, Math.min(val[0], maxVal));
												} else {
													// Right thumb moved more - derive start from end
													newStart = Math.max(0, Math.min(val[1] - YEAR_WINDOW_SIZE + 1, maxVal));
												}
												// Deselect suggested period when year window changes
												if (selectedPeriodId) {
													setSelectedPeriodId(null);
													setSuggestedPeriodSliderValues(null);
												}
												setYearWindow(newStart);
											}
										}}
										classNames={{
											root: 'step2-slider-root',
											track: 'step2-slider-track',
											bar: 'step2-slider-bar',
											thumb: 'step2-slider-thumb',
											mark: 'step2-slider-mark',
											markLabel: 'step2-slider-mark-label',
											label: 'step2-slider-label',
										}}
										label={(value) => {
											const year = START_YEAR + value;
											return (
												<div className="step2-thumb-label">
													{year}
													<div className="step2-thumb-label-arrow" />
												</div>
											);
										}}
										labelAlwaysOn
										restrictToMarks
										marks={generateYearMarks()}
									/>
								</Box>

								{/* Month Range Slider */}
								<Box pt={20} mt={40}>
									<RangeSlider
										min={0}
										max={monthSliderMax}
										step={1}
										minRange={isCropType ? 3 : 11}
										maxRange={11}
										marks={generateMonthMarks(yearWindow)}
										value={
											(suggestedPeriodSliderValues as [number, number] | undefined) ||
											([
												startDate
													? Math.min(monthSliderMax, Math.max(0, getSliderValueFromDate(startDate) - yearWindow * 12))
													: 0,
												endDate
													? Math.min(monthSliderMax, Math.max(0, getSliderValueFromDate(endDate) - yearWindow * 12))
													: 0,
											] as [number, number])
										}
										onChange={handleSliderChange}
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
											const date = new Date(START_YEAR, yearWindow * 12 + value);
											const text = date.toLocaleString('en-US', { month: 'short' });
											return (
												<div className="step2-thumb-label">
													{text}
													<div className="step2-thumb-label-arrow" />
												</div>
											);
										}}
									/>
								</Box>
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
