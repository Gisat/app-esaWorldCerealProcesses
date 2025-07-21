import { ActionIcon, Button, Flex, Modal, Table, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
	IconChevronDown,
	IconChevronUp,
	IconDownload,
	IconInfoCircle,
	IconPlayerPlay,
	IconTrash,
	IconX,
} from '@tabler/icons-react';
import { useState } from 'react';
import './style.css';

import ProcessStatus from '@features/(processes)/_components/ProcessStatus';
import { processTypes } from '@features/(processes)/_constants/app';
import useSWR from 'swr';
import Details from '../Details';
import { Statuses } from '@features/(shared)/_logic/models.statuses';

import downloadFormParams from '@features/(processes)/_constants/download-official-products/formParams';
import customProductFormParams from '@features/(processes)/_constants/generate-custom-products/formParams';
import ProductValuesInfo from '../ProductValuesInfo';
import ProductResultsInfo from '../ProductResultsInfo';

const fetcher = (url: string) => {
	return fetch(`${url}`).then((r) => r.json());
};

type Props = {
	bbox?: Array<number>;
	costs?: number;
	createdIso?: Date;
	duration?: number;
	jobKey?: string;
	type?: string;
	name?: string;
	oeoCollection?: string;
	oeoProcessId?: string;
	resultFileFormat?: string;
	results?: Array<{ source_link: string }>;
	status?: string;
	timeRange?: Array<Date>;
	updatedIso?: Date;
	collectionName?: string;
	model?: string;
	forceReloadList?: () => void;
};

const StartJobButton = ({ jobKey, forceReloadList }: { jobKey?: string; forceReloadList?: () => void }) => {
	const [shouldFetch, setShouldFetch] = useState(false);
	const url = `/api/jobs/start/${jobKey}`;

	const { data, isLoading } = useSWR(shouldFetch ? [url] : null, () => fetcher(url));

	if (shouldFetch && data) {
		setShouldFetch(false);
	}

	if (data?.result?.key && forceReloadList) {
		setTimeout(() => {
			forceReloadList();
		}, 50);
	}

	function handleClick() {
		setShouldFetch(true);
	}

	return data?.result?.key ? null : (
		<Tooltip label="Start process" openDelay={500}>
			<ActionIcon
				size="lg"
				radius="xl"
				component="a"
				target="_blank"
				variant="subtle"
				onClick={handleClick}
				loading={isLoading}
			>
				<IconPlayerPlay size={16} color="var(--startColor)" />
			</ActionIcon>
		</Tooltip>
	);
};

type RemoveJobButtonProps = {
	oeoCollection?: string;
	oeoProcessId?: string;
	resultFileFormat?: string;
	timeRange?: Array<Date> | null;
	bbox?: Array<number>;
	jobKey?: string;
	forceReloadList?: () => void;
	collectionName?: string;
	model?: string;
};

const RemoveJobButton = ({
	jobKey,
	forceReloadList,
	bbox,
	timeRange,
	resultFileFormat,
	oeoCollection,
	oeoProcessId,
	collectionName,
	model,
}: RemoveJobButtonProps) => {
	const [shouldFetch, setShouldFetch] = useState(false);
	const [opened, { open, close }] = useDisclosure(false);
	const url = `/api/jobs/delete/${jobKey}`;

	const { data, isLoading } = useSWR(shouldFetch ? [url] : null, () => fetcher(url));

	if (shouldFetch && data) {
		close();
		setShouldFetch(false);
	}

	if (data?.numberOfDeletedJobs && forceReloadList) {
		setTimeout(() => {
			forceReloadList();
		}, 50);
	}

	function handleClick() {
		setShouldFetch(true);
	}

	return (
		<>
			<Modal
				className="worldCereal-Modal"
				opened={opened}
				onClose={close}
				radius={0}
				closeOnClickOutside={true}
				withCloseButton={false}
				size={'xl'}
				transitionProps={{ transition: 'fade', duration: 200 }}
			>
				<Details
					bbox={bbox}
					startDate={timeRange?.[0]}
					endDate={timeRange?.[1]}
					resultFileFormat={resultFileFormat}
					oeoCollection={oeoCollection}
					oeoProcessId={oeoProcessId}
					collectionName={collectionName}
					model={model}
				/>
				<Flex mih={50} gap="lg" justify="flex-start" align="flex-end" direction="row" wrap="wrap">
					<Button
						className="worldCereal-Button is-secondary is-ghost"
						size="sm"
						component="a"
						target="_blank"
						onClick={close}
						variant="outline"
						disabled={isLoading}
					>
						Decline
					</Button>
					<Button
						className="worldCereal-Button"
						size="sm"
						component="a"
						target="_blank"
						onClick={handleClick}
						loading={isLoading}
					>
						Confirm delete
					</Button>
				</Flex>
			</Modal>

			<Tooltip label="Delete process" openDelay={500}>
				<ActionIcon size="lg" radius="xl" component="a" target="_blank" variant="subtle" onClick={open}>
					<IconTrash size={16} color="var(--deleteColor)" />
				</ActionIcon>
			</Tooltip>
		</>
	);
};

/**
 * Info button that opens a modal with process results explanation.
 * Shows ProductValuesInfo for downloads and ProductResultsInfo for products.
 *
 * @param descriptionType - The process type string (e.g., "download" or "product").
 */
const OpenInfoButton = ({ descriptionType }: { descriptionType: string | undefined }) => {
	const [opened, setOpened] = useState(false);

	const getDescriptionInfo = () => {
		switch (descriptionType) {
			case processTypes.download:
				return <ProductValuesInfo />;
			case processTypes.product:
				return <ProductResultsInfo />;
			default:
				return null;
		}
	};

	return (
		<>
			<Tooltip label="Show results info" openDelay={500}>
				<ActionIcon
					radius="lg"
					size="lg"
					variant="subtle"
					aria-label="Show results info"
					onClick={() => setOpened(true)}
				>
					<IconInfoCircle color="var(--textAccentedColor)" size={16} />
				</ActionIcon>
			</Tooltip>
			<Modal
				className="worldCereal-Modal"
				opened={opened}
				onClose={() => setOpened(false)}
				title="Explanation of Results"
				centered
				radius={0}
				size={'xl'}
				transitionProps={{ transition: 'fade', duration: 200 }}
				closeButtonProps={{
					icon: (
						<ActionIcon radius="lg" size="lg" variant="subtle" aria-label="Close modal">
							<IconX color="var(--deleteColor)" size={20} />
						</ActionIcon>
					),
				}}
			>
				{getDescriptionInfo()}
			</Modal>
		</>
	);
};

const Record = ({
	jobKey,
	type,
	createdIso,
	status,
	results,
	bbox,
	timeRange,
	resultFileFormat,
	oeoCollection,
	oeoProcessId,
	model,
	forceReloadList,
}: // details
Props) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const className = `worldCereal-ProcessesTable-row${isExpanded ? ' is-expanded' : ''}`;

	/**
	 * Returns the details component based on the process type.
	 *
	 * @returns {JSX.Element | null} The details component or null if the type is unknown.
	 */
	const getDetails = () => {
		switch (type) {
			case processTypes.download:
				return (
					<Details
						bbox={bbox}
						resultFileFormat={resultFileFormat}
						oeoCollection={downloadFormParams.product.options.find((option) => option.value === oeoCollection)?.label}
						results={results}
						status={status}
						collectionName={
							downloadFormParams.collection.options.find(
								(option) => option.start === `${timeRange?.[0]}` && option.end === `${timeRange?.[1]}`
							)?.label
						}
					/>
				);
			case processTypes.product:
				return (
					<Details
						bbox={bbox}
						startDate={timeRange?.[0]}
						endDate={timeRange?.[1]}
						model={model}
						resultFileFormat={resultFileFormat}
						oeoProcessId={
							customProductFormParams.product.options.find((option) => option.value === oeoProcessId)?.label
						}
						results={results}
						status={status}
					/>
				);
			default:
				return null;
		}
	};

	return (
		<>
			<Table.Tr key={jobKey} className={className}>
				<Table.Td className="smallTextCell">{jobKey}</Table.Td>
				<Table.Td className="highlightedCell">{type}</Table.Td>
				<Table.Td>{createdIso && new Date(createdIso).toLocaleString()}</Table.Td>
				<Table.Td>{status ? <ProcessStatus status={status} /> : null}</Table.Td>
				<Table.Td className="shrinkedCell alignRight">
					<RemoveJobButton
						jobKey={jobKey}
						forceReloadList={forceReloadList}
						bbox={bbox}
						timeRange={type === processTypes.product ? timeRange : null}
						resultFileFormat={resultFileFormat}
						oeoCollection={downloadFormParams.product.options.find((option) => option.value === oeoCollection)?.label}
						oeoProcessId={
							customProductFormParams.product.options.find((option) => option.value === oeoProcessId)?.label || ''
						}
						collectionName={
							downloadFormParams.collection.options.find(
								(option) => option.start === `${timeRange?.[0]}` && option.end === `${timeRange?.[1]}`
							)?.label || ''
						}
						model={model}
					/>
					{results?.[0] ? <OpenInfoButton descriptionType={type} /> : null}
					{status === Statuses.created ? <StartJobButton jobKey={jobKey} forceReloadList={forceReloadList} /> : null}
					{results?.[0] ? (
						<Tooltip label="Go to downloads" openDelay={500}>
							<ActionIcon
								radius="lg"
								size="lg"
								variant="subtle"
								aria-label="Settings"
								onClick={() => setIsExpanded(!isExpanded)}
							>
								<IconDownload color="var(--textAccentedColor)" size={16} />
							</ActionIcon>
						</Tooltip>
					) : null}
					<Tooltip label="Show details" openDelay={500}>
						<ActionIcon
							radius="lg"
							size="lg"
							variant="subtle"
							aria-label="Settings"
							onClick={() => setIsExpanded(!isExpanded)}
						>
							{isExpanded ? (
								<IconChevronUp color="var(--iconPrimaryColor)" size={16} />
							) : (
								<IconChevronDown color="var(--iconPrimaryColor)" size={16} />
							)}
						</ActionIcon>
					</Tooltip>
				</Table.Td>
			</Table.Tr>
			{isExpanded && (
				<Table.Tr className={className}>
					<Table.Td colSpan={7}>{getDetails()}</Table.Td>
				</Table.Tr>
			)}
		</>
	);
};

export default Record;
