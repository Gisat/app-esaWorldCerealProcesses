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
import { requiredParamsStep2 as requiredParams } from "@features/(processes)/_constants/generate-custom-products/requiredParams";
import { useStepValidation } from "@features/(processes)/_hooks/_url/useStepValidation";
import { useOutputFormat } from "@features/(processes)/_hooks/useOutputFormat";
import { BoundingBoxExtent } from "@features/(processes)/_types/boundingBoxExtent";
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
import { createElement, useEffect, useRef, useState } from "react";

/**
 * Page Component
 *
 * @param {Object} props - Component props
 * @param {searchParamsType} [props.searchParams] - URL search parameters.
 * @returns {JSX.Element} Page component rendering the job creation process.
 */
export default function Page({
  searchParams: initialSearchParams,
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
  const [searchParams, setSearchParams] = useState(initialSearchParams);
  const mounted = useRef(false);

  // constants
  const paramValidations = {
    product: (value: string) => customProducts.some((p) => p.value === value),
  };
  const minDate = new Date(customProductsDateLimits.min);
  const maxDate = new Date(customProductsDateLimits.max);
  const defaultOutputValue: "GTiff" | "NETCDF" = "GTiff";
  const defaultOutputValues: { label: string; value: "GTiff" | "NETCDF" }[] = [
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

  const bbox: BoundingBoxExtent = searchParams?.bbox
    ?.split(",")
    .map(Number) as BoundingBoxExtent;

  const [bboxDescription, setBboxDescription] = useState<
    string | string[] | null
  >(null);
  const [bboxExtent, setBboxExtent] = useState<BoundingBoxExtent | null>(bbox);
  const [bboxIsInBounds, setBboxIsInBounds] = useState<boolean | null>(null);

  const { value: outputFormat, setValue: setOutputFormat } =
    useOutputFormat(defaultOutputValue);

  // Set initial URL params only once
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;

      // Collect all missing parameters that need to be set
      const missingParams: [string, string][] = [];

      if (!initialSearchParams?.startDate || !initialSearchParams?.endDate) {
        missingParams.push(
          ["startDate", defaultProductsDates.startDate],
          ["endDate", defaultProductsDates.endDate]
        );
      }

      // Ensure 'off' parameter is set
      if (!initialSearchParams?.off) {
        missingParams.push(["off", defaultOutputValue]);
      }

      // Set all missing parameters at once if any exist
      if (missingParams.length > 0) {
        console.log("Setting initial params:", missingParams);
        setUrlParams(missingParams);

        // Update local state
        setSearchParams((prev) => ({
          ...prev,
          ...Object.fromEntries(missingParams),
        }));
      }
    }
  }, [initialSearchParams, setUrlParams]);

  // Update local state whenever URL params change
  useEffect(() => {
    setSearchParams(initialSearchParams);
  }, [initialSearchParams]);

  const product = searchParams?.product || undefined;
  const startDate = searchParams?.startDate || defaultProductsDates.startDate;
  const endDate = searchParams?.endDate || defaultProductsDates.endDate;

  const params = {
    bbox: searchParams?.bbox || undefined,
    startDate: startDate,
    endDate: endDate,
    product: product,
    off: outputFormat, // Use outputFormat instead of off
  };

  /**
   *  Update output format using the hook
   */
  const onOutpoutFormatChange = (value: "GTiff" | "NETCDF") => {
    setOutputFormat(value);
  };

  const handleDateChange = (startDate: string, endDate: string) => {
    setUrlParams([
      ["startDate", startDate],
      ["endDate", endDate],
    ]);
  };

  useEffect(() => {
    setUrlParam("bbox", bboxExtent?.join(","));
  }, [setUrlParam, bboxExtent]);

  const isDisabled =
    !bboxIsInBounds ||
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
            <FormLabel>
              Draw the extent (MIN: 900 sqm, MAX: 2 500 sqkm)
            </FormLabel>
            <TextDescription>
              Current extent: {bboxDescription || "No extent selected"}
            </TextDescription>
          </Group>
          <MapBBox
            mapSize={[550, 400]}
            minBboxArea={0.0009}
            maxBboxArea={2500}
            bbox={bbox?.map(Number)}
            setBboxDescription={setBboxDescription}
            setBboxExtent={setBboxExtent}
            setBboxIsInBounds={setBboxIsInBounds}
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
              startDate={searchParams?.startDate}
              endDate={searchParams?.endDate}
              onChange={handleDateChange}
            />
          </div>

          <div style={{ width: "100%" }}>
            <FormLabel>Output file format</FormLabel>
            <SelectOutput
              onChange={onOutpoutFormatChange}
              defaultValue={defaultOutputValue}
              value={outputFormat}
              data={defaultOutputValues}
            />
          </div>
        </Stack>
      </Column>
    </TwoColumns>
  );
}
