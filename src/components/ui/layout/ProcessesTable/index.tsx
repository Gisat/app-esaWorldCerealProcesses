import "./style.scss";
import { Table } from "@mantine/core";

const ProcessesTable = ({ data }: {
    data: Array<{
        name: string;
        position: number;
        symbol: string;
        mass: number;
    }>
}) => {
    const rows = data.map((item) => (
        <Table.Tr key={item.name} className="worldCereal-ProcessesTable-row">
            <Table.Td>{item.position}</Table.Td>
            <Table.Td>{item.name}</Table.Td>
            <Table.Td>{item.symbol}</Table.Td>
            <Table.Td>{item.mass}</Table.Td>
        </Table.Tr>
    ));

    return (
        <Table highlightOnHover className="worldCereal-ProcessesTable">
            <Table.Thead>
                <Table.Tr className="worldCereal-ProcessesTable-row">
                    <Table.Th>Element position</Table.Th>
                    <Table.Th>Element name</Table.Th>
                    <Table.Th>Symbol</Table.Th>
                    <Table.Th>Atomic mass</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
        </Table>
    );
};

export default ProcessesTable;
