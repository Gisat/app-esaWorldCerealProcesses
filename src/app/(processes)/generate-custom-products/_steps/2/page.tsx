"use client";

import { apiFetcher } from "@app/(shared)/_fetch/apiFetcher";
import PageSteps from "@features/(processes)/_components/PageSteps";
import { products } from "@features/(processes)/_constants/app";
import { MapBBox } from "@features/(shared)/_components/map/MapBBox";
import {
  createElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
// import { MapExtentSelect } from "@features/(shared)/_components/map/MapExtentSelect";
import FormLabel from "@features/(shared)/_layout/_components/FormLabel";
import TwoColumns, {
  Column,
} from "@features/(shared)/_layout/_components/TwoColumns";
import {
  Anchor,
  Button,
  Group,
  SegmentedControl,
  Stack,
  Text,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { IconCheck } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import useSWR from "swr";

const minDate = new Date("2021-01-01");
const maxDate = new Date("2022-01-01");

const defaultOutputFileFormat = "GTiff";

type BboxCornerPointsType = [number, number, number, number] | undefined;
type OutputFileFormatType = string | undefined;

const defaultWidth = "10000";
const defaultHeight = "10000";

const minSize = 100;
const maxSize = 500000;

type searchParamsType = {
  step?: string;
  startDate?: string;
  endDate?: string;
  collection?: string;
  bbox?: string;
  width?: string;
  height?: string;
  off?: string;
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
    off?: string;
    outputFileFormat?: string;
    collection?: string;
  };
}) => {
  const [shouldFetch, setShouldFetch] = useState(false);
  const url = `/api/jobs/create/from-process`;
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
  const bbox: BboxCornerPointsType = searchParams?.bbox
    ?.split(",")
    .map(Number) as BboxCornerPointsType;

  const [areaBbox, setAreaBbox] = useState<number | undefined>(undefined);
  const [coordinatesToDisplay, setCoordinatesToDisplay] = useState<
    string | string[] | null
  >(null);
  const [currentExtent, setCurrentExtent] =
    useState<BboxCornerPointsType>(bbox);

  const router = useRouter();
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
    off: defaultOutputFileFormat,
  };

  /**
   * Sets a value in the URL search parameters.
   * @param {string | null | undefined} value - The value to set.
   * @param {string} key - The key to set the value for.
   */
  const setValue = useCallback(
    (value: string | null | undefined, key: string) => {
      const url = new URL(window.location.href);

      if (value) {
        url.searchParams.set(key, value);
      } else {
        url.searchParams.delete(key);
      }
      // @ts-expect-error 'shallow' does not exist in type 'NavigateOptions'
      router.push(url.toString(), { shallow: true, scroll: false });
    },
    [router]
  );

  /**
   * Sets multiple values in the URL search parameters.
   * @param {Array<[string | null | undefined, string]>} pairs - The pairs of values and keys to set.
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

  /**
   * Transforms a Date object to a string in the format YYYY-MM-DD.
   * @param {Date | null} value - The date to transform.
   * @returns {string | null} - The transformed date string.
   */
  const transformDate = (value: Date | null) => {
    return value ? new Date(value).toISOString().split("T")[0] : null;
  };

  /**
   * Handles the change of the bounding box.
   * @param {Array<Array<number>> | null} extent - The new bounding box extent.
   */
  const onBboxChange = (extent?: Array<Array<number>> | null) => {
    if (extent?.length === 4) {
      const cornerPoints: BboxCornerPointsType = [
        extent?.[2][0],
        extent?.[2][1],
        extent?.[0][0],
        extent?.[0][1],
      ];
      setCurrentExtent(cornerPoints);
    } else {
      setCurrentExtent(undefined);
    }
  };

  /**
   * Handles the change of the output file format.
   * @param {OutputFileFormatType} off - The new output file format.
   */
  const onOutpoutFormatChange = (off?: OutputFileFormatType) => {
    setValue(off, "off");
  };

  useEffect(() => {
    setValue(transformDate(endDateDate), "endDate");
    setValue(transformDate(startDateDate), "startDate");
    setValue(currentExtent?.join(","), "bbox");
  }, [setValue, endDateDate, startDateDate, currentExtent]);

  const collectionName =
    collection && products.find((p) => p.value === collection)?.label;

  return (
    <TwoColumns>
      <Column>
        <Group justify="space-between" w="100%" mb="md">
          <FormLabel>Draw the extent</FormLabel>
          <Text fz="14">
            Current extent: -2.53, 35.23, 4.56, 49,72 (7654 sqkm)
          </Text>
        </Group>
        <MapBBox
          onBboxChange={onBboxChange}
          bbox={bbox?.map(Number)}
          setAreaBbox={setAreaBbox}
          setCoordinatesToDisplay={setCoordinatesToDisplay}
        />
        <Text fw="bold" fz="sm" mt="md">
          Avoid too large areas to prevent excessive credit usage and long
          processing times!
        </Text>
        <Text fz="sm">
          A run of 250km2 will typically consume 40 credits and last around
          20min.
        </Text>
        <Text fz="sm">
          A run of 750km2 will typically consume 90 credits and last around
          50min.
        </Text>
        <Text fz="sm">
          A run of 2500km2 will typically consume 250 credits and last around 1h
          40min.
        </Text>
        <PageSteps
          NextButton={createElement(CreateJobButton, {
            setValues,
            params,
            searchParams,
          })}
        />
      </Column>
      <Column>
        <Stack gap="md" w="100%" align="flex-start">
          <div>
            <FormLabel>Select season of interest</FormLabel>
            <div>
              <Text>
                Define the end month of your processing period. The default
                length of the period is 12 months.
              </Text>
              <Text>
                To guide your decision concerning the processing period, you can
                consult the{" "}
                <Anchor
                  href="https://ipad.fas.usda.gov/ogamaps/cropcalendar.aspx"
                  target="_blank"
                  underline="always"
                >
                  USDA crop calendars
                </Anchor>
              </Text>
            </div>
          </div>
          <div>
            <DateInput
              size="md"
              className="worldCereal-DateInput"
              value={startDateDate}
              onChange={(value) => setValue(transformDate(value), "startDate")}
              label="Ending month"
              placeholder="Select month"
              valueFormat="MMMM YYYY"
              minDate={minDate}
              maxDate={endDateDate || maxDate}
              clearable={false}
              disabled
            />

            <Stack mt="xs" gap={0}>
              <Text fz="sm">Start date: 2023-05-01</Text>
              <Text fz="sm">End date: 2024-04-30</Text>
            </Stack>
          </div>

          <div>
            <FormLabel>Output file format</FormLabel>
            <SegmentedControl
              onChange={(value) => onOutpoutFormatChange(value)}
              className="worldCereal-SegmentedControl"
              size="md"
              defaultValue={defaultOutputFileFormat}
              data={[
                { label: "NetCDF", value: "NETCDF" },
                { label: "GeoTiff", value: "GTiff" },
              ]}
            />
          </div>
        </Stack>
      </Column>
    </TwoColumns>
  );
}
