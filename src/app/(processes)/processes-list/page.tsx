"use client";

import { apiFetcher } from "@app/(shared)/_fetch/apiFetcher";
import { ProcessesTable } from "@features/(processes)/_components/ProcessesTable";
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
export default function Page() {
  const url = `/api/jobs/get/list`;

  const { data, mutate, error } = useSWR(url, apiFetcher, {
    refreshInterval: 1000,
  });

  // Handle error state
  if (error) return "Error from data request";

  /**
   * Triggers a manual refresh of the process list.
   */
  function forceReloadList() {
    mutate();
  }

  return <ProcessesTable data={data || []} forceReloadList={forceReloadList} />;
}
