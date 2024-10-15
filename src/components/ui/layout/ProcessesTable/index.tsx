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

const ProcessesTable = ({ data, loading }: Props) => {
    const rows = data.map(({ resultFileFormat, createdIso, status, results }) => (
        <Record id={createdIso} type={resultFileFormat} created={createdIso} status={status} result={results[0]} />
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
