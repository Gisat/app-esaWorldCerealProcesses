"use client";

import { apiFetcher } from "@app/(shared)/_fetch/apiFetcher";
import { getBBoxFromSearchParams } from "@app/(shared)/_map/getBbox";
import PageSteps from "@features/(processes)/_components/PageSteps";
import { products } from "@features/(processes)/_constants/app";
import { MapExtentSelect } from "@features/(shared)/_components/map/MapExtentSelect";
import FormLabel from "@features/(shared)/_layout/_components/FormLabel";
import TwoColumns, {
  Column,
} from "@features/(shared)/_layout/_components/TwoColumns";
import { Button, SegmentedControl, Stack } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { IconCheck } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { createElement, useEffect, useState } from "react";
import useSWR from "swr";

const minDate = new Date("2021-01-01");
const maxDate = new Date("2022-01-01");

const defaultWidth = "10000";
const defaultHeight = "10000";

const minSize = 100;
const maxSize = 500000;

type BboxType = [] | number[] | undefined;

type searchParamsType = {
  step?: string;
  startDate?: string;
  endDate?: string;
  collection?: string;
  bbox?: string;
  width?: string;
  height?: string;
};

/**
 * CreateJobButton Component
 *
 * @param {Object} props - Component props
 * @param {Function} props.setValues - Function to update search parameters.
 * @param {Object} props.params - The parameters required for job creation.
 * @param {searchParamsType} props.searchParams - URL search parameters.
 * @returns {JSX.Element} Button component for creating a job process.
 */
const CreateJobButton = ({
  setValues,
  params,
  searchParams,
}: {
  searchParams?: searchParamsType;
  setValues: (pairs: Array<[value: string, key: string]>) => void;
  params: {
    startDate?: string;
    endDate?: string;
    bbox?: string;
    outputFileFormat?: string;
    collection?: string;
  };
}) => {
  const [shouldFetch, setShouldFetch] = useState(false);
  const url = `/api/jobs/create`;
  const urlParams = new URLSearchParams(params);

  const { data, isLoading } = useSWR(
    shouldFetch ? [url, urlParams.toString()] : null,
    () => apiFetcher(url, urlParams.toString())
  );

  if (shouldFetch && data) {
    setShouldFetch(false);
  }

  if (data?.key) {
    setTimeout(() => {
      setValues([
        ["3", "step"],
        [data.key, "jobid"],
      ]);
    }, 50);
  }

  /**
   * Handles button click event to initiate job creation.
   */
  function handleClick() {
    setShouldFetch(true);
  }

  const width = searchParams?.width || defaultWidth;
  const height = searchParams?.height || defaultHeight;
  const widthInvalid =
    width && (Number(width) < minSize || Number(width) > maxSize);
  const heightInvalid =
    height && (Number(height) < minSize || Number(height) > maxSize);

  return (
    <Button
      leftSection={<IconCheck size={14} />}
      disabled={isLoading || !!widthInvalid || !!heightInvalid}
      className="worldCereal-Button"
      onClick={handleClick}
    >
      {isLoading ? "Creating..." : "Create process"}
    </Button>
  );
};

/**
 * Page Component
 *
 * @param {Object} props - Component props
 * @param {searchParamsType} [props.searchParams] - URL search parameters.
 * @returns {JSX.Element} Page component rendering the job creation process.
 */
export default function Page({
  searchParams,
}: {
  searchParams?: {
    step?: string;
    startDate?: string;
    endDate?: string;
    collection?: string;
    bbox?: string;
    width?: string;
    height?: string;
  };
}) {
  const router = useRouter();
  const startDate = searchParams?.startDate || "2021-01-01";
  const startDateDate = new Date(startDate);

  const endDate = searchParams?.endDate || "2021-12-30";
  const endDateDate = new Date(endDate);

  const collection = searchParams?.collection || undefined;

  const width = searchParams?.width || defaultWidth;
  const height = searchParams?.height || defaultHeight;

  const params = {
    bbox: searchParams?.bbox || undefined,
    startDate: startDate,
    endDate: endDate,
    collection: collection,
    outputFileFormat: "NETCDF",
  };

  /**
   * Updates the URL search parameters and navigates to the new URL.
   *
   * @param {string | null | undefined} value - The value to set for the query parameter.
   * @param {string} key - The key of the query parameter to update.
   * @param {any} [val] - Optional additional value.
   */
  const setValue = (
    value: string | null | undefined,
    key: string,
    val?: any
  ) => {
    const url = new URL(window.location.href);

    url.searchParams.set(key, value || "");
    // @ts-expect-error 'shallow' does not exist in type 'NavigateOptions'
    router.push(url.toString(), { shallow: true, scroll: false });
  };

  /**
   * Updates multiple URL search parameters and navigates to the new URL.
   *
   * @param {Array<[string | null | undefined, string, any?]>} pairs - An array of key-value pairs to set in the search parameters.
   */
  const setValues = (
    pairs: [value: string | null | undefined, key: string, val?: any][]
  ) => {
    const url = new URL(window.location.href);

    pairs.forEach(([value, key]) => {
      url.searchParams.set(key, value || "");
    });

    // @ts-expect-error 'shallow' does not exist in type 'NavigateOptions'
    router.push(url.toString(), { shallow: true, scroll: false });
  };

  const transformDate = (value: Date | null) => {
    return value ? new Date(value).toISOString().split("T")[0] : null;
  };

  const onBboxChange = (extent?: BboxType) => {
    setValue(extent?.join(","), "bbox");
  };

  useEffect(() => {
    setValue(transformDate(endDateDate), "endDate");
    setValue(transformDate(startDateDate), "startDate");
  }, [endDateDate, setValue, startDateDate]);

  const collectionName =
    collection && products.find((p) => p.value === collection)?.label;

  const urlParams = new URLSearchParams(window.location.search);
  const bbox = getBBoxFromSearchParams(urlParams);
  const longitude = bbox ? (Number(bbox[0]) + Number(bbox[2])) / 2 : 15;
  const latitude = bbox ? (Number(bbox[1]) + Number(bbox[3])) / 2 : 50;

  return (
    <TwoColumns>
      <Column>
        <FormLabel>Zoom map to select extent</FormLabel>
        <MapExtentSelect
          onBboxChange={onBboxChange}
          extentSizeInMeters={[Number.parseInt(width), Number.parseInt(height)]}
          longitude={longitude}
          latitude={latitude}
        />
        <PageSteps
          NextButton={createElement(CreateJobButton, {
            setValues,
            params,
            searchParams,
          })}
        />
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
            onChange={(value) =>
              setValue(transformDate(value), "startDate", value)
            }
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
            onChange={(value) => setValue(transformDate(value), "endDate")}
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
            <SegmentedControl
              className="worldCereal-SegmentedControl"
              size="md"
              readOnly
              defaultValue="NETCDF"
              data={[
                { label: "netCDF", value: "NETCDF" },
                { label: "GeoTIFF", value: "geotiff", disabled: true },
              ]}
            />
          </div>
        </Stack>
      </Column>
    </TwoColumns>
  );
}
