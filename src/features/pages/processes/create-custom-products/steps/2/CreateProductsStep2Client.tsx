'use client';
import useSWR from 'swr';
import { Checkbox, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconArrowLeft, IconCheck } from '@tabler/icons-react';
import { WorldCerealStateActionType } from '@features/state/state.actionTypes';
import { useSharedState } from '@gisatcz/ptr-fe-core/client';
import {
	CreateCustomProductsBackgroundLayerModel,
	CreateCustomProductsBBoxModel,
	CreateCustomProductsEndDateModel,
	CreateCustomProductsPostprocessMethodCroplandModel,
	WorldCerealState,
} from '@features/state/state.models';
import { OneOfWorldCerealActions } from '@features/state/state.actions';
import TwoColumns, { Column } from '@features/(shared)/_layout/_components/Content/TwoColumns';
import { SectionContainer } from '@features/(shared)/_layout/_components/Content/SectionContainer';

import { Button, Group, NumberInput, Select, Stack, Radio, RangeSlider, Box, TextInput, Input } from '@mantine/core';
import FormLabel from '@features/(shared)/_layout/_components/Content/FormLabel';
import { TextDescription } from '@features/(shared)/_layout/_components/Content/TextDescription';
import { MapBBox } from '@features/(shared)/_components/map/MapBBox';
import {
	bboxSizeLimits,
	customProductsPostprocessMethods,
	customProductsProductTypes,
} from '@features/(processes)/_constants/app';
import { transformDate } from '@features/(processes)/_utils/transformDate';
import formParams from '@features/(processes)/_constants/generate-custom-products/formParams';
import { apiFetcher } from '@features/(shared)/_url/apiFetcher';
import { getBBox_customProducts } from '@features/state/selectors/createCustomProducts/getBBox';
import { getBackgroundLayer_customProducts } from '@features/state/selectors/createCustomProducts/getBackgroundLayer';
import { getModel_customProducts } from '@features/state/selectors/createCustomProducts/getModel';
import { getProduct_customProducts } from '@features/state/selectors/createCustomProducts/getProduct';
import { getEndDate_customProducts } from '@features/state/selectors/createCustomProducts/getEndDate';
import { getOrbitState_customProducts } from '@features/state/selectors/createCustomProducts/getOrbitState';
import { getPostProcessMethod_customProducts } from '@features/state/selectors/createCustomProducts/getPostProcessMethod';
import { getPostProcessKernelSize_customProducts } from '@features/state/selectors/createCustomProducts/getPostProcessKernelSize';
import { getEnableCroplandHead_customProducts } from '@features/state/selectors/createCustomProducts/getEnableCroplandHead';
import { getSeasonalModelZip_customProducts } from '@features/state/selectors/createCustomProducts/getSeasonalModelZip';
import { getLandcoverHeadZip_customProducts } from '@features/state/selectors/createCustomProducts/getLandcoverHeadZip';
import { getCroptypeHeadZip_customProducts } from '@features/state/selectors/createCustomProducts/getCroptypeHeadZip';
import { getMaskCropland_customProducts } from '@features/state/selectors/createCustomProducts/getMaskCropland';
import { getPostprocessMethodCropland_customProducts } from '@features/state/selectors/createCustomProducts/getPostprocessMethodCropland';
import { getPostprocessKernelSizeCropland_customProducts } from '@features/state/selectors/createCustomProducts/getPostprocessKernelSizeCropland';
import './CreateProductsStep2Client.css';

const START_YEAR = 2018;
const CURRENT_YEAR = new Date().getFullYear();
const SLIDER_MAX = (CURRENT_YEAR - START_YEAR) * 12; // months from START_YEAR to current year

// Constraints for the season length (expressed as the index difference between thumbs).
// A difference of N covers (N + 1) months.
const CROP_TYPE_MIN_DIFF = 2; // 3 months
const CROP_TYPE_MAX_DIFF = 11; // 12 months
const CROP_EXTENT_DIFF = 11; // exactly 12 months

// Default selection: a recent 12-month window.
const DEFAULT_END_IDX = SLIDER_MAX - 6;
const DEFAULT_START_IDX = Math.max(0, DEFAULT_END_IDX - CROP_EXTENT_DIFF);

/**
 * Generate marks for the full-range date slider (one mark per year, labelled every other year).
 */
const generateFullRangeMarks = () => {
	const marks = [];
	for (let year = START_YEAR; year <= CURRENT_YEAR; year++) {
		const idx = (year - START_YEAR) * 12;
		const label = (year - START_YEAR) % 2 === 0 ? year.toString() : '';
		marks.push({ value: idx, label });
	}
	return marks;
};

/**
 * Convert a date into a slider index (months since START_YEAR).
 */
const getSliderValueFromDate = (date: Date | string | null | undefined): number => {
	if (!date) return 0;
	const tmpDate = new Date(date);
	const months = (tmpDate.getFullYear() - START_YEAR) * 12 + tmpDate.getMonth();
	return Math.max(0, Math.min(months, SLIDER_MAX));
};

/**
 * Convert a slider index back to a Date.
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
 */
const formatPeriodDate = (dateStr: string) => {
	const [year, month] = dateStr.split('-').map(Number);
	const date = new Date(year, month - 1);
	return date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
};

/**
 * Build a suggested period label from start and end values.
 */
const formatPeriodLabel = (start: string, end: string) => {
	return `${formatPeriodDate(start)} / ${formatPeriodDate(end)}`;
};

/**
 * Convert a Date to the first day of that month (YYYY-MM-01).
 */
const formatToFirstOfMonth = (date: Date | null) => {
	if (!date) return '-';
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	return `${year}-${month}-01`;
};

/**
 * Convert a date string to the last day of that month (YYYY-MM-DD).
 */
const formatToEndOfMonth = (dateStr: string | null | undefined) => {
	if (!dateStr) return '-';
	const date = new Date(dateStr);
	if (isNaN(date.getTime())) return '-';

	const year = date.getFullYear();
	const month = date.getMonth();
	const lastDay = new Date(year, month + 1, 0);

	const y = lastDay.getFullYear();
	const m = String(lastDay.getMonth() + 1).padStart(2, '0');
	const d = String(lastDay.getDate()).padStart(2, '0');
	return `${y}-${m}-${d}`;
};

/**
 * Component representing the second step in the "Create Custom Products" process.
 */
export default function CreateProductsStep2Client() {
	const apiUrl = '/api/jobs/create/from-process';
	const router = useRouter();
	const [state, dispatch] = useSharedState<WorldCerealState, OneOfWorldCerealActions>();

	const [bboxIsInBounds, setBboxIsInBounds] = useState<boolean | null>(null);
	const [bboxDescription, setBboxDescription] = useState<string | string[] | null>(null);
	const [shouldFetch, setShouldFetch] = useState(false);
	const [processError, setProcessError] = useState<string | null>(null);

	const bbox = getBBox_customProducts(state);
	const backgroundLayer = getBackgroundLayer_customProducts(state);
	const model = getModel_customProducts(state);
	const product = getProduct_customProducts(state);
	const endDate = getEndDate_customProducts(state);
	const orbitState = getOrbitState_customProducts(state);
	// Croptype postprocess (reuse existing fields)
	const postprocessMethod = getPostProcessMethod_customProducts(state);
	const postprocessKernelSize = getPostProcessKernelSize_customProducts(state);
	// New fields
	const enableCroplandHead = getEnableCroplandHead_customProducts(state);
	const seasonalModelZip = getSeasonalModelZip_customProducts(state);
	const landcoverHeadZip = getLandcoverHeadZip_customProducts(state);
	const croptypeHeadZip = getCroptypeHeadZip_customProducts(state);
	const maskCropland = getMaskCropland_customProducts(state);
	const postprocessMethodCropland = getPostprocessMethodCropland_customProducts(state);
	const postprocessKernelSizeCropland = getPostprocessKernelSizeCropland_customProducts(state);

	const [startDate, setStartDate] = useState<Date | null>(null);
	const [customSeasonId, setCustomSeasonId] = useState<string>('');

	const [suggestedPeriods, setSuggestedPeriods] = useState<Array<{ id: string; startDate: string; endDate: string }>>(
		[]
	);
	const [selectedPeriodId, setSelectedPeriodId] = useState<string | null>(null);

	const isCropType = product === customProductsProductTypes.cropType;
	const isCropExtent = product === customProductsProductTypes.cropExtent;

	// Kernel size validation helpers
	const isCroplandKernelValid =
		postprocessMethodCropland !== customProductsPostprocessMethods.majorityVote ||
		(typeof postprocessKernelSizeCropland === 'number' &&
			postprocessKernelSizeCropland >= 1 &&
			postprocessKernelSizeCropland <= 25 &&
			postprocessKernelSizeCropland % 2 === 1);

	const isCroptypeKernelValid =
		postprocessMethod !== customProductsPostprocessMethods.majorityVote ||
		(typeof postprocessKernelSize === 'number' &&
			postprocessKernelSize >= 1 &&
			postprocessKernelSize <= 25 &&
			postprocessKernelSize % 2 === 1);

	const isCropExtentKernelValid =
		postprocessMethodCropland !== customProductsPostprocessMethods.majorityVote ||
		(typeof postprocessKernelSizeCropland === 'number' &&
			postprocessKernelSizeCropland >= 3 &&
			postprocessKernelSizeCropland <= 25 &&
			postprocessKernelSizeCropland % 2 === 1);

	const nextStepDisabled =
		!bboxIsInBounds ||
		!bbox ||
		!model ||
		!product ||
		!startDate ||
		!endDate ||
		(isCropType && (!orbitState || !isCroplandKernelValid || !isCroptypeKernelValid)) ||
		(isCropExtent && !isCropExtentKernelValid);

	// Fetch suggested periods when bbox changes.
	const suggestedPeriodsApiUrl = '/api/seasons/get';
	const [debouncedBbox, setDebouncedBbox] = useState<string | null>(null);

	useEffect(() => {
		if (bbox && bboxIsInBounds) {
			setSelectedPeriodId(null);
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

	const { data: periodsData } = useSWR(debouncedBbox ? [suggestedPeriodsApiUrl, debouncedBbox] : null, () => {
		return apiFetcher(suggestedPeriodsApiUrl, undefined, 'POST', {
			bbox: bbox,
			epsg: 4326,
		});
	});

	useEffect(() => {
		if (periodsData) {
			setSuggestedPeriods(periodsData);
			if (selectedPeriodId && !periodsData.find((p: { id: string }) => p.id === selectedPeriodId)) {
				setSelectedPeriodId(null);
			}
		}
	}, [periodsData, selectedPeriodId]);

	useEffect(() => {
		dispatch({
			type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_ACTIVE_STEP,
			payload: 2,
		});

		// Initialize default season selection (a recent 12-month window).
		if (!startDate || !endDate) {
			setStartDate(getDateFromSliderValue(DEFAULT_START_IDX));
			const endDateStr = transformDate(getDateFromSliderValue(DEFAULT_END_IDX, true)) as CreateCustomProductsEndDateModel;
			setEndDate(endDateStr);
		}

		// Initialize new field defaults
		if (!orbitState && isCropType) {
			dispatch({
				type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_ORBIT_STATE,
				payload: 'DESCENDING',
			});
		}
		if (!postprocessMethod) {
			dispatch({
				type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_POSTPROCESS_METHOD,
				payload: 'majority_vote',
			});
		}
		if (postprocessKernelSize === undefined) {
			dispatch({
				type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_POSTPROCESS_KERNEL_SIZE,
				payload: 5,
			});
		}
		if (!postprocessMethodCropland) {
			dispatch({
				type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_POSTPROCESS_METHOD_CROPLAND,
				payload: 'majority_vote',
			});
		}
		if (postprocessKernelSizeCropland === undefined) {
			dispatch({
				type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_POSTPROCESS_KERNEL_SIZE_CROPLAND,
				payload: 3,
			});
		}
		if (maskCropland === undefined) {
			dispatch({
				type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_MASK_CROPLAND,
				payload: true,
			});
		}
	}, []);

	const setBackgroundLayer = (value: CreateCustomProductsBackgroundLayerModel) => {
		if (value) {
			dispatch({
				type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_BACKGROUND_LAYER,
				payload: value,
			});
		}
	};

	const setBBoxExtent = (extent: CreateCustomProductsBBoxModel | null) => {
		dispatch({
			type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_BBOX,
			payload: extent ?? undefined,
		});
	};

	const setEndDate = (value: CreateCustomProductsEndDateModel | null) => {
		dispatch({
			type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_END_DATE,
			payload: value ?? undefined,
		});
	};

	const onSuggestedPeriodChange = (value: string) => {
		const period = suggestedPeriods.find((p) => p.id === value);
		if (!period) return;

		setSelectedPeriodId(value);

		const [startYear, startMonth] = period.startDate.split('-').map(Number);
		const [endYear, endMonth] = period.endDate.split('-').map(Number);

		let startIdx = (startYear - START_YEAR) * 12 + (startMonth - 1);
		const endIdx = Math.min(SLIDER_MAX, (endYear - START_YEAR) * 12 + (endMonth - 1));
		const diff = endIdx - startIdx;

		if (!isCropType) {
			// Cropland Extent: exactly 12 months.
			startIdx = endIdx - CROP_EXTENT_DIFF;
		} else {
			// Crop Type: between 3 and 12 months.
			if (diff > CROP_TYPE_MAX_DIFF) startIdx = endIdx - CROP_TYPE_MAX_DIFF;
			else if (diff < CROP_TYPE_MIN_DIFF) startIdx = endIdx - CROP_TYPE_MIN_DIFF;
		}
		startIdx = Math.max(0, startIdx);

		setStartDate(getDateFromSliderValue(startIdx));
		const endDateStr = transformDate(getDateFromSliderValue(endIdx, true)) as CreateCustomProductsEndDateModel;
		setEndDate(endDateStr);
	};

	const handleDateRangeChange = (values: number[]) => {
		if (!Array.isArray(values)) return;
		const [startIdx, endIdx] = values;

		setSelectedPeriodId(null);
		setStartDate(getDateFromSliderValue(startIdx));
		const endDateStr = transformDate(getDateFromSliderValue(endIdx, true)) as CreateCustomProductsEndDateModel;
		setEndDate(endDateStr);
	};

	// For Custom model: the actual model is seasonalModelZip (Base Model URL) if provided.
	// Otherwise, fall back to 'default'.
	const resolvedModel = seasonalModelZip ? seasonalModelZip : (model?.toString() || '');

	const seasonStartDate = startDate ? transformDate(startDate) : null;
	const seasonEndDate = endDate ? endDate.toString() : null;

	const selectedPeriod = selectedPeriodId ? suggestedPeriods.find((period) => period.id === selectedPeriodId) : null;
	const generatedSeasonId =
		selectedPeriod?.id ??
		(seasonStartDate && seasonEndDate
			? `season_${seasonStartDate.replaceAll('-', '_')}_${seasonEndDate.replaceAll('-', '_')}`
			: '');

	// Sync local state with generated season ID
	useEffect(() => {
		if (generatedSeasonId) {
			setCustomSeasonId(generatedSeasonId);
		}
	}, [generatedSeasonId]);

	// Current slider value derived from the selected dates.
	const sliderValue: [number, number] = [
		startDate ? getSliderValueFromDate(startDate) : DEFAULT_START_IDX,
		endDate ? getSliderValueFromDate(endDate) : DEFAULT_END_IDX,
	];

	// Build API query params
	const params: Record<string, string> = {
		bbox: bbox ? bbox.join(',') : '',
		model: resolvedModel,
		product: product?.toString() || '',
		endDate: endDate?.toString() || '',
		startDate: startDate ? transformDate(startDate) : '',
	};

	const finalSeasonId = customSeasonId || generatedSeasonId;
	if (finalSeasonId && seasonStartDate && seasonEndDate) {
		const seasonWindows = { [finalSeasonId]: [seasonStartDate, seasonEndDate] };
		params.seasonWindows = JSON.stringify(seasonWindows);
		params.seasonIds = JSON.stringify([finalSeasonId]);
	}

	if (isCropType) {
		if (orbitState) params.orbitState = orbitState.toString();
		// Note: seasonalModelZip is already used as the `model` param above (resolvedModel)
		// Cropland head params
		params.enableCroplandHead = String(enableCroplandHead ?? true);
		if ((enableCroplandHead ?? true) && landcoverHeadZip) params.landcoverHeadZip = landcoverHeadZip;
		// Croptype head override
		if (croptypeHeadZip) params.croptypeHeadZip = croptypeHeadZip;
		// Cropland postprocess
		if (enableCroplandHead ?? true) {
			params.maskCropland = String(maskCropland ?? true);
			if (postprocessMethodCropland) params.postprocessMethodCropland = postprocessMethodCropland.toString();
			if (
				postprocessMethodCropland === customProductsPostprocessMethods.majorityVote &&
				postprocessKernelSizeCropland !== undefined
			) {
				params.postprocessKernelSizeCropland = postprocessKernelSizeCropland.toString();
			}
		}
		// Croptype postprocess (reuse existing fields)
		if (postprocessMethod) params.postprocessMethod = postprocessMethod.toString();
		if (postprocessMethod === customProductsPostprocessMethods.majorityVote && postprocessKernelSize !== undefined) {
			params.postprocessKernelSize = postprocessKernelSize.toString();
		}
	} else if (isCropExtent) {
		// Cropland Extent postprocess
		if (orbitState) params.orbitState = orbitState.toString();
		if (postprocessMethodCropland) params.postprocessMethod = postprocessMethodCropland.toString();
		if (
			postprocessMethodCropland === customProductsPostprocessMethods.majorityVote &&
			postprocessKernelSizeCropland !== undefined
		) {
			params.postprocessKernelSize = postprocessKernelSizeCropland.toString();
		}
		if (landcoverHeadZip) params.landcoverHeadZip = landcoverHeadZip;
	}

	const urlParams = new URLSearchParams(params);

	const { data, isLoading } = useSWR(shouldFetch ? [apiUrl, urlParams.toString()] : null, () =>
		apiFetcher(apiUrl, urlParams.toString())
	);

	const onCreateProcessClick = () => {
		setProcessError(null);
		if (nextStepDisabled) return;
		setShouldFetch(true);
	};

	const onBackClick = () => {
		router.push(`/generate-custom-products/steps/1`);
	};

	useEffect(() => {
		if (shouldFetch && data) {
			setShouldFetch(false);
			if (data?.error) {
				setProcessError(data.error);
			}
		}
	}, [shouldFetch, data]);

	useEffect(() => {
		if (data?.key) {
			dispatch({
				type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_CURRENT_JOB_KEY,
				payload: data.key,
			});
			router.push(`/generate-custom-products/steps/3`);
		}
	}, [data, router]);

	const requiredAsterisk = <span style={{ color: 'var(--deleteColor)', fontWeight: 'bold' }}>*</span>;

	return (
		<TwoColumns>
			<Column>
				<div className="step2-container">
				<Stack gap="xl" w="100%" align="stretch">
					{/* 2.1. Draw the extent (full width) */}
					<div>
					<SectionContainer>
						<Group gap={'0.3rem'} align="baseline" mb="xs">
							<FormLabel>2.1. Draw the extent (MIN: 900 sqm, MAX: 2 500 sqkm)</FormLabel>
							{requiredAsterisk}
						</Group>
						<Box w="100%">
							<MapBBox
								mapSize={[1050, 460]}
								minBboxArea={bboxSizeLimits.customProducts.min}
								maxBboxArea={bboxSizeLimits.customProducts.max}
								bbox={bbox?.map(Number)}
								setBboxDescription={setBboxDescription}
								setBboxExtent={setBBoxExtent}
								setBboxIsInBounds={setBboxIsInBounds}
								backgroundLayer={backgroundLayer}
								setBackgroundLayer={(value) => setBackgroundLayer(value as CreateCustomProductsBackgroundLayerModel)}
							/>
						</Box>
						<Box mt="xs">
							<TextDescription className="step2-desc">
								Current extent:{' '}
								{bbox ? bbox.map((num) => Number(num).toFixed(2)).join(', ') : ''}{' '}
								{bboxDescription ? `(${bboxDescription} sqkm)` : '(No extent selected)'}
							</TextDescription>
						</Box>
					</SectionContainer>
					<Box>
						<TextDescription className="step2-desc">
							<b>Avoid too large areas to prevent excessive credit usage and long processing times!</b>
						</TextDescription>
						<TextDescription className="step2-desc">
							A run of 250 km² will typically consume 40 credits and last around 20 mins.
						</TextDescription>
						<TextDescription className="step2-desc">
							A run of 750 km² will typically consume 90 credits and last around 50 mins.
						</TextDescription>
						<TextDescription className="step2-desc">
							A run of 2500 km² will typically consume 250 credits and last around 1h 40 mins.
						</TextDescription>
					</Box>
					</div>

					{/* 2.2. Select season of interest */}
					<Stack gap="lg" w="100%" align="flex-start">
						<Box>
							<Group gap={'0.3rem'} align="baseline">
								<FormLabel>2.2. Select season of interest</FormLabel>
								{requiredAsterisk}
							</Group>
							<TextDescription className="step2-desc">
								Pick a recommended period for your selected area and tweak as needed, or define your own.
							</TextDescription>
						</Box>

						{/* 2.2.1. Pick a suggested period */}
						<div>
							<Text fw={700} size="md" c="white">
								2.2.1. Pick a suggested period
							</Text>
							{suggestedPeriods.length > 0 ? (
								<Radio.Group
									value={selectedPeriodId}
									onChange={onSuggestedPeriodChange}
									name="suggestedPeriod"
									style={{ marginTop: '0.5rem' }}
								>
									<div className="step2-suggested-periods">
										{suggestedPeriods.map((period) => (
											<Radio
												key={period.id}
												value={period.id}
												label={formatPeriodLabel(period.startDate, period.endDate)}
											/>
										))}
									</div>
								</Radio.Group>
							) : (
								<TextDescription color="var(--textSecondaryColor)">
									{bbox ? 'Loading suggested periods...' : 'Please draw the extent first.'}
								</TextDescription>
							)}
						</div>

						{/* 2.2.2. Adjust the date range (full width) */}
						<Box w="100%">
							<Text fw={700} size="md" c="white">
								2.2.2. Adjust the date range
							</Text>
							<TextDescription className="step2-desc">
								Select a season between {START_YEAR} and {CURRENT_YEAR}.{' '}
								{isCropType ? 'From 3 to 12 months.' : 'Exactly 12 months.'}
							</TextDescription>

							<Box p="lg" pt={60} bg="#000" style={{ borderRadius: '2px', marginTop: '0.5rem' }}>
								<RangeSlider
									min={0}
									max={SLIDER_MAX}
									step={1}
									minRange={isCropType ? CROP_TYPE_MIN_DIFF : CROP_EXTENT_DIFF}
									maxRange={isCropType ? CROP_TYPE_MAX_DIFF : CROP_EXTENT_DIFF}
									marks={generateFullRangeMarks()}
									value={sliderValue}
									onChange={handleDateRangeChange}
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
										const date = new Date(START_YEAR, value);
										const text = date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
										const side = value === sliderValue[0] ? 'is-start' : 'is-end';
										return (
											<div className={`step2-thumb-label ${side}`}>
												{text}
												<div className="step2-thumb-label-arrow" />
											</div>
										);
									}}
								/>
							</Box>
						</Box>

						{/* 2.2.3. Enter season ID */}
						<Input.Wrapper
							className="worldCereal-Input"
							size="md"
							label="2.2.3. Enter season ID"
							description="Enter your own season ID or use the generated one."
						>
							<TextInput
								size="md"
								placeholder="e.g. 2022"
								value={customSeasonId}
								onChange={(e) => setCustomSeasonId(e.currentTarget.value)}
							/>
						</Input.Wrapper>

						{(startDate || endDate) && (
							<Stack gap={2}>
								<Text size="sm" c="white">
									Selected start date: <b>{formatToFirstOfMonth(startDate)}</b>
								</Text>
								<Text size="sm" c="white">
									Selected end date: <b>{formatToEndOfMonth(endDate)}</b>
								</Text>
							</Stack>
						)}
					</Stack>

					{/* Crop Type specific controls */}
					{isCropType && (
						<Stack gap="md" w="100%">
							{/* 2.3. Orbit state */}
							<div>
								<Group gap={'0.3rem'} align="baseline" mb="xs">
									<FormLabel>2.3. Orbit state</FormLabel>
									{requiredAsterisk}
								</Group>
								<TextDescription className="step2-desc">
									Most dominant Sentinel-1 orbit for your area of interest, either &apos;ASCENDING&apos; or
									&apos;DESCENDING&apos;. See details:{' '}
									<a
										href="https://sentiwiki.copernicus.eu/web/s1-mission#S1Mission-ObservationandProductionScenariosS1-Mission-Observation-and-Production-Scenarios"
										target="_blank"
										rel="noopener noreferrer"
									>
										https://sentiwiki.copernicus.eu/web/s1-mission#S1Mission-ObservationandProductionScenariosS1-Mission-Observation-and-Production-Scenarios
									</a>
								</TextDescription>
								<Select
									className="worldCereal-Select"
									size="md"
									allowDeselect={false}
									placeholder="Pick one"
									data={formParams.orbitState.options}
									value={orbitState}
									onChange={(value) => {
										if (value === 'ASCENDING' || value === 'DESCENDING') {
											dispatch({
												type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_ORBIT_STATE,
												payload: value,
											});
										}
									}}
								/>
							</div>

							{/* Cropland head postprocessing (shown when enableCroplandHead is true) */}
							{(enableCroplandHead ?? true) && (
								<>
									{/* 2.4. Postprocess method - cropland */}
									<div>
										<Group gap={'0.3rem'} align="baseline" mb="xs">
											<FormLabel>2.4. Postprocess method - cropland</FormLabel>
											{requiredAsterisk}
										</Group>
										<TextDescription className="step2-desc">
											The method used for cleaning your map after initial pixel-based predictions. Smooth
											probabilities represents a minor cleaning step, whereas majority voting will introduce more
											fierce post-processing, also depending on the selected kernel size.
										</TextDescription>
										<Select
											className="worldCereal-Select"
											size="md"
											allowDeselect={false}
											data={formParams.postprocessMethodCropland.options}
											value={postprocessMethodCropland ?? 'majority_vote'}
											onChange={(value) => {
												if (value) {
													dispatch({
														type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_POSTPROCESS_METHOD_CROPLAND,
														payload: value as CreateCustomProductsPostprocessMethodCroplandModel,
													});
												}
											}}
										/>
									</div>

									{/* 2.4.1. Kernel size - cropland */}
									{postprocessMethodCropland === customProductsPostprocessMethods.majorityVote && (
										<div>
											<FormLabel>2.4.1. Kernel size - cropland</FormLabel>
											<TextDescription className="step2-desc">
												The larger the size of the kernel, the more pixel-to-pixel variations in the final map will be
												eliminated. Must be an odd positive number not larger than 25.
											</TextDescription>
											<NumberInput
												className="worldCereal-Input step2-number-input"
												size="md"
												value={postprocessKernelSizeCropland ?? 3}
												onChange={(val) => {
													const num = Number(val);
													if (!isNaN(num)) {
														dispatch({
															type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_POSTPROCESS_KERNEL_SIZE_CROPLAND,
															payload: num,
														});
													}
												}}
												min={1}
												max={25}
												step={2}
											/>
										</div>
									)}

									{/* 2.5. Apply Cropland Mask */}
									<div>
										<FormLabel>2.5. Apply Cropland Mask</FormLabel>
										<TextDescription className="step2-desc">
											Mask crop type predictions outside cropland areas using the generated cropland mask.
										</TextDescription>
										<Checkbox
											className="worldCereal-Checkbox"
											size="md"
											label="Apply Cropland Mask"
											checked={maskCropland ?? true}
											onChange={(e) =>
												dispatch({
													type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_MASK_CROPLAND,
													payload: e.currentTarget.checked,
												})
											}
										/>
									</div>
								</>
							)}

							{/* 2.6. Postprocess method - croptype */}
							<div>
								<Group gap={'0.3rem'} align="baseline" mb="xs">
									<FormLabel>2.6. Postprocess method - croptype</FormLabel>
									{requiredAsterisk}
								</Group>
								<TextDescription className="step2-desc">
									The method used for cleaning your map after initial pixel-based predictions. Smooth
									probabilities represents a minor cleaning step, whereas majority voting will introduce more fierce
									post-processing, also depending on the selected kernel size.
								</TextDescription>
								<Select
									className="worldCereal-Select"
									size="md"
									allowDeselect={false}
									data={formParams.postprocessMethod.options}
									value={postprocessMethod ?? 'majority_vote'}
									onChange={(value) => {
										if (value) {
											dispatch({
												type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_POSTPROCESS_METHOD,
												payload: value as 'smooth_probabilities' | 'majority_vote',
											});
										}
									}}
								/>
							</div>

							{/* 2.6.1. Kernel size - croptype */}
							{postprocessMethod === customProductsPostprocessMethods.majorityVote && (
								<div>
									<FormLabel>2.6.1. Kernel size - croptype</FormLabel>
									<TextDescription className="step2-desc">
										The larger the size of the kernel, the more pixel-to-pixel variations in the final map will be
										eliminated. Must be an odd positive number not larger than 25.
									</TextDescription>
									<NumberInput
										className="worldCereal-Input step2-number-input"
										size="md"
										value={postprocessKernelSize ?? 5}
										onChange={(val) => {
											const num = Number(val);
											if (!isNaN(num)) {
												dispatch({
													type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_POSTPROCESS_KERNEL_SIZE,
													payload: num,
												});
											}
										}}
										min={1}
										max={25}
										step={2}
									/>
								</div>
							)}
						</Stack>
					)}

					{/* Cropland Extent specific controls */}
					{isCropExtent && (
						<Stack gap="md" w="100%">
							{/* 2.3. Orbit state */}
							<div>
								<Group gap={'0.3rem'} align="baseline" mb="xs">
									<FormLabel>2.3. Orbit state</FormLabel>
									{requiredAsterisk}
								</Group>
								<TextDescription className="step2-desc">
									Most dominant Sentinel-1 orbit for your area of interest, either &apos;ASCENDING&apos; or
									&apos;DESCENDING&apos;. See details:{' '}
									<a
										href="https://sentiwiki.copernicus.eu/web/s1-mission#S1Mission-ObservationandProductionScenariosS1-Mission-Observation-and-Production-Scenarios"
										target="_blank"
										rel="noopener noreferrer"
									>
										https://sentiwiki.copernicus.eu/web/s1-mission#S1Mission-ObservationandProductionScenariosS1-Mission-Observation-and-Production-Scenarios
									</a>
								</TextDescription>
								<Select
									className="worldCereal-Select"
									size="md"
									placeholder="Pick one"
									data={formParams.orbitState.options}
									value={orbitState ?? null}
									onChange={(value) => {
										if (value === 'ASCENDING' || value === 'DESCENDING') {
											dispatch({
												type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_ORBIT_STATE,
												payload: value,
											});
										}
									}}
								/>
							</div>

							{/* 2.4. Postprocess method */}
							<div>
								<Group gap={'0.3rem'} align="baseline" mb="xs">
									<FormLabel>2.4. Postprocess method</FormLabel>
									{requiredAsterisk}
								</Group>
								<TextDescription className="step2-desc">
									The method used for cleaning your map after initial pixel-based predictions. Smooth probabilities
									represents a minor cleaning step, whereas majority voting will introduce more fierce post-processing,
									also depending on the selected kernel size.
								</TextDescription>
								<Select
									className="worldCereal-Select"
									size="md"
									allowDeselect={false}
									data={formParams.postprocessMethodCropland.options}
									value={postprocessMethodCropland ?? 'majority_vote'}
									onChange={(value) => {
										if (value) {
											dispatch({
												type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_POSTPROCESS_METHOD_CROPLAND,
												payload: value as CreateCustomProductsPostprocessMethodCroplandModel,
											});
										}
									}}
								/>
							</div>

							{/* 2.4.1. Kernel size */}
							{postprocessMethodCropland === customProductsPostprocessMethods.majorityVote && (
								<div>
									<FormLabel>2.4.1. Kernel size</FormLabel>
									<TextDescription className="step2-desc">
										The larger the size of the kernel, the more pixel-to-pixel variations in the final map will be
										eliminated. Must be an odd positive number not larger than 25.
									</TextDescription>
									<NumberInput
										className="worldCereal-Input step2-number-input"
										size="md"
										value={postprocessKernelSizeCropland ?? 3}
										onChange={(val) => {
											const num = Number(val);
											if (!isNaN(num)) {
												dispatch({
													type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_POSTPROCESS_KERNEL_SIZE_CROPLAND,
													payload: num,
												});
											}
										}}
										min={3}
										max={25}
										step={2}
									/>
								</div>
							)}
						</Stack>
					)}

					{/* Navigation / Actions */}
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
					{processError && (
						<Box mt="md" p="sm" bg="var(--errorColor)" style={{ borderRadius: '4px' }}>
							<Text size="sm" c="var(--base0)">
								{processError}
							</Text>
						</Box>
					)}
				</Stack>
				</div>
			</Column>
		</TwoColumns>
	);
}
