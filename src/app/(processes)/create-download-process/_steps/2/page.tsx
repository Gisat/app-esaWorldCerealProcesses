"use client";

import React, { useState, useEffect, createElement, useMemo, useCallback } from 'react';
import useSWR from "swr";
import { useRouter } from 'next/navigation';
import { DateInput } from '@mantine/dates';
import { Button, Stack, SegmentedControl } from '@mantine/core';
import { products } from "@features/(processes)/_constants/app";
import PageSteps from '@features/(processes)/_components/PageSteps';
import { MapBBox } from '@features/(shared)/_components/map/MapBBox';
import FormLabel from '@features/(shared)/_layout/_components/FormLabel';
import TwoColumns, { Column } from '@features/(shared)/_layout/_components/TwoColumns';
import { IconCheck } from "@tabler/icons-react";

const minDate = new Date("2021-01-01");
const maxDate = new Date("2022-01-01");

const defaultOutputFileFormat = "GTIFF";

type BboxCornerPointsType = [number, number, number, number] | undefined;
type OutputFileFormatType = string | undefined;

type searchParamsType = {
    step?: string;
    startDate?: string;
    endDate?: string;
    collection?: string;
    bbox?: string;
    width?: string;
    height?: string;
    off?: string;
}

/**
 * Fetches data from the given URL with query parameters.
 * @param {string} url - The URL to fetch data from.
 * @param {string} queryParams - The query parameters.
 * @returns {Promise<any>} - The fetched data.
 */
const fetcher = (url: string, queryParams: string) => {
    return fetch(`${url}?${queryParams}`).then(r => r.json());
}

/**
 * CreateJobButton component.
 * @param {Object} props - The component props.
 * @param {searchParamsType} [props.searchParams] - The search parameters.
 * @param {Function} props.setValues - Function to set values.
 * @param {Object} props.params - The parameters.
 * @returns {JSX.Element} - The rendered component.
 */
const CreateJobButton = ({ setValues, params, searchParams }: { searchParams?: searchParamsType, setValues: (pairs: Array<[value: string, key: string]>) => void, params: { startDate?: string, endDate?: string, bbox?: string, off?: string, collection?: string } }) => {
    const [shouldFetch, setShouldFetch] = useState(false);
    const url = `/api/jobs/create`
    const urlParams = new URLSearchParams(params)

    const { data, isLoading } = useSWR(shouldFetch ? [url, urlParams.toString()] : null, () => fetcher(url, urlParams.toString()));

    if (shouldFetch && data) {
        setShouldFetch(false)
    }

    if (data?.jobId) {
        setTimeout(() => {
            setValues([["3", 'step'], [data.jobId, 'jobid']])
        }, 50)
    }

    /**
     * Handles the button click event.
     */
    function handleClick() {
        setShouldFetch(true);
    }

    const bboxPoints = searchParams?.bbox?.split(",");

    return (
        <Button leftSection={<IconCheck size={14} />} disabled={isLoading || !bboxPoints} className="worldCereal-Button" onClick={handleClick} >{isLoading ? 'Creating...' : 'Create process'}</Button>
    );
}

/**
 * Page component.
 * @param {Object} props - The component props.
 * @param {searchParamsType} [props.searchParams] - The search parameters.
 * @returns {JSX.Element} - The rendered component.
 */
export default function Page({ searchParams }: {
    searchParams?: searchParamsType
}) {
    const bbox: BboxCornerPointsType = searchParams?.bbox?.split(",").map(Number) as BboxCornerPointsType;

    const [areaBbox, setAreaBbox] = useState<number | undefined>(undefined);
    const [coordinatesToDisplay, setCoordinatesToDisplay] = useState<string | string[] | null>(null);
    const [currentExtent, setCurrentExtent] = useState<BboxCornerPointsType>(bbox);

    const router = useRouter()
    const startDate = searchParams?.startDate || "2021-01-01";
    const startDateDate = useMemo(() => new Date(startDate), [startDate]);

    const endDate = searchParams?.endDate || "2021-12-30";
    const endDateDate = useMemo(() => new Date(endDate), [endDate]);

    const collection = searchParams?.collection || undefined;

    const params = {
        bbox: searchParams?.bbox || undefined,
        startDate: startDate,
        endDate: endDate,
        collection: collection,
        off: searchParams?.off || defaultOutputFileFormat,
    }

    /**
     * Sets a value in the URL search parameters.
     * @param {string | null | undefined} value - The value to set.
     * @param {string} key - The key to set the value for.
     */
    const setValue = useCallback((value: string | null | undefined, key: string) => {
        const url = new URL(window.location.href);

        if (value) {
            url.searchParams.set(key, value);
        } else {
            url.searchParams.delete(key);
        }
        // @ts-expect-error 'shallow' does not exist in type 'NavigateOptions'
        router.push(url.toString(), { shallow: true, scroll: false })
    }, [router]);

    /**
     * Sets multiple values in the URL search parameters.
     * @param {Array<[string | null | undefined, string]>} pairs - The pairs of values and keys to set.
     */
    const setValues = (pairs: [value: string | null | undefined, key: string, val?: any][]) => {
        const url = new URL(window.location.href);

        pairs.forEach(([value, key]) => {
            url.searchParams.set(key, value || "");
        })

        // @ts-expect-error 'shallow' does not exist in type 'NavigateOptions'
        router.push(url.toString(), { shallow: true, scroll: false })
    }

    /**
     * Transforms a Date object to a string in the format YYYY-MM-DD.
     * @param {Date | null} value - The date to transform.
     * @returns {string | null} - The transformed date string.
     */
    const transformDate = (value: Date | null) => {
        return value ? new Date(value).toISOString().split("T")[0] : null;
    }

    /**
     * Handles the change of the bounding box.
     * @param {Array<Array<number>> | null} extent - The new bounding box extent.
     */
    const onBboxChange = (extent?: Array<Array<number>> | null) => {
        if (extent?.length === 4) {
            const cornerPoints: BboxCornerPointsType = [extent?.[2][0], extent?.[2][1], extent?.[0][0], extent?.[0][1]];
            setCurrentExtent(cornerPoints);
        } else {
            setCurrentExtent(undefined);
        }
    }

    /**
     * Handles the change of the output file format.
     * @param {OutputFileFormatType} off - The new output file format.
     */
    const onOutpoutFormatChange = (off?: OutputFileFormatType) => {
        setValue(off, 'off');
    }

    useEffect(() => {
        setValue(transformDate(endDateDate), 'endDate')
        setValue(transformDate(startDateDate), 'startDate')
        setValue(currentExtent?.join(","), 'bbox');
    }, [setValue, endDateDate, startDateDate, currentExtent]);

    const collectionName = collection && products.find(p => p.value === collection)?.label;

    return <TwoColumns>
        <Column>
            <FormLabel>Draw the extent (maximum 500 x 500 km)</FormLabel>
            <MapBBox onBboxChange={onBboxChange} bbox={bbox?.map(Number)} setAreaBbox={setAreaBbox} setCoordinatesToDisplay={setCoordinatesToDisplay} />
            <FormLabel>Current extent: {bbox ? coordinatesToDisplay : "none"} {areaBbox && bbox ? `(${areaBbox} sqkm)` : ""}</FormLabel>
            <PageSteps NextButton={createElement(CreateJobButton, { setValues, params, searchParams })} />
        </Column>
        <Column>
            <Stack gap="lg" w="100%" align="flex-start">
                <div>
                    <FormLabel>Product/collection</FormLabel>
                    <div>{collectionName}</div>
                </div>
                <DateInput
                    size="md"
                    className="worldCereal-DateInput"
                    value={startDateDate}
                    onChange={(value) => setValue(transformDate(value), 'startDate')}
                    label="Start date"
                    placeholder="Select start date"
                    valueFormat="YYYY-MM-DD"
                    minDate={minDate}
                    maxDate={endDateDate || maxDate}
                    clearable={false}
                    disabled
                />
                <DateInput
                    size="md"
                    className="worldCereal-DateInput"
                    value={endDateDate}
                    onChange={(value) => setValue(transformDate(value), 'endDate')}
                    label="End date"
                    placeholder="Select end date"
                    valueFormat="YYYY-MM-DD"
                    minDate={startDateDate || minDate}
                    maxDate={maxDate}
                    clearable={false}
                    disabled
                />
                <div>
                    <FormLabel>Output file format</FormLabel>
                    <SegmentedControl onChange={(value) => onOutpoutFormatChange(value)} className="worldCereal-SegmentedControl" size="md" defaultValue={defaultOutputFileFormat} data={[{ label: 'netCDF', value: 'NETCDF' }, { label: 'GeoTIFF', value: 'GTiff' }]} />
                </div>
            </Stack>
        </Column>
    </TwoColumns>
}