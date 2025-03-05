import { Center, Loader, Table } from "@mantine/core";
import Record from "./Record";
import "./style.css";

type Props = {
  loading?: boolean;
  forceReloadList?: () => void;
  data: {
    bbox: Array<number>;
    costs: number;
    createdIso: Date;
    duration: number;
    key: string;
    type: string;
    name: string;
    oeoCollection: string;
    oeoProcessId: string;
    resultFileFormat: string;
    results: Array<{ source_link: string }>;
    status: string;
    timeRange: Array<Date>;
    updatedIso: Date;
  }[];
};

/**
 * Displays a table of processes with their status, type, and creation date.
 * If `loading` is `true`, a spinner is displayed instead of the table.
 *
 * @param {Props} props - The component properties.
 * @param {boolean} [props.loading] - Indicates if data is still being fetched.
 * @param {() => void} [props.forceReloadList] - Function to force refresh the table data.
 * @param {Array<Object>} props.data - The list of process records.
 * @returns {JSX.Element} A table displaying process records or a loading indicator.
 *
 * @example
 * <ProcessesTable
 *   data={[{ key: "123", type: "Analysis", createdIso: new Date(), status: "Completed", bbox: [], timeRange: [], oeoCollection: "", resultFileFormat: "", results: [] }]}
 *   loading={false}
 *   forceReloadList={() => console.log("Reload triggered")}
 * />
 */
export const ProcessesTable = ({ data, loading, forceReloadList }: Props) => {
  const rows = Array.isArray(data) ? (
    data.map(
      ({
        resultFileFormat,
        createdIso,
        status,
        results,
        key,
        bbox,
        timeRange,
        oeoCollection,
        oeoProcessId,
        type,
      }) => (
        <Record
          key={key}
          jobKey={key}
          type={type}
          createdIso={createdIso}
          status={status}
          results={results}
          bbox={bbox}
          timeRange={timeRange}
          resultFileFormat={resultFileFormat}
          oeoCollection={oeoCollection}
          oeoProcessId={oeoProcessId}
          forceReloadList={forceReloadList}
        />
      )
    )
  ) : (
    <p>No records</p>
  );

  return (
    <>
      {loading ? (
        <Center>
          <Loader />
        </Center>
      ) : (
        <Table horizontalSpacing="md" className="worldCereal-ProcessesTable">
          <Table.Thead>
            <Table.Tr className="worldCereal-ProcessesTable-row">
              <Table.Th>ID</Table.Th>
              <Table.Th>Type</Table.Th>
              <Table.Th>Created</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      )}
    </>
  );
};
