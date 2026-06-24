'use client';
import useSWR from 'swr';
import { Text } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconArrowLeft, IconCheck } from '@tabler/icons-react';
import { useQueryStates } from 'nuqs';
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
	processTypes,
} from '@features/(processes)/_constants/app';
import { transformDate } from '@features/(processes)/_utils/transformDate';
import formParams from '@features/(processes)/_constants/generate-custom-products/formParams';
import {
	generateCustomProductsSearchParams,
	serializeGenerateCustomProductsSearchParams,
} from '@features/(processes)/_constants/generate-custom-products/searchParams';
import { parseBbox, stringifyBbox } from '@features/(processes)/_utils/bbox';
import { apiFetcher } from '@features/(shared)/_url/apiFetcher';
import './CreateProductsStep2Client.css';

const START_YEAR = 2018;
const CURRENT_YEAR = new Date().getFullYear();
const SLIDER_MAX = (CURRENT_YEAR - START_YEAR) * 12;

const YEAR_WINDOW_SIZE = 3;

const generateYearMarks = () => {
	const marks = [];
	for (let year = START_YEAR; year <= CURRENT_YEAR; year++) {
		const label = (year - START_YEAR) % 2 === 0 ? year.toString() : '';
		marks.push({ value: year - START_YEAR, label });
	}
	return marks;
};

const getMaxYearWindow = () => CURRENT_YEAR - START_YEAR - YEAR_WINDOW_SIZE + 1;

const generateMonthMarks = (yearWindowStart: number) => {
	const marks = [];
	const startYear = START_YEAR + yearWindowStart;
	marks.push({ value: 0, label: startYear.toString() });
	marks.push({ value: 12, label: (startYear + 1).toString() });
	marks.push({ value: 24, label: (startYear + 2).toString() });
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
	return date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
};

const formatPeriodLabel = (start: string, end: string) => {
	return `${formatPeriodDate(start)} / ${formatPeriodDate(end)}`;
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
		{ product, model, outputFileFormat, bbox, backgroundLayer, endDate, orbitState, postprocessMethod, postprocessKernelSize },
		setParams,
	] = useQueryStates(generateCustomProductsSearchParams);

	const [bboxIsInBounds, setBboxIsInBounds] = useState<boolean | null>(null);
	const [bboxDescription, setBboxDescription] = useState<string | string[] | null>(null);
	const [shouldFetch, setShouldFetch] = useState(false);

	const bboxArr = parseBbox(bbox);

	const isCropType = product === customProductsProductTypes.cropType;

	const nextStepDisabled = !bboxIsInBounds || !bboxArr || !model || !product || !outputFileFormat || !endDate;

	const [startDate, setStartDate] = useState<Date | null>(null);

	const [yearWindow, setYearWindow] = useState<number>(() => {
		const maxYear = CURRENT_YEAR - START_YEAR - YEAR_WINDOW_SIZE + 1;
		return Math.floor(maxYear / 2);
	});
	const [suggestedPeriods, setSuggestedPeriods] = useState<Array<{ id: string; startDate: string; endDate: string }>>(
		[]
	);
	const [selectedPeriodId, setSelectedPeriodId] = useState<string | null>(null);
	const [suggestedPeriodSliderValues, setSuggestedPeriodSliderValues] = useState<number[] | null>(null);

	const [sliderStart, setSliderStart] = useState<number>(6);
	const [sliderEnd, setSliderEnd] = useState<number>(17);

	const suggestedPeriodsApiUrl = '/api/seasons/get';
	const [debouncedBbox, setDebouncedBbox] = useState<string | null>(null);

	useEffect(() => {
		if (bbox && bboxIsInBounds) {
			setSelectedPeriodId(null);
			setSuggestedPeriodSliderValues(null);

			const timer = setTimeout(() => {
				setDebouncedBbox(bbox);
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
			bbox: bboxArr,
			epsg: 4326,
		});
	});

	useEffect(() => {
		if (periodsData) {
			setSuggestedPeriods(periodsData);
			if (selectedPeriodId && !periodsData.find((p: { id: string }) => p.id === selectedPeriodId)) {
				setSelectedPeriodId(null);
				setSuggestedPeriodSliderValues(null);
			}
		}
	}, [periodsData, selectedPeriodId]);

	const setOutputFileFormat = (value: string) => {
		setParams({ outputFileFormat: value as 'GTiff' | 'NETCDF' });
	};

	const setBackgroundLayer = (value: string | null) => {
		if (value) setParams({ backgroundLayer: value });
	};

	const setBBoxExtent = (extent: [number, number, number, number] | null) => {
		setParams({ bbox: extent ? stringifyBbox(extent) : null });
	};

	const setEndDateParam = (value: string | null) => {
		if (value && value !== endDate) {
			setParams({ endDate: value });
		}
	};

	const onSuggestedPeriodChange = (value: string) => {
		const period = suggestedPeriods.find((p) => p.id === value);
		if (period) {
			setSelectedPeriodId(value);
			const [startYear, startMonth] = period.startDate.split('-').map(Number);
			let newStartDate = new Date(startYear, startMonth - 1, 1);

			const [endYear, endMonth] = period.endDate.split('-').map(Number);
			let newEndDate = new Date(endYear, endMonth, 0);

			const endSliderValue = getSliderValueFromDate(newEndDate);
			const startSliderValue = getSliderValueFromDate(newStartDate);
			const periodMonths = endSliderValue - startSliderValue;

			if (!isCropType) {
				if (periodMonths !== minSliderRange) {
					const absoluteStartMonth = Math.max(0, endSliderValue - minSliderRange);
					newStartDate = getDateFromSliderValue(absoluteStartMonth);
				}
			} else {
				const MAX_MONTHS = 11;
				if (periodMonths > MAX_MONTHS) {
					const absoluteStartMonth = Math.max(0, endSliderValue - MAX_MONTHS);
					newStartDate = getDateFromSliderValue(absoluteStartMonth);
				} else if (periodMonths < minSliderRange) {
					const absoluteStartMonth = Math.max(0, endSliderValue - minSliderRange);
					newStartDate = getDateFromSliderValue(absoluteStartMonth);
				}
			}

			const absoluteStartMonth = getSliderValueFromDate(newStartDate);
			const absoluteEndMonth = getSliderValueFromDate(newEndDate);
			const adjustedPeriodYear = Math.floor(absoluteEndMonth / 12);
			const maxYearWindow = getMaxYearWindow();
			let newYearWindow = Math.max(0, Math.min(adjustedPeriodYear, maxYearWindow));
			const yearWindowStartMonth = newYearWindow * 12;

			if (absoluteStartMonth < yearWindowStartMonth) {
				newYearWindow = Math.max(0, Math.floor(absoluteStartMonth / 12));
			}

			const finalYearWindowStartMonth = newYearWindow * 12;

		const sliderStartValue = Math.max(0, Math.min(monthSliderMax, absoluteStartMonth - finalYearWindowStartMonth));
		const sliderEndValue = Math.max(0, Math.min(monthSliderMax, absoluteEndMonth - finalYearWindowStartMonth));

		if (!isCropType) {
			const finalStartMonth = newYearWindow * 12 + sliderStartValue;
			const finalEndMonth = finalStartMonth + minSliderRange;
			newStartDate = getDateFromSliderValue(finalStartMonth);
			newEndDate = getDateFromSliderValue(finalEndMonth, true);
		} else {
			const finalStartMonth = newYearWindow * 12 + sliderStartValue;
			const finalEndMonth = newYearWindow * 12 + sliderEndValue;
			newStartDate = getDateFromSliderValue(finalStartMonth);
			newEndDate = getDateFromSliderValue(finalEndMonth, true);
		}

		setSuggestedPeriodSliderValues([sliderStartValue, sliderEndValue]);
		setSliderStart(sliderStartValue);
		setSliderEnd(sliderEndValue);

		setStartDate(newStartDate);
		const endDateStr = transformDate(newEndDate);
		setEndDateParam(endDateStr);
		setYearWindow(newYearWindow);
		}
	};

	const MIN_MONTHS = 3;
	const minSliderRange = isCropType ? 3 : 11;

	const monthSliderMax = 24;

	const handleMonthSliderChange = (values: number[]) => {
		if (!Array.isArray(values)) return;

		const [newStartVal, newEndVal] = values;

		if (!isCropType) {
			const finalSliderStart = Math.max(0, Math.min(newEndVal - minSliderRange, monthSliderMax - minSliderRange));

			setSliderStart(finalSliderStart);

			const finalStartMonth = yearWindow * 12 + finalSliderStart;
			const finalEndMonth = yearWindow * 12 + finalSliderStart + minSliderRange;

			const newStartDate = getDateFromSliderValue(finalStartMonth);
			const newEndDate = getDateFromSliderValue(finalEndMonth, true);

			setSelectedPeriodId(null);
			setSuggestedPeriodSliderValues(null);
			setStartDate(newStartDate);
			const endDateStr = transformDate(newEndDate);
			setEndDateParam(endDateStr);
		} else {
			setSliderStart(newStartVal);
			setSliderEnd(newEndVal);

			const finalStartMonth = yearWindow * 12 + newStartVal;
			const finalEndMonth = yearWindow * 12 + newEndVal;

			const newStartDate = getDateFromSliderValue(finalStartMonth);
			const newEndDate = getDateFromSliderValue(finalEndMonth, true);

			setSelectedPeriodId(null);
			setSuggestedPeriodSliderValues(null);
			setStartDate(newStartDate);
			const endDateStr = transformDate(newEndDate);
			setEndDateParam(endDateStr);
		}
	};

	const isFirstRender = React.useRef(true);
	const prevYearWindow = React.useRef(yearWindow);

	useEffect(() => {
		if (selectedPeriodId) {
			prevYearWindow.current = yearWindow;
			return;
		}

		if (isFirstRender.current) {
			isFirstRender.current = false;
			const start = 6;
			const end = isCropType ? 17 : start + minSliderRange;

			setSliderStart(start);
			setSliderEnd(end);

			const windowStartMonth = yearWindow * 12 + start;
			const windowEndMonth = yearWindow * 12 + end;

			const newStart = getDateFromSliderValue(windowStartMonth);
			const newEnd = getDateFromSliderValue(windowEndMonth, true);

			setStartDate(newStart);
			const endDateStr = transformDate(newEnd);
			setEndDateParam(endDateStr);
		} else if (prevYearWindow.current !== yearWindow && startDate && endDate) {
			const oldYearWindow = prevYearWindow.current;

			const oldStartSliderPos = getSliderValueFromDate(startDate) - oldYearWindow * 12;
			const oldEndSliderPos = isCropType
				? getSliderValueFromDate(endDate) - oldYearWindow * 12
				: oldStartSliderPos + minSliderRange;

			setSliderStart(oldStartSliderPos);
			setSliderEnd(oldEndSliderPos);

			const newStartMonth = yearWindow * 12 + oldStartSliderPos;
			const newEndMonth = yearWindow * 12 + oldEndSliderPos;

			const clampedStartMonth = Math.max(0, Math.min(newStartMonth, SLIDER_MAX));
			const clampedEndMonth = Math.max(0, Math.min(newEndMonth, SLIDER_MAX));

			const newStart = getDateFromSliderValue(clampedStartMonth);
			const newEnd = getDateFromSliderValue(clampedEndMonth, true);

			setStartDate(newStart);
			const endDateStr = transformDate(newEnd);
			setEndDateParam(endDateStr);
		}

		prevYearWindow.current = yearWindow;
	}, [yearWindow]);

	const params: Record<string, string> = {
		bbox: bbox ?? '',
		outputFileFormat: outputFileFormat?.toString() || '',
		model: model?.toString() || '',
		product: product?.toString() || '',
		endDate: endDate?.toString() || '',
		startDate: startDate ? transformDate(startDate) : '',
		...(product ? { customProperties: JSON.stringify({ process_type: processTypes.product }) } : {}),
	};

	const selectedPeriod = selectedPeriodId ? suggestedPeriods.find((period) => period.id === selectedPeriodId) : null;
	const seasonStartDate = startDate ? transformDate(startDate) : null;
	const seasonEndDate = endDate ? endDate.toString() : null;
	const seasonId =
		selectedPeriod?.id ??
		(seasonStartDate && seasonEndDate
			? `season_${seasonStartDate.replaceAll('-', '_')}_${seasonEndDate.replaceAll('-', '_')}`
			: null);

	if (seasonId && seasonStartDate && seasonEndDate) {
		const seasonWindows = { [seasonId]: [seasonStartDate, seasonEndDate] };
		params.seasonWindows = JSON.stringify(seasonWindows);
		params.seasonIds = JSON.stringify([seasonId]);
	}

	if (product === customProductsProductTypes.cropType) {
		if (orbitState) params.orbitState = orbitState.toString();
		if (postprocessMethod) params.postprocessMethod = postprocessMethod.toString();
		if (postprocessMethod === customProductsPostprocessMethods.majorityVote && postprocessKernelSize !== undefined) {
			params.postprocessKernelSize = postprocessKernelSize.toString();
		}
	}

	const urlParams = new URLSearchParams(params);

	const { data, isLoading } = useSWR(shouldFetch ? [apiUrl, urlParams.toString()] : null, () =>
		apiFetcher(apiUrl, urlParams.toString())
	);

	const onCreateProcessClick = () => {
		setShouldFetch(true);
	};

	const onBackClick = () => {
		router.push(
			serializeGenerateCustomProductsSearchParams('/generate-custom-products/steps/1', {
				product,
				model,
				orbitState,
				postprocessMethod,
				postprocessKernelSize,
			})
		);
	};

	useEffect(() => {
		if (shouldFetch && data) {
			setShouldFetch(false);
		}
	}, [shouldFetch, data]);

	useEffect(() => {
		if (data?.key) {
			const baseHref = serializeGenerateCustomProductsSearchParams(
				'/generate-custom-products/steps/3',
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
							(MIN: 900 m<sup>2</sup>, MAX: 2 500 km<sup>2</sup>)
						</TextDescription>
					</Group>
					<MapBBox
						mapSize={[650, 400]}
						minBboxArea={bboxSizeLimits.customProducts.min}
						maxBboxArea={bboxSizeLimits.customProducts.max}
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
						<TextDescription>
							Pick a recommended period for your selected area and tweak as needed, or define your own.
						</TextDescription>
					</div>
					<div>
						<Text>Pick a suggested period</Text>
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
							<TextDescription color="var(--textSecondaryColor)">
								{bbox ? 'Loading suggested periods...' : 'Please draw the extent first.'}
							</TextDescription>
						)}
					</div>

					<div style={{ width: '100%' }}>
						<Text>Adjust the date range</Text>
						<div>
							<TextDescription>
								Select a period between 2018 and {CURRENT_YEAR}.{' '}
								{isCropType ? 'Min 3 months, Max 12 months.' : 'Exactly 12 months.'}
							</TextDescription>

							<Box p="lg" pt={60} bg="#1A1A1A" style={{ borderRadius: '8px', marginTop: '0.5rem' }}>
								<Box mb="xl">
									<RangeSlider
										min={0}
										max={CURRENT_YEAR - START_YEAR}
										step={1}
										value={[yearWindow, yearWindow + YEAR_WINDOW_SIZE - 1]}
										onChange={(val) => {
											if (Array.isArray(val)) {
												const maxVal = getMaxYearWindow();
												const prevStart = yearWindow;
												const prevEnd = yearWindow + YEAR_WINDOW_SIZE - 1;
												const startDiff = Math.abs(val[0] - prevStart);
												const endDiff = Math.abs(val[1] - prevEnd);

												let newStart: number;
												if (startDiff >= endDiff) {
													newStart = Math.max(0, Math.min(val[0], maxVal));
												} else {
													newStart = Math.max(0, Math.min(val[1] - YEAR_WINDOW_SIZE + 1, maxVal));
												}
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

								<Box pt={20} mt={40}>
									<RangeSlider
										min={0}
										max={monthSliderMax}
										step={1}
										minRange={isCropType ? minSliderRange : undefined}
										maxRange={isCropType ? 11 : undefined}
										marks={generateMonthMarks(yearWindow)}
										value={
											(suggestedPeriodSliderValues as [number, number] | undefined) ||
											(isCropType ? [sliderStart, sliderEnd] : [sliderStart, sliderStart + minSliderRange])
										}
										onChange={handleMonthSliderChange}
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
									<Text>
										Selected start date: <b>{formatToFirstOfMonth(startDate)}</b>
									</Text>
									<Text>
										Selected end date: <b>{formatToEndOfMonth(endDate)}</b>
									</Text>
								</Stack>
							)}
						</div>
					</div>
					<div style={{ width: '100%' }}>
						<FormLabel>Choose output file format</FormLabel>
						<SegmentedControl
							onChange={(value) => setOutputFileFormat(value)}
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
