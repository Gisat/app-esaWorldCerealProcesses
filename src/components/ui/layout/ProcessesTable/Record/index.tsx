import "./style.scss";
import { ActionIcon, Table } from "@mantine/core";
import { IconDotsVertical } from '@tabler/icons-react';
import ProcessStatus from "../../../../atoms/ProcessStatus";
import { useState } from "react";
import Details from "@/components/ui/layout/ProcessesTable/Details";

type Props = {
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
}

const ProcessesTable = ({
	id,
	type,
	created,
	status,
	result,
	details
}: Props) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const className = `worldCereal-ProcessesTable-row${isExpanded ? ' is-expanded' : ''}`;

	return (
		<>
			<Table.Tr key={id} className={className}>
				<Table.Td>{id}</Table.Td>
				<Table.Td className="highlightedCell">{type}</Table.Td>
				<Table.Td>{created}</Table.Td>
				<Table.Td><ProcessStatus status={status} /></Table.Td>
				<Table.Td>{result}</Table.Td>
				<Table.Td className="alignRight">
					<ActionIcon variant="subtle" aria-label="Settings" onClick={() => setIsExpanded(!isExpanded)}>
						<IconDotsVertical style={{ width: '70%', height: '70%' }} stroke={1.5} />
					</ActionIcon>
				</Table.Td>
			</Table.Tr>
			{isExpanded && (
				<Table.Tr className={className}>
					<Table.Td colSpan={6}>
						{details ? <Details {...details} /> : null}
					</Table.Td>
				</Table.Tr>
			)}
		</>
	);
};

export default ProcessesTable;
