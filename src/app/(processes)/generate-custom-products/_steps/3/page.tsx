"use client";

import { customProducts, pages } from "@features/(processes)/_constants/app";
import { requiredParamsStep3 as requiredParams } from "@features/(processes)/_constants/generate-custom-products/requiredParams";
import { useStepValidation } from "@features/(processes)/_hooks/_url/useStepValidation";
import { apiFetcher } from "@features/(shared)/_url/apiFetcher";
import { Button } from "@mantine/core";
import { useRouter } from "next/navigation";
import { createElement, useState } from "react";
import useSWR from "swr";

import PageSteps from "@features/(processes)/_components/PageSteps";

import Details from "@features/(processes)/_components/ProcessesTable/Details";
import { TextParagraph } from "@features/(shared)/_layout/_components/Content/TextParagraph";
import { IconPlayerPlayFilled } from "@tabler/icons-react";

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
    startDate?: string;
    endDate?: string;
    key?: string;
    product?: string;
  };
}) {
  // constants:
  // Define validation functions for each parameter
  const paramValidations = {
    product: (value: string) => customProducts.some((p) => p.value === value),
    startDate: (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value),
    endDate: (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value),
    outputFileFormat: (value: string) =>
      value === "NETCDF" || value === "GTiff",
    bbox: (value: string) => value.split(",").map(Number).length === 4,
  };

  // security validation
  useStepValidation(
    3,
    requiredParams,
    paramValidations,
    "/generate-custom-products?step=2"
  );

  const key = searchParams?.key;

  // TODO: better logic to be implemented
  const { data } = useSWR(`/api/jobs/get/${key}`, apiFetcher);

  return (
    <>
      <TextParagraph color="var(--textAccentedColor)">
        <b>
          You have created the Download official products process with following
          parameters:
        </b>
      </TextParagraph>
      {data ? (
        <Details
          bbox={data?.bbox}
          startDate={data?.timeRange?.[0]}
          endDate={data?.timeRange?.[1]}
          resultFileFormat={data?.resultFileFormat}
          oeoCollection={data?.oeoCollection}
          oeoProcessId={data?.oeoProcessId}
        />
      ) : null}
      <PageSteps NextButton={createElement(StartJobButton, { jobKey: key })} />
    </>
  );
}
