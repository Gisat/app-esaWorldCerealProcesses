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
import { BoundingBoxExtent } from "@features/(processes)/_types/boundingBoxExtent";
import { OutputFileFormat } from "@features/(processes)/_types/outputFormats";
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
  const [searchParams, setSearchParams] = useState(initialSearchParams || {});
  const mounted = useRef(false);

  // Initialize bbox from URL params first
  const initialBbox = initialSearchParams?.bbox
    ?.split(",")
    .map(Number) as BoundingBoxExtent;

  const [bboxDescription, setBboxDescription] = useState<
    string | string[] | null
  >(null);
  const [bboxExtent, setBboxExtent] = useState<BoundingBoxExtent | null>(
    initialBbox || null
  );
  const [bboxIsInBounds, setBboxIsInBounds] = useState<boolean | null>(null);

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

  // Single consolidated initialization effect
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;

      const requiredParams: [string, string][] = [];
      const currentParams = new URLSearchParams(window.location.search);

      // Check all required parameters at once
      if (!currentParams.has("startDate")) {
        requiredParams.push(["startDate", defaultProductsDates.startDate]);
      }

      if (!currentParams.has("endDate")) {
        requiredParams.push(["endDate", defaultProductsDates.endDate]);
      }

      if (!currentParams.has("off")) {
        requiredParams.push(["off", defaultOutputValue]);
      }

      if (bboxExtent && !currentParams.has("bbox")) {
        requiredParams.push(["bbox", bboxExtent.join(",")]);
      }

      // Only update if we have missing parameters
      if (requiredParams.length > 0) {
        setUrlParams(requiredParams);
        setSearchParams((prev) => ({
          ...prev,
          ...Object.fromEntries(requiredParams),
        }));
      }
    }
  }, [bboxExtent, setUrlParams]);

  // Update bbox only when it actually changes and is valid
  useEffect(() => {
    if (bboxExtent && bboxIsInBounds && mounted.current) {
      setUrlParam("bbox", bboxExtent.join(","));
    }
  }, [setUrlParam, bboxExtent, bboxIsInBounds]);

  // Update searchParams when bbox changes
  useEffect(() => {
    if (bboxExtent && bboxIsInBounds) {
      setSearchParams((prev) => ({
        ...prev,
        bbox: bboxExtent.join(","),
      }));
    }
  }, [bboxExtent, bboxIsInBounds]);

  const product = searchParams?.product || undefined;
  const startDate = searchParams?.startDate || defaultProductsDates.startDate;
  const endDate = searchParams?.endDate || defaultProductsDates.endDate;
  const outputFormat = searchParams?.off || defaultOutputValue;

  const params = {
    bbox: searchParams?.bbox,
    startDate: startDate,
    endDate: endDate,
    product: product,
    off: outputFormat,
  };

  const handleDateChange = (startDate: string, endDate: string) => {
    setUrlParams([
      ["startDate", startDate],
      ["endDate", endDate],
    ]);
  };

  const handleOutputFormatChange = (value: "GTiff" | "NETCDF") => {
    setUrlParam("off", value);
  };

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
            bbox={bboxExtent || undefined}
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
              onChange={handleOutputFormatChange}
              defaultValue={defaultOutputValue}
              value={outputFormat as OutputFileFormat}
              data={defaultOutputValues}
            />
          </div>
        </Stack>
      </Column>
    </TwoColumns>
  );
}
