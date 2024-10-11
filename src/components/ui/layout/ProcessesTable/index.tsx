import "./style.scss";
import { Table } from "@mantine/core";
import Record from "./Record";

type Props = {
    data: {
        id: number;
        type: string;
        created: string;
        status: string;
        result: string;
        details?: {
            product: string;
            startDate: string,
            endDate: string,
            outputFileFormat: string,
            extent: number[],
        };
    }[];
}

const ProcessesTable = ({ data }: Props) => {
    const rows = data.map(({ id, type, created, status, result, details }) => (
        <Record id={id} type={type} created={created} status={status} result={result} details={details} />
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
