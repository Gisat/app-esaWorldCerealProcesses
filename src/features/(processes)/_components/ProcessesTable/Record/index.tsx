import "./style.scss";
import { ActionIcon, Button, Table, Modal, Title, Flex } from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';
import { IconDotsVertical, IconDownload, IconTrash, IconPlayerPlay } from '@tabler/icons-react';
import { useState } from "react";

import useSWR from "swr";
import Details from "../Details";
import ProcessStatus from "@features/(processes)/_components/ProcessStatus";


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

type RemoveJobButtonProps = {
	"oeoCollection"?: string,
	"resultFileFormat"?: string,
	"timeRange"?: Array<Date>,
	"bbox"?: Array<number>,
	jobId?: string,
	forceReloadList?: () => void
}

const RemoveJobButton = ({
	jobId,
	forceReloadList,
	bbox,
	timeRange,
	resultFileFormat,
	oeoCollection
}: RemoveJobButtonProps) => {
	const [shouldFetch, setShouldFetch] = useState(false);
	const [opened, { open, close }] = useDisclosure(false);
	const url = `/api/jobs/delete/${jobId}`

	const { data, isLoading } = useSWR(shouldFetch ? [url,] : null, () => fetcher(url));

	if (shouldFetch && data) {
		close()
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
		<>
			<Modal
				opened={opened}
				onClose={close}

				overlayProps={{
					color: '#ffffff61',
				}}
				radius={0}
				closeOnClickOutside={false}
				withCloseButton={false}
				size={"xl"}
				transitionProps={{ transition: 'fade', duration: 200 }}
			>
				<Title order={3}>Confirm delete job results.</Title>
				<Details bbox={bbox} startDate={timeRange?.[0]} endDate={timeRange?.[1]} resultFileFormat={resultFileFormat} oeoCollection={oeoCollection} />
				<Flex
					mih={50}
					bg="rgba(0, 0, 0, .3)"
					gap="lg"
					justify="flex-end"
					align="flex-start"
					direction="row"
					wrap="wrap"
				>
					<Button
						size="sm"
						component="a"
						target="_blank"
						variant="outline"
						onClick={close}
						disabled={isLoading}
					>
						Decide
					</Button>
					<Button
						className="worldCereal-Button circle"
						size="sm"
						component="a"
						target="_blank"
						onClick={handleClick}
						loading={isLoading}
					>
						Confirm delete
					</Button>
				</Flex>
			</Modal >

			<Button
				className="worldCereal-Button circle"
				size="sm"
				component="a"
				target="_blank"
				variant="outline"
				onClick={open}
			>
				<IconTrash size={14} color="red" />
			</Button>
		</>
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
					<RemoveJobButton jobId={id} forceReloadList={forceReloadList} bbox={bbox} timeRange={timeRange} resultFileFormat={resultFileFormat} oeoCollection={oeoCollection} />
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
