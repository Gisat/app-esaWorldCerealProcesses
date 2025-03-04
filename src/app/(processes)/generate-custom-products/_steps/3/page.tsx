"use client";

import { apiFetcher } from "@features/(shared)/_url/apiFetcher";
import { Button } from "@mantine/core";
import { useRouter } from "next/navigation";
import { createElement, useState } from "react";
import useSWR from "swr";

import PageSteps from "@features/(processes)/_components/PageSteps";

import Details from "@features/(processes)/_components/ProcessesTable/Details";
import { pages } from "@features/(processes)/_constants/app";

/**
 * A button component that starts a job process when clicked and navigates to the process list upon success.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.jobId] - The ID of the job to start. If undefined, no job will be started.
 * @returns {JSX.Element} A button that starts the job and redirects the user to the process list.
 *
 * @example
 * <StartJobButton jobId="12345" />
 */
const StartJobButton = ({ jobId }: { jobId?: string }) => {
  const router = useRouter();
  const [shouldFetch, setShouldFetch] = useState(false);
  const url = `/api/jobs/start/${jobId}`;

  const { data, isLoading } = useSWR(shouldFetch ? [url] : null, () =>
    apiFetcher(url)
  );

  if (shouldFetch && data) {
    setShouldFetch(false);
  }

  if (data?.result?.jobId) {
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
    >
      {isLoading ? "Starting..." : "Start process and go to the list"}
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
    jobKey?: string;
  };
}) {
  const jobKey = searchParams?.jobKey;

  // TODO: better logic to be implemented
  const { data } = useSWR(`/api/jobs/get/${jobKey}`, apiFetcher);

  return (
    <>
      {data ? (
        <Details
          bbox={data?.bbox}
          startDate={data?.timeRange?.[0]}
          endDate={data?.timeRange?.[1]}
          resultFileFormat={data?.resultFileFormat}
          oeoCollection={data?.oeoCollection}
        />
      ) : null}
      <PageSteps NextButton={createElement(StartJobButton, { jobId: jobKey })} />
    </>
  );
}
