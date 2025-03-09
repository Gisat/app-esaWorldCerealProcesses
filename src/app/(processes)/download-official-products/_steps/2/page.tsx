"use client";

import { CreateJobButton } from "@features/(processes)/_components/CreateJobButton";
import PageSteps from "@features/(processes)/_components/PageSteps";
import { transformDate } from "@features/(processes)/_utils/transformDate";
import { MapBBox } from "@features/(shared)/_components/map/MapBBox";
import { TextLink } from "@features/(shared)/_layout/_components/Content/TextLink";
import FormLabel from "@features/(shared)/_layout/_components/Content/FormLabel";
import TwoColumns, {
  Column,
} from "@features/(shared)/_layout/_components/Content/TwoColumns";
import { Group, SegmentedControl, Stack } from "@mantine/core";
import { useRouter } from "next/navigation";
import {
  createElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { TextDescription } from "@features/(shared)/_layout/_components/Content/TextDescription";
import { SectionContainer } from "@features/(shared)/_layout/_components/Content/SectionContainer";

const defaultOutputFileFormat = "GTiff";

type BboxExtentType = [number, number, number, number] | undefined;
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
};

/**
 * Page component.
 * @param {Object} props - The component props.
 * @param {searchParamsType} [props.searchParams] - The search parameters.
 * @returns {JSX.Element} - The rendered component.
 */
export default function Page({
  searchParams,
}: {
  searchParams?: searchParamsType;
}) {
  const apiUrl = "/api/jobs/create/from-collection";
  const bbox: BboxExtentType = searchParams?.bbox
    ?.split(",")
    .map(Number) as BboxExtentType;

  const [bboxDescription, setBboxDescription] = useState<
    string | string[] | null
  >(null);
  const [bboxExtent, setBboxExtent] =
    useState<BboxExtentType>(bbox);
	const [bboxIsInBounds, setBboxIsInBounds] = useState<boolean | null>(null);

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
    off: searchParams?.off || defaultOutputFileFormat,
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
   * Handles the change of the output file format.
   * @param {OutputFileFormatType} off - The new output file format.
   */
  const onOutpoutFormatChange = (off?: OutputFileFormatType) => {
    setValue(off, "off");
  };

  useEffect(() => {
    setValue(transformDate(endDateDate), "endDate");
    setValue(transformDate(startDateDate), "startDate");
    setValue(bboxExtent?.join(","), "bbox");
  }, [setValue, endDateDate, startDateDate, bboxExtent]);

	const isDisabled = !bboxIsInBounds || !params.bbox || !params.endDate || !params.startDate || !params.off;

  return (
    <TwoColumns>
      <Column>
				<SectionContainer>
					<Group gap={"0.3rem"} align="baseline">
						<FormLabel>Draw the extent</FormLabel>
						<TextDescription color={"var(--textSecondaryColor)"}>(MIN: 900 sqm, MAX: 100 000 sqkm)</TextDescription>
					</Group>
					<MapBBox
						minBboxArea={0.9}
						maxBboxArea={100000}
						bbox={bbox?.map(Number)}
						setBboxDescription={setBboxDescription}
						setBboxExtent={setBboxExtent}
						setBboxIsInBounds={setBboxIsInBounds}
					/>
					<TextDescription>
						Current extent: {bboxDescription || "No extent selected"}
					</TextDescription>
				</SectionContainer>
				<TextDescription>
					In case you are interested in larger areas, we recommend to download the AEZ-based products directly from <TextLink url="https://zenodo.org/records/7875105">Zenodo</TextLink>.
				</TextDescription>
        <PageSteps
          NextButton={createElement(CreateJobButton, {
            params,
            searchParams,
            apiUrl,
						disabled: isDisabled
          })}
					disabled={isDisabled}
        />
      </Column>
      <Column>
        <Stack gap="lg" w="100%" align="flex-start">
					<div style={{width: "100%"}}>
            <FormLabel>Choose output file format</FormLabel>
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
