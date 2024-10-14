import "./style.scss";
import { Table } from "@mantine/core";
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
    data: {

        bbox: string,
        createdIso: string,
        name: string,
        oeoCollection: string,
        resultFileFormat: string,
        results: string,
        status: string,
        timeRange: string,
        updatedIso: string,

        // Original format
        // id: number;
        // type: string;
        // created: string;
        // status: string;
        // result?: string;
        // details?: {
        //     product: string;
        //     startDate: string,
        //     endDate: string,
        //     outputFileFormat: string,
        //     extent: number[],
        // };
    }[];
}

const ProcessesTable = ({ data }: Props) => {
    const rows = data.map(({ resultFileFormat, createdIso, status, results }) => (
        <Record id={createdIso} type={resultFileFormat} created={createdIso} status={status} result={results[0]} />
    ));

    return (
        <Table horizontalSpacing="md" className="worldCereal-ProcessesTable">
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
        </Table>
    );
};

export default ProcessesTable;
