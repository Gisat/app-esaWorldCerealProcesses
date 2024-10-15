import "./style.scss";
import { ActionIcon, Button, Table } from "@mantine/core";
import { IconDotsVertical, IconDownload } from '@tabler/icons-react';
import ProcessStatus from "../../../../atoms/ProcessStatus";
import { useState } from "react";
import Details from "@/components/ui/layout/ProcessesTable/Details";

type Props = {
	"bbox"?: Array<number>,
	"costs"?: number,
	"createdIso"?: Date,
	"duration"?: number,
	"id"?: string,
	"name"?: string,
	"oeoCollection"?: string,
	"resultFileFormat"?: string,
	"results"?: Array<{ source_link: string }>,
	"status"?: string,
	"timeRange"?: Array<Date>,
	"updatedIso"?: Date
}

const ProcessesTable = ({
	id,
	// type,
	createdIso,
	status,
	results,
	bbox,
	timeRange,
	resultFileFormat,
	oeoCollection
	// details
}: Props) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const className = `worldCereal-ProcessesTable-row${isExpanded ? ' is-expanded' : ''}`;

	return (
		<>
			<Table.Tr key={id} className={className}>
				<Table.Td>{id}</Table.Td>
				<Table.Td className="highlightedCell">Download</Table.Td>
				<Table.Td>{createdIso && new Date(createdIso).toDateString()}</Table.Td>
				<Table.Td>{status ? <ProcessStatus status={status} /> : null}</Table.Td>
				<Table.Td className="shrinkedCell">{results?.[0] &&
					<Button
						leftSection={<IconDownload size={14} />}
						className="worldCereal-Button"
						size="sm"
						component="a"
						target="_blank"
						href={results[0]?.source_link}
					>
						Download
					</Button>
				}</Table.Td>
				<Table.Td className="alignRight">
					<ActionIcon variant="subtle" aria-label="Settings" onClick={() => setIsExpanded(!isExpanded)}>
						<IconDotsVertical style={{ width: '70%', height: '70%' }} stroke={1.5} />
					</ActionIcon>
				</Table.Td>
			</Table.Tr>
			{isExpanded && (
				<Table.Tr className={className}>
					<Table.Td colSpan={6}>
						<Details bbox={bbox} startDate={timeRange?.[0]} endDate={timeRange?.[1]} resultFileFormat={resultFileFormat} oeoCollection={oeoCollection} />
					</Table.Td>
				</Table.Tr>
			)}
		</>
	);
};

export default ProcessesTable;
