import "./style.css";
import { Table, Loader, Center } from "@mantine/core";
import Record from "./Record";

type Props = {
    loading?: boolean,
    forceReloadList?: () => void,
    data: {
        "bbox": Array<number>,
        "costs": number,
        "createdIso": Date,
        "duration": number,
        "key": string,
        "type": string,
        "name": string,
        "oeoCollection": string,
        "resultFileFormat": string,
        "results": Array<{ "source_link": string }>,
        "status": string,
        "timeRange": Array<Date>,
        "updatedIso": Date,
    }[]
    ;
}

/**
 * ProcessesTable component renders a table displaying a list of processes.
 *
 * @param {Object} props - The component props.
 * @param {Array} props.data - The data array containing process information.
 * @param {boolean} props.loading - A boolean indicating if the data is still loading.
 * @param {Function} props.forceReloadList - A function to force reload the list of processes.
 *
 * @returns {JSX.Element} The rendered ProcessesTable component.
 */
export const ProcessesTable = ({ data, loading, forceReloadList }: Props): JSX.Element => {

    const rows = data?.map(
        ({ resultFileFormat, createdIso, status, results, key, type, bbox, timeRange, oeoCollection }) => (
            <Record key={key} id={key} type={type} createdIso={createdIso} status={status} results={results} bbox={bbox}
                timeRange={timeRange}
                resultFileFormat={resultFileFormat}
                oeoCollection={oeoCollection} forceReloadList={forceReloadList} />
        )
    ) ?? (<p>No records</p>);

    return (
        <>{loading ? (<Center><Loader /></Center>) : (<Table horizontalSpacing="md" className="worldCereal-ProcessesTable">
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
        </Table>)
        }</>
    );
};