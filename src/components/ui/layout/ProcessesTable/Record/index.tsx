import "./style.scss";
import { ActionIcon, Button, Table } from "@mantine/core";
import { IconDotsVertical, IconDownload, IconTrash, IconPlayerPlay } from '@tabler/icons-react';
import ProcessStatus from "../../../../atoms/ProcessStatus";
import { useState } from "react";
import Details from "@/components/ui/layout/ProcessesTable/Details";

import useSWR from "swr";


const fetcher = (url: string) => {
	return fetch(`${url}`).then(r => r.json());
}

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
	forceReloadList?: () => void
}


const StartJobButton = ({ jobId, forceReloadList }: { jobId?: string, forceReloadList?: () => void }) => {
	const [shouldFetch, setShouldFetch] = useState(false);
	const url = `/api/jobs/start/${jobId}`

	const { data, isLoading } = useSWR(shouldFetch ? [url,] : null, () => fetcher(url));


	if (shouldFetch && data) {
		setShouldFetch(false)
	}

	if (data?.result?.jobId && forceReloadList) {
		setTimeout(() => {
			forceReloadList()
		}, 50)

	}

	function handleClick() {
		setShouldFetch(true);
	}

	return (
		data?.result?.jobId ? null : <Button
			className="worldCereal-Button circle"
			size="sm"
			component="a"
			target="_blank"
			variant="outline"
			onClick={handleClick}
			loading={isLoading}
		>
			<IconPlayerPlay size={14} color="green" />
		</Button>
	);
}
const RemoveJobButton = ({ jobId, forceReloadList }: { jobId?: string, forceReloadList?: () => void }) => {
	const [shouldFetch, setShouldFetch] = useState(false);
	const url = `/api/jobs/delete/${jobId}`

	const { data, isLoading } = useSWR(shouldFetch ? [url,] : null, () => fetcher(url));

	console.log("xxx_data_remove", data);
	if (shouldFetch && data) {
		setShouldFetch(false)
	}

	if (data?.numberOfDeletedJobs && forceReloadList) {
		setTimeout(() => {
			forceReloadList()
		}, 50)

	}

	function handleClick() {
		setShouldFetch(true);
	}

	return (
		<Button
			className="worldCereal-Button circle"
			size="sm"
			component="a"
			target="_blank"
			variant="outline"
			onClick={handleClick}
			loading={isLoading}
		>
			<IconTrash size={14} color="red" />
		</Button>
	);
}

const Record = ({
	id,
	// type,
	createdIso,
	status,
	results,
	bbox,
	timeRange,
	resultFileFormat,
	oeoCollection,
	forceReloadList,
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
				<Table.Td className="shrinkedCell">
					{status === 'created' ?
						<StartJobButton jobId={id} forceReloadList={forceReloadList} />
						: null}
				</Table.Td>
				<Table.Td className="shrinkedCell">{
					<RemoveJobButton jobId={id} forceReloadList={forceReloadList} />
				}</Table.Td>
				< Table.Td className="alignRight">
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
			)
			}
		</>
	);
};

export default Record;
