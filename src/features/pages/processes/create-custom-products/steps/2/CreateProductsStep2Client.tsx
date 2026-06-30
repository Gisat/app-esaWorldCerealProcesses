'use client';
import useSWR from 'swr';
import { Checkbox, Text } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconArrowLeft, IconCheck } from '@tabler/icons-react';
import { useQueryStates } from 'nuqs';
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
	processTypes,
} from '@features/(processes)/_constants/app';
import { transformDate } from '@features/(processes)/_utils/transformDate';
import formParams from '@features/(processes)/_constants/generate-custom-products/formParams';
import {
	DEFAULT_POSTPROCESS_KERNEL_SIZE_CROPLAND,
	DEFAULT_POSTPROCESS_KERNEL_SIZE_CROPTYPE,
	KERNEL_SIZE_CROPLAND_MAX,
	KERNEL_SIZE_CROPLAND_MIN,
	KERNEL_SIZE_CROPLAND_STEP,
	KERNEL_SIZE_CROPTYPE_MAX,
	KERNEL_SIZE_CROPTYPE_MIN,
	KERNEL_SIZE_CROPTYPE_STEP,
} from '@features/(processes)/_constants/defaults';
import {
	generateCustomProductsSearchParams,
	serializeGenerateCustomProductsSearchParams,
} from '@features/(processes)/_constants/generate-custom-products/searchParams';
import { generateStep2Schema, nullsToUndefined } from '@features/(processes)/_constants/validation';
import { parseBbox, stringifyBbox } from '@features/(processes)/_utils/bbox';
import { apiFetcher } from '@features/(shared)/_url/apiFetcher';
import './CreateProductsStep2Client.css';

const START_YEAR = 2018;
const CURRENT_YEAR = new Date().getFullYear();
const SLIDER_MAX = (CURRENT_YEAR - START_YEAR) * 12;

const CROP_TYPE_MIN_DIFF = 2;
const CROP_TYPE_MAX_DIFF = 11;
const CROP_EXTENT_DIFF = 11;

const DEFAULT_END_IDX = SLIDER_MAX - 6;
const DEFAULT_START_IDX = Math.max(0, DEFAULT_END_IDX - CROP_EXTENT_DIFF);

const generateFullRangeMarks = () => {
	const marks = [];
	for (let year = START_YEAR; year <= CURRENT_YEAR; year++) {
		const idx = (year - START_YEAR) * 12;
		const label = (year - START_YEAR) % 2 === 0 ? year.toString() : '';
		marks.push({ value: idx, label });
	}
	return marks;
};

const getSliderValueFromDate = (date: Date | string | null | undefined): number => {
	if (!date) return 0;
	const tmpDate = new Date(date);
	const months = (tmpDate.getFullYear() - START_YEAR) * 12 + tmpDate.getMonth();
	return Math.max(0, Math.min(months, SLIDER_MAX));
};

const getDateFromSliderValue = (sliderVal: number, isEnd = false) => {
	const year = START_YEAR + Math.floor(sliderVal / 12);
	const month = sliderVal % 12;
	if (isEnd) {
		return new Date(year, month + 1, 0);
	}
	return new Date(year, month, 1);
};

const formatPeriodDate = (dateStr: string) => {
	const [year, month] = dateStr.split('-').map(Number);
	const date = new Date(year, month - 1);
	return date.toLocaleString('en-US', { month: 'long' });
};

const formatPeriodLabel = (start: string, end: string) => {
	return `${formatPeriodDate(start)} → ${formatPeriodDate(end)}`;
};

const formatToFirstOfMonth = (date: Date | null) => {
	if (!date) return '-';
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	return `${year}-${month}-01`;
};

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

export default function CreateProductsStep2Client() {
	const apiUrl = '/api/jobs/create/from-process';
	const router = useRouter();

	const [
		{
			processId,
			format,
			bbox,
			backgroundLayer,
			endDate,
			orbitState,
			postprocessMethodCroptype,
			postprocessKernelSizeCroptype,
			seasonalModelZip,
			enableCroplandHead,
			landcoverHeadZip,
			croptypeHeadZip,
			maskCropland,
			postprocessMethodCropland,
			postprocessKernelSizeCropland,
			customSeasonId,
			selectedPeriodId,
		},
		setParams,
	] = useQueryStates(generateCustomProductsSearchParams);

	const [bboxIsInBounds, setBboxIsInBounds] = useState<boolean | null>(null);
	const [bboxDescription, setBboxDescription] = useState<string | string[] | null>(null);
	const [shouldFetch, setShouldFetch] = useState(false);
	const [processError, setProcessError] = useState<string | null>(null);

	const bboxArr = parseBbox(bbox);

	const isCropType = processId === customProductsProductTypes.cropType;
	const isCropExtent = processId === customProductsProductTypes.cropExtent;

	const validation = generateStep2Schema.safeParse(nullsToUndefined({
		processId,
		bbox,
		endDate,
		customSeasonId,
		format,
		orbitState,
		postprocessMethodCroptype,
		postprocessKernelSizeCroptype,
		postprocessMethodCropland,
		postprocessKernelSizeCropland,
		maskCropland,
		enableCroplandHead,
	}));

	const [startDate, setStartDate] = useState<Date | null>(null);
	const [userTouchedSeasonId, setUserTouchedSeasonId] = useState<boolean>(false);

	const [suggestedPeriods, setSuggestedPeriods] = useState<Array<{ id: string; startDate: string; endDate: string }>>(
		[]
	);

	const nextStepDisabled =
		!bboxIsInBounds ||
		!bbox ||
		!processId ||
		!startDate ||
		!endDate ||
		!validation.success;

	const suggestedPeriodsApiUrl = '/api/seasons/get';
	const [debouncedBbox, setDebouncedBbox] = useState<string | null>(null);
	const isInitialBboxRef = useRef(true);
	const prevPeriodsDataRef = useRef<typeof periodsData>(undefined);

	useEffect(() => {
		if (bbox && bboxIsInBounds) {
			if (!isInitialBboxRef.current) {
				setParams({ selectedPeriodId: null });
			}
			isInitialBboxRef.current = false;
			const timer = setTimeout(() => {
				setDebouncedBbox(bbox);
			}, 500);
			return () => clearTimeout(timer);
		} else {
			setDebouncedBbox(null);
			setSuggestedPeriods([]);
			if (!isInitialBboxRef.current) {
				setParams({ selectedPeriodId: null });
			}
		}
	}, [bbox, bboxIsInBounds]);

	const { data: periodsData } = useSWR(debouncedBbox ? [suggestedPeriodsApiUrl, debouncedBbox] : null, () => {
		return apiFetcher(suggestedPeriodsApiUrl, undefined, 'POST', {
			bbox: bboxArr,
			epsg: 4326,
		});
	});

	useEffect(() => {
		if (periodsData && periodsData !== prevPeriodsDataRef.current) {
			prevPeriodsDataRef.current = periodsData;
			setSuggestedPeriods(periodsData);
			if (selectedPeriodId) {
				const matchingPeriod = periodsData.find((p: { id: string }) => p.id === selectedPeriodId);
				if (matchingPeriod) {
					const [startYear, startMonth] = matchingPeriod.startDate.split('-').map(Number);
					const [endYear, endMonth] = matchingPeriod.endDate.split('-').map(Number);

					let startIdx = (startYear - START_YEAR) * 12 + (startMonth - 1);
					const endIdx = Math.min(SLIDER_MAX, (endYear - START_YEAR) * 12 + (endMonth - 1));
					const diff = endIdx - startIdx;

					if (!isCropType) {
						startIdx = endIdx - CROP_EXTENT_DIFF;
					} else {
						if (diff > CROP_TYPE_MAX_DIFF) startIdx = endIdx - CROP_TYPE_MAX_DIFF;
						else if (diff < CROP_TYPE_MIN_DIFF) startIdx = endIdx - CROP_TYPE_MIN_DIFF;
					}
					startIdx = Math.max(0, startIdx);

					setStartDate(getDateFromSliderValue(startIdx));
					const endDateStr = transformDate(getDateFromSliderValue(endIdx, true));
					setParams({ endDate: endDateStr });
				} else {
					setParams({ selectedPeriodId: null });
				}
			}
		}
	}, [periodsData, selectedPeriodId]);

	useEffect(() => {
		if (!startDate || !endDate) {
			setStartDate(getDateFromSliderValue(DEFAULT_START_IDX));
			const endStr = transformDate(getDateFromSliderValue(DEFAULT_END_IDX, true));
			setParams({ endDate: endStr });
		}
	}, []);

	const onSetBackgroundLayer = (value: string | null | ((prev: string | null) => string | null)) => {
		const next = typeof value === 'function' ? value(backgroundLayer) : value;
		setParams({ backgroundLayer: next });
	};

	const setBBoxExtent = (extent: [number, number, number, number] | null) => {
		setParams({ bbox: extent ? stringifyBbox(extent) : null });
	};

	const onSuggestedPeriodChange = (value: string) => {
		const period = suggestedPeriods.find((p) => p.id === value);
		if (!period) return;

		const [startYear, startMonth] = period.startDate.split('-').map(Number);
		const [endYear, endMonth] = period.endDate.split('-').map(Number);

		let startIdx = (startYear - START_YEAR) * 12 + (startMonth - 1);
		const endIdx = Math.min(SLIDER_MAX, (endYear - START_YEAR) * 12 + (endMonth - 1));
		const diff = endIdx - startIdx;

		if (!isCropType) {
			startIdx = endIdx - CROP_EXTENT_DIFF;
		} else {
			if (diff > CROP_TYPE_MAX_DIFF) startIdx = endIdx - CROP_TYPE_MAX_DIFF;
			else if (diff < CROP_TYPE_MIN_DIFF) startIdx = endIdx - CROP_TYPE_MIN_DIFF;
		}
		startIdx = Math.max(0, startIdx);

		setStartDate(getDateFromSliderValue(startIdx));
		const endDateStr = transformDate(getDateFromSliderValue(endIdx, true));
		setParams({ selectedPeriodId: value, endDate: endDateStr });
	};

	const handleDateRangeChange = (values: number[]) => {
		if (!Array.isArray(values)) return;
		const [startIdx, endIdx] = values;

		setStartDate(getDateFromSliderValue(startIdx));
		const endDateStr = transformDate(getDateFromSliderValue(endIdx, true));
		setParams({ selectedPeriodId: null, endDate: endDateStr });
	};

	const seasonStartDate = startDate ? transformDate(startDate) : null;
	const seasonEndDate = endDate ? endDate.toString() : null;

	const selectedPeriod = selectedPeriodId ? suggestedPeriods.find((period) => period.id === selectedPeriodId) : null;
	const generatedSeasonId = seasonEndDate ? seasonEndDate.slice(0, 4) : '';

	useEffect(() => {
		if (!userTouchedSeasonId && generatedSeasonId) {
			setParams({ customSeasonId: generatedSeasonId });
		}
	}, [generatedSeasonId, userTouchedSeasonId, setParams]);

	const sliderValue: [number, number] = [
		startDate ? getSliderValueFromDate(startDate) : DEFAULT_START_IDX,
		endDate ? getSliderValueFromDate(endDate) : DEFAULT_END_IDX,
	];

	const productLabel = processId ? (formParams.processId.options.find((o) => o.value === processId)?.label ?? processId) : '';
	const title = productLabel ? `Processing: ${productLabel}` : undefined;

	const params: Record<string, string> = {
		bbox: bbox ?? '',
		format: format?.toString() || '',
		...(seasonalModelZip ? { seasonalModelZip } : {}),
		processId: processId?.toString() || '',
		endDate: endDate?.toString() || '',
		startDate: startDate ? transformDate(startDate) : '',
		...(title ? { title } : {}),
		...(processId
			? {
					customProperties: JSON.stringify({
						process_type: processTypes.product,
						...(backgroundLayer
							? {
									background_layer: backgroundLayer,
								}
							: {}),
					}),
				}
			: {}),
	};

	const finalSeasonId = customSeasonId || generatedSeasonId;
	if (finalSeasonId && seasonStartDate && seasonEndDate) {
		const seasonWindows = { [finalSeasonId]: [seasonStartDate, seasonEndDate] };
		params.seasonWindows = JSON.stringify(seasonWindows);
	}

	if (isCropType) {
		if (orbitState) params.orbitState = orbitState.toString();
		params.enableCroplandHead = String(enableCroplandHead ?? true);
		if ((enableCroplandHead ?? true) && landcoverHeadZip) params.landcoverHeadZip = landcoverHeadZip;
		if (croptypeHeadZip) params.croptypeHeadZip = croptypeHeadZip;
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
		if (postprocessMethodCroptype) params.postprocessMethodCroptype = postprocessMethodCroptype.toString();
		if (postprocessMethodCroptype === customProductsPostprocessMethods.majorityVote && postprocessKernelSizeCroptype !== undefined) {
			params.postprocessKernelSizeCroptype = postprocessKernelSizeCroptype.toString();
		}
	} else if (isCropExtent) {
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
		router.push(
			serializeGenerateCustomProductsSearchParams('/generate-custom-products/steps/1', {
				processId,
				cropTypeModelType: undefined,
				seasonalModelZip,
				enableCroplandHead,
				landcoverHeadZip,
				croptypeHeadZip,
			})
		);
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
			const baseHref = serializeGenerateCustomProductsSearchParams('/generate-custom-products/steps/3', {});
			const separator = baseHref.includes('?') ? '&' : '?';
			router.push(`${baseHref}${separator}jobKey=${encodeURIComponent(data.key)}`);
		}
	}, [data, router]);

	const requiredAsterisk = <span style={{ color: 'var(--deleteColor)', fontWeight: 'bold' }}>*</span>;

	return (
		<TwoColumns>
			<Column>
				<div className="step2-container">
					<Stack gap="xl" w="100%" align="stretch">
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
										minZoom={2}
										bbox={bboxArr}
										setBboxDescription={setBboxDescription}
										setBboxExtent={setBBoxExtent}
										setBboxIsInBounds={setBboxIsInBounds}
									backgroundLayer={backgroundLayer ?? undefined}
									setBackgroundLayer={onSetBackgroundLayer}
									/>
								</Box>
								<Box mt="xs">
									<TextDescription className="step2-desc">
										Current extent: {bboxArr ? bboxArr.map((num) => Number(num).toFixed(2)).join(', ') : ''}{' '}
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

							<div>
								<Text fw={700} size="md" c="white">
									2.2.1. Pick a suggested season
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
													className="step2-suggested-period-option"
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

							<Input.Wrapper
								className="worldCereal-Input"
								size="md"
								label="2.2.3. Enter season ID"
								description="Alphanumeric characters, underscores, and hyphens only."
								error={!validation.success && validation.error?.flatten().fieldErrors.customSeasonId?.[0]}
							>
								<TextInput
									size="md"
									placeholder="e.g. 2022"
									value={customSeasonId ?? ''}
									error={!validation.success && validation.error?.flatten().fieldErrors.customSeasonId?.[0]}
									onChange={(e) => {
										setUserTouchedSeasonId(true);
										setParams({ customSeasonId: e.currentTarget.value });
									}}
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

						{isCropType && (
							<Stack gap="md" w="100%">
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
											https://sentiwiki.copernicus.eu/web/s1-mission
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
												setParams({ orbitState: value });
											}
										}}
									/>
								</div>

								{(enableCroplandHead ?? true) && (
									<>
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
														setParams({ postprocessMethodCropland: value as typeof postprocessMethodCropland });
													}
												}}
											/>
										</div>

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
													value={postprocessKernelSizeCropland ?? DEFAULT_POSTPROCESS_KERNEL_SIZE_CROPLAND}
													onChange={(val) => {
														const num = Number(val);
														if (!isNaN(num)) {
															setParams({ postprocessKernelSizeCropland: num });
														}
													}}
													min={KERNEL_SIZE_CROPLAND_MIN}
													max={KERNEL_SIZE_CROPLAND_MAX}
													step={KERNEL_SIZE_CROPLAND_STEP}
												/>
											</div>
										)}

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
												onChange={(e) => setParams({ maskCropland: e.currentTarget.checked })}
											/>
										</div>
									</>
								)}

								<div>
									<Group gap={'0.3rem'} align="baseline" mb="xs">
										<FormLabel>2.6. Postprocess method - croptype</FormLabel>
										{requiredAsterisk}
									</Group>
									<TextDescription className="step2-desc">
										The method used for cleaning your map after initial pixel-based predictions. Smooth probabilities
										represents a minor cleaning step, whereas majority voting will introduce more fierce
										post-processing, also depending on the selected kernel size.
									</TextDescription>
								<Select
									className="worldCereal-Select"
									size="md"
									allowDeselect={false}
									data={formParams.postprocessMethodCroptype.options}
									value={postprocessMethodCroptype ?? 'majority_vote'}
									onChange={(value) => {
										if (value) {
											setParams({ postprocessMethodCroptype: value as typeof postprocessMethodCroptype });
										}
									}}
								/>
								</div>

							{postprocessMethodCroptype === customProductsPostprocessMethods.majorityVote && (
								<div>
									<FormLabel>2.6.1. Kernel size - croptype</FormLabel>
									<TextDescription className="step2-desc">
										The larger the size of the kernel, the more pixel-to-pixel variations in the final map will be
										eliminated. Must be an odd positive number not larger than 25.
									</TextDescription>
									<NumberInput
										className="worldCereal-Input step2-number-input"
										size="md"
										value={postprocessKernelSizeCroptype ?? DEFAULT_POSTPROCESS_KERNEL_SIZE_CROPTYPE}
									onChange={(val) => {
										const num = Number(val);
										if (!isNaN(num)) {
											setParams({ postprocessKernelSizeCroptype: num });
										}
									}}
									min={KERNEL_SIZE_CROPTYPE_MIN}
									max={KERNEL_SIZE_CROPTYPE_MAX}
									step={KERNEL_SIZE_CROPTYPE_STEP}
								/>
							</div>
						)}
						</Stack>
					)}

						{isCropExtent && (
							<Stack gap="md" w="100%">
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
											https://sentiwiki.copernicus.eu/web/s1-mission
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
												setParams({ orbitState: value });
											}
										}}
									/>
								</div>

								<div>
									<Group gap={'0.3rem'} align="baseline" mb="xs">
										<FormLabel>2.4. Postprocess method</FormLabel>
										{requiredAsterisk}
									</Group>
									<TextDescription className="step2-desc">
										The method used for cleaning your map after initial pixel-based predictions. Smooth probabilities
										represents a minor cleaning step, whereas majority voting will introduce more fierce
										post-processing, also depending on the selected kernel size.
									</TextDescription>
									<Select
										className="worldCereal-Select"
										size="md"
										allowDeselect={false}
										data={formParams.postprocessMethodCropland.options}
										value={postprocessMethodCropland ?? 'majority_vote'}
										onChange={(value) => {
											if (value) {
												setParams({ postprocessMethodCropland: value as typeof postprocessMethodCropland });
											}
										}}
									/>
								</div>

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
											value={postprocessKernelSizeCropland ?? DEFAULT_POSTPROCESS_KERNEL_SIZE_CROPLAND}
										onChange={(val) => {
											const num = Number(val);
											if (!isNaN(num)) {
												setParams({ postprocessKernelSizeCropland: num });
											}
										}}
										min={KERNEL_SIZE_CROPLAND_MIN}
										max={KERNEL_SIZE_CROPLAND_MAX}
										step={KERNEL_SIZE_CROPLAND_STEP}
									/>
								</div>
							)}
						</Stack>
					)}

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
