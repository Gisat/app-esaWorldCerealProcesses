"use client";

import { CreateJobButton } from "@features/(processes)/_components/CreateJobButton";
import PageSteps from "@features/(processes)/_components/PageSteps";
import { SelectMonth } from "@features/(processes)/_components/SelectMonth";
import { SelectOutput } from "@features/(processes)/_components/SelectOutput";
import { MapBBox } from "@features/(shared)/_components/map/MapBBox";
import { useUrlParam } from "@features/(shared)/_hooks/_url/useUrlParam";
import FormLabel from "@features/(shared)/_layout/_components/FormLabel";
import TwoColumns, {
  Column,
} from "@features/(shared)/_layout/_components/TwoColumns";
import { Anchor, Group, Stack, Text } from "@mantine/core";
import { createElement, useEffect, useState } from "react";

type BboxCornerPointsType = [number, number, number, number] | undefined;

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
    off?: string;
  };
}) {
  // hooks
  const { setUrlParam } = useUrlParam();

  // constants
  const minDate = new Date("2018-01-01");
  const maxDate = new Date("2024-12-31");
  const defaultOutputValue: "GTiff" | "NETCDF" = "GTiff";
  const defaultOutputValues: object = [
    { label: "NetCDF", value: "NETCDF" },
    { label: "GeoTiff", value: "GTiff" },
  ];
  const apiUrl = "/api/jobs/create/from-process";

  const bbox: BboxCornerPointsType = searchParams?.bbox
    ?.split(",")
    .map(Number) as BboxCornerPointsType;

  const [areaBbox, setAreaBbox] = useState<number | undefined>(undefined);
  const [coordinatesToDisplay, setCoordinatesToDisplay] = useState<
    string | string[] | null
  >(null);
  const [currentExtent, setCurrentExtent] =
    useState<BboxCornerPointsType>(bbox);

  const collection = searchParams?.collection || undefined;
  const off = searchParams?.off || undefined;
  const startDate = searchParams?.startDate || undefined;
  const endDate = searchParams?.endDate || undefined;

  const params = {
    bbox: searchParams?.bbox || undefined,
    startDate: startDate,
    endDate: endDate,
    collection: collection,
    off: off,
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
   *  Pushing params to URL
   */
  const onOutpoutFormatChange = (value: "GTiff" | "NETCDF") => {
    setUrlParam("off", value);
  };

  const handleDateChange = (startDate: string, endDate: string) => {
    setUrlParam("startDate", startDate);
    setUrlParam("endDate", endDate);
  };

  useEffect(() => {
    setUrlParam("bbox", currentExtent?.join(","));
  }, [setUrlParam, currentExtent]);

  const isDisabled = !params.bbox || !params.collection || !params.endDate;

  return (
    <TwoColumns>
      <Column>
        <Group justify="space-between" w="100%" mb="md">
          <FormLabel>Draw the extent</FormLabel>
          <Text fz="14">
            Current extent: {bbox ? coordinatesToDisplay : "none"}{" "}
            {areaBbox && bbox ? `(${areaBbox} sqkm)` : ""}
          </Text>
        </Group>
        <MapBBox
          mapSize={[500, 500]}
          extentSizeInMeters={[50000, 50000]} // MAX Bbox size set to 2500km2
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
            params,
            searchParams,
            apiUrl,
            disabled: isDisabled,
          })}
          disabled={isDisabled}
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
            <SelectMonth
              label="Ending month"
              disabled={false}
              placeholder="Select month"
              minDate={minDate} // Min Start Date (1/1/18)
              maxDate={maxDate} // Max End Date (31/12/24)
              onChange={handleDateChange}
            />
          </div>

          <div>
            <FormLabel>Output file format</FormLabel>
            <SelectOutput
              onChange={onOutpoutFormatChange}
              defaultValue={defaultOutputValue}
              data={defaultOutputValues}
            />
          </div>
        </Stack>
      </Column>
    </TwoColumns>
  );
}
