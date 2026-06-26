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
	return fetch(`${url}`, { credentials: 'include' }).then((r) => r.json());
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
	orbitState?: string;
	postprocessMethodCroptype?: string;
	postprocessKernelSizeCroptype?: number;
	title?: string;
	backgroundLayer?: string | null;
	setBackgroundLayer?: React.Dispatch<React.SetStateAction<string | null>>;
	customProperties?: Record<string, unknown>;
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
	title?: string;
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
	title,
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
					title={title}
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
					icon: <IconX color="var(--deleteColor)" size={20} />,
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
	orbitState,
	postprocessMethodCroptype,
	postprocessKernelSizeCroptype,
	title,
	backgroundLayer,
	setBackgroundLayer,
	customProperties,
}: // details
Props) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const className = `worldCereal-ProcessesTable-row${isExpanded ? ' is-expanded' : ''}`;

	const productLabel =
		type === processTypes.download
			? downloadFormParams.product.options.find((option) => option.value === oeoCollection)?.label
			: customProductFormParams.product.options.find((option) => option.value === oeoProcessId)?.label;

	const collectionSeasonLabel = (() => {
		if (type === processTypes.download) {
			return downloadFormParams.collection.options.find(
				(option) => option.start === `${timeRange?.[0]}` && option.end === `${timeRange?.[1]}`
			)?.label;
		}
		if (type === processTypes.product && timeRange?.[0] && timeRange?.[1]) {
			const fmtDate = (d: Date) => {
				const date = new Date(d);
				return date.toLocaleString('en-US', { month: 'short', year: '2-digit' });
			};
			const range = `${fmtDate(timeRange[0])} - ${fmtDate(timeRange[1])}`;
			const seasonId = (customProperties?.seasonIds as string[] | undefined)?.[0];
			return seasonId ? `${range} (${seasonId})` : range;
		}
		return null;
	})();

	const createdFormatted = (() => {
		if (!createdIso) return '';
		const d = new Date(createdIso);
		const pad = (n: number) => String(n).padStart(2, '0');
		return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
	})();

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
						title={title}
						collectionName={
							downloadFormParams.collection.options.find(
								(option) => option.start === `${timeRange?.[0]}` && option.end === `${timeRange?.[1]}`
							)?.label
						}
						backgroundLayer={backgroundLayer ?? undefined}
						setBackgroundLayer={setBackgroundLayer}
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
						customProductFormParams.processId.options.find((option) => option.value === oeoProcessId)?.label
					}
					results={results}
					status={status}
					orbitState={customProductFormParams.orbitState.options.find((option) => option.value === orbitState)?.label}
					postprocessMethodCroptype={
						customProductFormParams.postprocessMethodCroptype.options.find((option) => option.value === postprocessMethodCroptype)
							?.label
					}
					postprocessKernelSizeCroptype={postprocessKernelSizeCroptype}
					backgroundLayer={backgroundLayer ?? undefined}
					setBackgroundLayer={setBackgroundLayer}
					/>
				);
			default:
				return null;
		}
	};

	return (
		<>
			<Table.Tr key={jobKey} className={className}>
				<Table.Td className="highlightedCell">{type}</Table.Td>
				<Table.Td>{productLabel}</Table.Td>
				<Table.Td>{collectionSeasonLabel}</Table.Td>
				<Table.Td>{createdFormatted}</Table.Td>
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
						customProductFormParams.processId.options.find((option) => option.value === oeoProcessId)?.label || ''
					}
						collectionName={
							downloadFormParams.collection.options.find(
								(option) => option.start === `${timeRange?.[0]}` && option.end === `${timeRange?.[1]}`
							)?.label || ''
						}
						model={model}
						title={title}
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
								onClick={() => setIsExpanded(true)}
							>
								<IconDownload color="var(--textAccentedColor)" size={16} />
							</ActionIcon>
						</Tooltip>
					) : null}
					<Tooltip label={isExpanded ? 'Hide details' : 'Show details'} openDelay={500}>
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
