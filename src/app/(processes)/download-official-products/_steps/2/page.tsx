"use client";

import { CreateJobButton } from "@features/(processes)/_components/CreateJobButton";
import PageSteps from "@features/(processes)/_components/PageSteps";
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
  useState,
} from "react";
import { TextDescription } from "@features/(shared)/_layout/_components/Content/TextDescription";
import { SectionContainer } from "@features/(shared)/_layout/_components/Content/SectionContainer";
import { BoundingBoxExtent } from "@features/(processes)/_types/boundingBoxExtent";
import { bboxSizeLimits } from "@features/(processes)/_constants/app";

import formParams from "@features/(processes)/_constants/download-official-products/formParams";

type searchParamsType = {
  step?: string;
  collection?: string;
  product?: string;
  bbox?: string;
  width?: string;
  height?: string;
  outputFileFormat?: string;
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

  const router = useRouter();

  useEffect(() => {
    if (bboxExtent) setValue(bboxExtent.join(","), "bbox");
  }, [bboxExtent]);

  useEffect(() => {
    if (outputFileFormatState) setValue(outputFileFormatState, "outputFileFormat");
  }, [outputFileFormatState]);

  const collection = searchParams?.collection || undefined;
  const product = searchParams?.product || undefined;
  const outputFileFormat = searchParams?.outputFileFormat || undefined;

  const params = {
    bbox: searchParams?.bbox,
    outputFileFormat,
    collection,
    product
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

  const isDisabled = !bboxIsInBounds || !bbox || !collection || !product || !outputFileFormat;

  return (
    <TwoColumns>
      <Column>
				<SectionContainer>
					<Group gap={"0.3rem"} align="baseline">
						<FormLabel>Draw the extent</FormLabel>
						<TextDescription color={"var(--textSecondaryColor)"}>(MIN: 900 m<sup>2</sup>, MAX: 100 000 km<sup>2</sup>)</TextDescription>
					</Group>
					<MapBBox
						mapSize={[650, 400]}
						minBboxArea={bboxSizeLimits.downloadProducts.min}
						maxBboxArea={bboxSizeLimits.downloadProducts.max}
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
          <div style={{ width: "100%" }}>
            <FormLabel>Choose output file format</FormLabel>
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
