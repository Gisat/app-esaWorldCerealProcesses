"use client";

import { Button } from "@mantine/core";
import { useRouter } from "next/navigation";
import { createElement, useState } from "react";
import useSWR from "swr";

import PageSteps from "@features/(processes)/_components/PageSteps";

import Details from "@features/(processes)/_components/ProcessesTable/Details";
import { pages } from "@features/(processes)/_constants/app";
import { fetcher } from "@features/(shared)/_logic/utils";
import { TextParagraph } from "@features/(shared)/_layout/_components/Content/TextParagraph";
import { IconPlayerPlayFilled } from "@tabler/icons-react";

import formParams from "@features/(processes)/_constants/download-official-products/formParams";

/**
 * StartJobButton component.
 * @param {Object} props - The component props.
 * @param {string} [props.jobKey] - The job KEY.
 * @returns {JSX.Element} - The rendered component.
 */
const StartJobButton = ({ jobKey }: { jobKey?: string }) => {
  const router = useRouter();
  const [shouldFetch, setShouldFetch] = useState(false);
  const url = `/api/jobs/start/${jobKey}`;

  const { data, isLoading } = useSWR(shouldFetch ? [url] : null, () =>
    fetcher(url)
  );

  if (shouldFetch && data) {
    setShouldFetch(false);
  }

  if (data?.key && data?.status) {
    setTimeout(() => {
      router.push(`/${pages.processesList.url}`);
    }, 50);
  }

  function handleClick() {
    setShouldFetch(true);
  }

  return (
    <Button
      className="worldCereal-Button"
      disabled={isLoading}
      onClick={handleClick}
      leftSection={<IconPlayerPlayFilled size={14} />}
    >
      {isLoading ? "Starting..." : "Start process & go to the list"}
    </Button>
  );
};

/**
 * Page component.
 * @param {Object} props - The component props.
 * @param {Object} [props.searchParams] - The search parameters.
 * @param {string} [props.searchParams.query] - The query parameter.
 * @param {string} [props.searchParams.step] - The step parameter.
 * @param {string} [props.searchParams.startDate] - The start date parameter.
 * @param {string} [props.searchParams.endDate] - The end date parameter.
 * @param {string} [props.searchParams.key] - The job KEY parameter.
 * @returns {JSX.Element} - The rendered component.
 */
export default function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    step?: string;
    key?: string;
    bbox?: string;
    outputFileFormat?: string;
    collection?: string;
    product?: string;
  };
}) {
  const key = searchParams?.key;
  const bbox = searchParams?.bbox?.split(",").map(Number);
  const outputFileFormat = formParams.outputFileFormat.options.find(
    (option) => option.value === searchParams?.outputFileFormat
  )?.label;
  const collection = searchParams?.collection;
  const product = formParams.product.options.find(
    (option) => option.value === searchParams?.product
  )?.label;

  const { data } = useSWR(`/api/jobs/get/${key}`, fetcher);

  return (
    <>
      <TextParagraph color="var(--textAccentedColor)"><b>You have created the Download official products process with following parameters:</b></TextParagraph>
      {data && data.key === key ? (
        <Details
          bbox={bbox}
          resultFileFormat={outputFileFormat}
          oeoCollection={product}
          collectionName={collection}
        />
      ) : null}
      <PageSteps NextButton={createElement(StartJobButton, { jobKey: key })} />
    </>
  );
}
