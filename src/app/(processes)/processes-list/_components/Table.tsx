"use client";

import { ProcessesTable } from "@features/(processes)/_components/ProcessesTable";
import { apiFetcher } from "@features/(shared)/_url/apiFetcher";
import useSWR from "swr";

/**
 * Page component that fetches and displays a list of processes using `ProcessesTable`.
 * It automatically refreshes the data every second and allows manual reload.
 *
 * @returns {JSX.Element} A table displaying the list of processes.
 *
 * @example
 * <Page />
 */
export default function Table() {
  const url = `/api/jobs/get/list`;

  const { data, mutate, error } = useSWR(url, apiFetcher, {
    refreshInterval: 15000,
  });

  // Handle error state
  if (error) return "Error from data request";

  /**
   * Triggers a manual refresh of the process list.
   */
  function forceReloadList() {
    mutate();
  }

  // TODO for now, there is a loader even if user haven't created single process yet
  return <ProcessesTable loading={!data?.length} data={data || []} forceReloadList={forceReloadList} />;
}
