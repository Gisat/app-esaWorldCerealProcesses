import { Center, Loader, Table } from '@mantine/core';
import Record from './Record';
import './style.css';
import { pages, processTypes } from '@features/(processes)/_constants/app';
import formParams from '@features/(processes)/_constants/generate-custom-products/formParams';
import Link from 'next/link';
import { TextHighlight } from '@features/(shared)/_layout/_components/Content/TextHighlight';
import React from 'react';

type Props = {
	loading?: boolean;
	forceReloadList?: () => void;
	backgroundLayer?: string | null;
	setBackgroundLayer?: React.Dispatch<React.SetStateAction<string | null>>;
	data: {
		bbox: Array<number>;
		costs: number;
		createdIso: Date;
		duration: number;
		key: string;
		type: string;
		name: string;
		oeoCollection: string;
		oeoProcessId: string;
		format: string;
		results: Array<{ source_link: string }>;
		status: string;
		timeRange: Array<Date>;
		updatedIso: Date;
		collectionName: string;
		seasonalModelZip: string;
		orbitState?: string;
		postprocessMethodCroptype?: string;
		postprocessKernelSizeCroptype?: number;
		title?: string;
		customProperties?: Record<string, unknown>;
		seasonIds?: string[];
		seasonWindows?: Array<{ start: string; end: string }>;
	}[];
};

/**
 * Displays a table of processes with their status, type, and creation date.
 * If `loading` is `true`, a spinner is displayed instead of the table.
 *
 * @param {Props} props - The component properties.
 * @param {boolean} [props.loading] - Indicates if data is still being fetched.
 * @param {() => void} [props.forceReloadList] - Function to force refresh the table data.
 * @param {Array<Object>} props.data - The list of process records.
 * @returns {JSX.Element} A table displaying process records or a loading indicator.
 *
 * @example
 * <ProcessesTable
 *   data={[{ key: "123", type: "Analysis", createdIso: new Date(), status: "Completed", bbox: [], timeRange: [], oeoCollection: "", resultFileFormat: "", results: [] }]}
 *   loading={false}
 *   forceReloadList={() => console.log("Reload triggered")}
 * />
 */
export const ProcessesTable = ({ data, loading, forceReloadList, backgroundLayer, setBackgroundLayer }: Props) => {
	const rows = Array.isArray(data) ? (
		data.map(
			({
			format,
			createdIso,
			status,
			results,
			key,
			bbox,
			timeRange,
			oeoCollection,
			oeoProcessId,
			type,
			collectionName,
			seasonalModelZip,
			orbitState,
			postprocessMethodCroptype,
			postprocessKernelSizeCroptype,
			title,
			customProperties,
			seasonIds,
			seasonWindows,
			}) => (
				<Record
					key={key}
					jobKey={key}
					type={type}
					createdIso={createdIso}
					status={status}
					results={results}
					bbox={bbox}
					timeRange={timeRange}
					resultFileFormat={format}
					oeoCollection={oeoCollection}
					oeoProcessId={oeoProcessId}
					forceReloadList={forceReloadList}
					collectionName={collectionName}
					model={
						type === processTypes.product
							? seasonalModelZip
							: undefined
					}
					orbitState={orbitState}
					postprocessMethodCroptype={postprocessMethodCroptype}
					postprocessKernelSizeCroptype={postprocessKernelSizeCroptype}
					title={title}
					backgroundLayer={backgroundLayer}
					setBackgroundLayer={setBackgroundLayer}
					customProperties={customProperties}
					seasonIds={seasonIds}
					seasonWindows={seasonWindows}
				/>
			)
		)
	) : (
		<p>No records</p>
	);

	if (loading) {
		return (
			<Center>
				<Loader />
			</Center>
		);
	} else if (data.length === 0) {
		return (
			<p className="worldCereal-ProcessesTable-noProcess">
				You have not created any process yet! Go to{' '}
				<Link href={pages.downloadOfficialProducts.url}>
					<TextHighlight bold>Download official products</TextHighlight>
				</Link>{' '}
				or{' '}
				<Link href={pages.generateCustomProducts.url}>
					<TextHighlight bold>Generate custom products</TextHighlight>
				</Link>
				.
			</p>
		);
	} else {
		return (
			<Table horizontalSpacing="md" className="worldCereal-ProcessesTable">
				<Table.Thead>
					<Table.Tr className="worldCereal-ProcessesTable-row">
						<Table.Th>Type of process</Table.Th>
						<Table.Th>Product</Table.Th>
						<Table.Th>Collection/Season</Table.Th>
						<Table.Th>Created</Table.Th>
						<Table.Th>Status</Table.Th>
						<Table.Th></Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>{rows}</Table.Tbody>
			</Table>
		);
	}
};
