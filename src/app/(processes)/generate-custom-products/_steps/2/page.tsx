"use client";

import { CreateJobButton } from "@features/(processes)/_components/CreateJobButton";
import PageSteps from "@features/(processes)/_components/PageSteps";
import { SelectMonth } from "@features/(processes)/_components/SelectMonth";
import {
  bboxSizeLimits,
  customProductsDateLimits,
  defaultProductsDates,
} from "@features/(processes)/_constants/app";
import { BoundingBoxExtent } from "@features/(processes)/_types/boundingBoxExtent";
import { MapBBox } from "@features/(shared)/_components/map/MapBBox";
import FormLabel from "@features/(shared)/_layout/_components/Content/FormLabel";
import { SectionContainer } from "@features/(shared)/_layout/_components/Content/SectionContainer";
import { TextDescription } from "@features/(shared)/_layout/_components/Content/TextDescription";
import { TextLink } from "@features/(shared)/_layout/_components/Content/TextLink";
import TwoColumns, {
  Column,
} from "@features/(shared)/_layout/_components/Content/TwoColumns";
import { Group, Stack, SegmentedControl } from "@mantine/core";
import { useRouter } from "next/navigation";
import { createElement, useState, useEffect, useCallback } from "react";

import formParams from "@features/(processes)/_constants/generate-custom-products/formParams";
import { set } from "lodash";

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
    endDate?: string;
    product?: string;
    bbox?: string;
    outputFileFormat?: string;
    model?: string;
  };
}) {
  const router = useRouter();
  const apiUrl = "/api/jobs/create/from-process";

  const bbox: BoundingBoxExtent = searchParams?.bbox
    ?.split(",")
    .map(Number) as BoundingBoxExtent;

  const [bboxDescription, setBboxDescription] = useState<
    string | string[] | null
  >(null);
  const [bboxExtent, setBboxExtent] =
    useState<BoundingBoxExtent | null>(bbox);
  const [bboxIsInBounds, setBboxIsInBounds] = useState<boolean | null>(null);
  const [outputFileFormatState, setOutputFileFormatState] = useState<string | null>(null);

  useEffect(() => {
    if (bboxExtent) setValue(bboxExtent.join(","), "bbox");
  }, [bboxExtent]);

  useEffect(() => {
    if (outputFileFormatState) setValue(outputFileFormatState, "outputFileFormat");
  }, [outputFileFormatState]);

  const product = searchParams?.product || undefined;
  const endDate = searchParams?.endDate || defaultProductsDates.endDate;
  const outputFileFormat = searchParams?.outputFileFormat || undefined;
  const model = searchParams?.model || undefined;

  const params = {
    bbox: searchParams?.bbox,
    endDate,
    product,
    outputFileFormat,
    model
  };

  const isDisabled =
    !bboxIsInBounds ||
    !params.bbox ||
    !params.product ||
    !params.endDate ||
    !params.outputFileFormat ||
    !params.model;


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

  return (
    <TwoColumns>
      <Column>
        <SectionContainer>
          <Group gap={"0.3rem"} align="baseline">
            <FormLabel>Draw the extent</FormLabel>
            <TextDescription color={"var(--textSecondaryColor)"}>(MIN: 900 m<sup>2</sup>, MAX: 2 500 km<sup>2</sup>)</TextDescription>
          </Group>
          <MapBBox
            mapSize={[650, 400]}
            minBboxArea={bboxSizeLimits.customProducts.min}
            maxBboxArea={bboxSizeLimits.customProducts.max}
            bbox={bbox?.map(Number)}
            setBboxDescription={setBboxDescription}
            setBboxExtent={setBboxExtent}
            setBboxIsInBounds={setBboxIsInBounds}
          />
          <TextDescription>
            Current extent: {bboxDescription ? <>{bboxDescription} km<sup>2</sup></> : "No extent selected"}
          </TextDescription>
        </SectionContainer>
        <TextDescription>
          <b>
            Avoid too large areas to prevent excessive credit usage and long
            processing times!
          </b>
        </TextDescription>
        <TextDescription>
          A run of 250 km<sup>2</sup> will typically consume 40 credits and last around
          20min.
        </TextDescription>
        <TextDescription>
          A run of 750 km<sup>2</sup>  will typically consume 90 credits and last around
          50min.
        </TextDescription>
        <TextDescription>
          A run of 2500 km<sup>2</sup>  will typically consume 250 credits and last around 1h
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
          <div style={{ width: "20rem" }}>
            <SelectMonth
              label="Ending month"
              disabled={false}
              value={endDate}
              minDate={new Date(customProductsDateLimits.min)}
              maxDate={new Date(customProductsDateLimits.max)}
              onChange={(value) => { setValue(value, "endDate") }}
            />
          </div>

          <div style={{ width: "20rem" }}>
            <FormLabel>Output file format</FormLabel>
            <SegmentedControl
              onChange={setOutputFileFormatState}
              className="worldCereal-SegmentedControl"
              size="md"
              value={outputFileFormat}
              defaultValue={formParams.outputFileFormat.options.find((option) => option.default)?.value}
              data={formParams.outputFileFormat.options}
            />
          </div>
        </Stack>
      </Column>
    </TwoColumns>
  );
}
