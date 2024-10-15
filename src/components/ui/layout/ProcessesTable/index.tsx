import "./style.scss";
import { Table, Loader, Center } from "@mantine/core";

import Record from "./Record";



// bbox
// createdIso
// name
// oeoCollection
// resultFileFormat
// results
// status
// timeRange
// updatedIso

type Props = {
    loading: boolean,
    data: {
        "bbox": Array<number>,
        "costs": number,
        "createdIso": Date,
        "duration": number,
        "key": string,
        "name": string,
        "oeoCollection": string,
        "resultFileFormat": string,
        "results": Array<{ "source_link": string }>,
        "status": string,
        "timeRange": Array<Date>,
        "updatedIso": Date
    }[];
}

const ProcessesTable = ({ data, loading }: Props) => {
    const rows = data.map(({ resultFileFormat, createdIso, status, results, key, bbox }) => (
        <Record key={key} id={key} createdIso={createdIso} status={status} results={results} bbox={bbox} />
    ));

    return (
        <>{loading ? (<Center><Loader /></Center>) : (<Table horizontalSpacing="md" className="worldCereal-ProcessesTable">
            <Table.Thead>
                <Table.Tr className="worldCereal-ProcessesTable-row">
                    <Table.Th>ID</Table.Th>
                    <Table.Th>Type</Table.Th>
                    <Table.Th>Created</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Result</Table.Th>
                    <Table.Th></Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
        </Table>)
        }</>
    );
};

export default ProcessesTable;
