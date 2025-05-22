"use client";

import { pages } from "@features/(processes)/_constants/app";
import { apiFetcher } from "@features/(shared)/_url/apiFetcher";
import { Button } from "@mantine/core";
import { useRouter } from "next/navigation";
import { createElement, useState } from "react";
import useSWR from "swr";

import PageSteps from "@features/(processes)/_components/PageSteps";

import Details from "@features/(processes)/_components/ProcessesTable/Details";
import { TextParagraph } from "@features/(shared)/_layout/_components/Content/TextParagraph";
import { IconPlayerPlayFilled } from "@tabler/icons-react";
import formParams from "@features/(processes)/_constants/generate-custom-products/formParams";

/**
 * A button component that starts a job process when clicked and navigates to the process list upon success.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.key] - The KEY of the job to start. If undefined, no job will be started.
 * @returns {JSX.Element} A button that starts the job and redirects the user to the process list.
 *
 * @example
 * <StartJobButton key="12345" />
 */
const StartJobButton = ({ jobKey }: { jobKey?: string }) => {
  const router = useRouter();
  const [shouldFetch, setShouldFetch] = useState(false);
  const url = `/api/jobs/start/${jobKey}`;

  const { data, isLoading } = useSWR(shouldFetch ? [url] : null, () =>
    apiFetcher(url)
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

export default function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    step?: string;
    endDate?: string;
    key?: string;
    product?: string;
    bbox?: string;
    outputFileFormat?: string;
    model?: string;
    backgroundLayer?: string;
  };
}) {
  const key = searchParams?.key;

  // TODO: better logic to be implemented
  const { data } = useSWR(`/api/jobs/get/${key}`, apiFetcher);

  const model = formParams.model.options.find(
    (option) => option.value === searchParams?.model
  )?.label;
  const process = formParams.product.options.find(
    (option) => option.value === searchParams?.product
  )?.label;
  const backgroundLayer = searchParams?.backgroundLayer || "esri_WorldImagery";

  return (
    <>
      <TextParagraph color="var(--textAccentedColor)">
        <b>
          You have created the Custom product process with following parameters:
        </b>
      </TextParagraph>
      {data && data.key === searchParams?.key ? (
        <Details
          bbox={data?.bbox}
          startDate={data?.timeRange?.[0]}
          endDate={data?.timeRange?.[1]}
          resultFileFormat={data?.resultFileFormat}
          oeoProcessId={process}
          model={model}
          backgroundLayer={backgroundLayer}
        />
      ) : null}
      <PageSteps NextButton={createElement(StartJobButton, { jobKey: key })} />
    </>
  );
}
