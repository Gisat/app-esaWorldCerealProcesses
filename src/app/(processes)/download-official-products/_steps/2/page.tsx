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

	const isDisabled = !params.bbox || !params.endDate || !params.startDate || !params.off;


  return (
    <TwoColumns>
      <Column>
				<SectionContainer>
					<Group gap={"0.3rem"} align="baseline">
						<FormLabel>Draw the extent</FormLabel>
						<TextDescription color={"var(--textSecondaryColor)"}>(maximum 500 x 500 km)</TextDescription>
					</Group>
					<MapBBox
						mapSize={[550, 400]}
						onBboxChange={onBboxChange}
						bbox={bbox?.map(Number)}
						setAreaBbox={setAreaBbox}
						setCoordinatesToDisplay={setCoordinatesToDisplay}
						coordinatesToDisplay={coordinatesToDisplay}
					/>
					<TextDescription>
						Current extent: {bbox ? coordinatesToDisplay : "none"}{" "}
						{areaBbox && bbox ? `(${areaBbox} sqkm)` : ""}
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
