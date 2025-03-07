"use client";

import { CreateJobButton } from "@features/(processes)/_components/CreateJobButton";
import PageSteps from "@features/(processes)/_components/PageSteps";
import { SelectMonth } from "@features/(processes)/_components/SelectMonth";
import { SelectOutput } from "@features/(processes)/_components/SelectOutput";
import {
  customProducts,
  customProductsDateLimits,
  defaultProductsDates,
} from "@features/(processes)/_constants/app";
import { useStepValidation } from "@features/(processes)/_hooks/_url/useStepValidation";
import { useUrlParamCheck } from "@features/(processes)/_hooks/_url/useUrlParamCheck";
import { MapBBox } from "@features/(shared)/_components/map/MapBBox";
import { useUrlParam } from "@features/(shared)/_hooks/_url/useUrlParam";
import FormLabel from "@features/(shared)/_layout/_components/Content/FormLabel";
import { SectionContainer } from "@features/(shared)/_layout/_components/Content/SectionContainer";
import { TextDescription } from "@features/(shared)/_layout/_components/Content/TextDescription";
import { TextLink } from "@features/(shared)/_layout/_components/Content/TextLink";
import TwoColumns, {
  Column,
} from "@features/(shared)/_layout/_components/Content/TwoColumns";
import { Group, Stack } from "@mantine/core";
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
    product?: string;
    bbox?: string;
    off?: string;
    // TODO:
    // model?: string;
  };
}) {
  // hooks
  const { setUrlParam, setUrlParams } = useUrlParam();
  const hasStartDate = useUrlParamCheck("startDate");
  const hasEndDate = useUrlParamCheck("endDate");

  // constants
  const requiredParams = {
    product: true,
    startDate: false,
    endDate: false,
    outputFileFormat: false,
    bbox: false,
  };

  // Define validation functions for each parameter
  const paramValidations = {
    product: (value: string) => customProducts.some((p) => p.value === value),
  };
  const minDate = new Date(customProductsDateLimits.min);
  const maxDate = new Date(customProductsDateLimits.max);
  const defaultOutputValue: "GTiff" | "NETCDF" = "GTiff";
  const defaultOutputValues: object = [
    { label: "NetCDF", value: "NETCDF" },
    { label: "GeoTiff", value: "GTiff" },
  ];
  const apiUrl = "/api/jobs/create/from-process";

  // security validation
  useStepValidation(
    2,
    requiredParams,
    paramValidations,
    "/generate-custom-products?step=1"
  );

  const bbox: BboxCornerPointsType = searchParams?.bbox
    ?.split(",")
    .map(Number) as BboxCornerPointsType;

  const [areaBbox, setAreaBbox] = useState<number | undefined>(undefined);
  const [coordinatesToDisplay, setCoordinatesToDisplay] = useState<
    string | string[] | null
  >(null);
  const [currentExtent, setCurrentExtent] =
    useState<BboxCornerPointsType>(bbox);

  // Get params from components

  useEffect(() => {
    if (!hasStartDate || !hasEndDate) {
      setUrlParams([
        ["startDate", defaultProductsDates.startDate],
        ["endDate", defaultProductsDates.endDate],
      ]);
    }
  }, [setUrlParams, hasEndDate, hasStartDate]);

  const product = searchParams?.product || undefined;
  const off = searchParams?.off || undefined;
  const startDate = searchParams?.startDate || defaultProductsDates.startDate;
  const endDate = searchParams?.endDate || defaultProductsDates.endDate;

  const params = {
    bbox: searchParams?.bbox || undefined,
    startDate: startDate,
    endDate: endDate,
    product: product,
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
    setUrlParams([
      ["startDate", startDate],
      ["endDate", endDate],
    ]);
  };

  useEffect(() => {
    setUrlParam("bbox", currentExtent?.join(","));
  }, [setUrlParam, currentExtent]);

  const isDisabled =
    !params.bbox ||
    !params.product ||
    !params.endDate ||
    !params.startDate ||
    !params.off;

  return (
    <TwoColumns>
      <Column>
        <SectionContainer>
          <Group justify="space-between" align="end" w="100%">
            <FormLabel>Draw the extent</FormLabel>
            <TextDescription>
              Current extent: {bbox ? coordinatesToDisplay : "none"}{" "}
              {areaBbox && bbox ? `(${areaBbox} sqkm)` : ""}
            </TextDescription>
          </Group>
          <MapBBox
            mapSize={[550, 400]}
            extentSizeInMeters={[50000, 50000]} // MAX Bbox size set to 2500km2
            onBboxChange={onBboxChange}
            bbox={bbox?.map(Number)}
            setAreaBbox={setAreaBbox}
            setCoordinatesToDisplay={setCoordinatesToDisplay}
            coordinatesToDisplay={coordinatesToDisplay}
          />
        </SectionContainer>
        <TextDescription>
          <b>
            Avoid too large areas to prevent excessive credit usage and long
            processing times!
          </b>
        </TextDescription>
        <TextDescription>
          A run of 250km2 will typically consume 40 credits and last around
          20min.
        </TextDescription>
        <TextDescription>
          A run of 750km2 will typically consume 90 credits and last around
          50min.
        </TextDescription>
        <TextDescription>
          A run of 2500km2 will typically consume 250 credits and last around 1h
          40min.
        </TextDescription>
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
              <TextDescription>
                Define the end month of your processing period. The default
                length of the period is 12 months.
              </TextDescription>
              <TextDescription>
                To guide your decision concerning the processing period, you can
                consult the{" "}
                <TextLink url="https://ipad.fas.usda.gov/ogamaps/cropcalendar.aspx">
                  USDA crop calendars
                </TextLink>
              </TextDescription>
            </div>
          </div>
          <div style={{ width: "100%" }}>
            <SelectMonth
              label="Ending month"
              disabled={false}
              placeholder="Select month"
              minDate={minDate} // Min Start Date (31/12/18)
              /**
               * in SelectMonth component the default value is considered
               * the `maxDate`
               */
              maxDate={maxDate} // Max End Date (31/12/24)
              onChange={handleDateChange}
            />
          </div>

          <div style={{ width: "100%" }}>
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
