import "./style.scss";
import {Table} from "@mantine/core";
import ProcessStatus from "../../../atoms/ProcessStatus";

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

const ProcessesTable = ({data}: Props) => {
    const rows = data.map((item) => (
        <Table.Tr key={item.id} className="worldCereal-ProcessesTable-row">
            <Table.Td>{item.id}</Table.Td>
            <Table.Td className="highlightedCell">{item.type}</Table.Td>
            <Table.Td>{item.created}</Table.Td>
            <Table.Td><ProcessStatus status={item.status} /></Table.Td>
            <Table.Td>{item.result}</Table.Td>
        </Table.Tr>
    ));

    return (
        <Table highlightOnHover className="worldCereal-ProcessesTable">
            <Table.Thead>
                <Table.Tr className="worldCereal-ProcessesTable-row">
                    <Table.Th>ID</Table.Th>
                    <Table.Th>Type</Table.Th>
                    <Table.Th>Created</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Result</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
        </Table>
    );
};

export default ProcessesTable;
