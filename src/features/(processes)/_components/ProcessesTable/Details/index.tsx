import './style.css';
import React, { useState } from 'react';
import { MapBBox } from '@features/(shared)/_components/map/MapBBox';
import { TextDescription } from '@features/(shared)/_layout/_components/Content/TextDescription';
import { Statuses } from '@features/(shared)/_logic/models.statuses';
import ProcessAttributes from '@features/(processes)/_components/ProcessAttributes';

type DetailsItemProps = {
	children: React.ReactNode;
	label: string;
};

/**
 * Renders a labeled detail item for the process details table.
 *
 * @param {DetailsItemProps} props - The props for the DetailsItem component.
 * @param {React.ReactNode} props.children - The content to display.
 * @param {string} props.label - The label for the detail item.
 * @returns {JSX.Element|null} The rendered detail item or null if no children.
 */
const DetailsItem = ({ children, label }: DetailsItemProps) => {
	return children ? (
		<div className="worldCereal-ProcessesTable-DetailItem">
			<span>{label}</span>
			<div>{children}</div>
		</div>
	) : null;
};

/**
 * Props for the Details component.
 * @typedef {Object} DetailsProps
 * @property {Date} [startDate] - The start date of the process.
 * @property {Date} [endDate] - The end date of the process.
 * @property {number[]} [extent] - The extent coordinates.
 * @property {number[]} [bbox] - The bounding box coordinates.
 * @property {number} [costs] - The costs associated with the process.
 * @property {number} [duration] - The duration of the process.
 * @property {boolean} [showValuesInfo] - Whether to show the values info section.
 * @property {string} [oeoCollection] - The openEO collection name.
 * @property {string} [oeoProcessId] - The openEO process ID.
 * @property {string} [resultFileFormat] - The output file format.
 * @property {Array<{ source_link: string }>} [results] - Array of result objects with download links.
 * @property {string} [status] - The status of the process.
 * @property {string} [collectionName] - The name of the product collection.
 * @property {string} [model] - The model used for the process.
 * @property {string} [backgroundLayer] - The key of the background layer to display in the map.
 */
// todo: this needs to be refactored, some of the props are obsolete or was renamed
type DetailsProps = {
	startDate?: Date;
	endDate?: Date;
	extent?: number[];
	bbox?: number[];
	costs?: number;
	duration?: number;
	jobKey?: string;
	showValuesInfo?: boolean;
	oeoCollection?: string;
	oeoProcessId?: string;
	resultFileFormat?: string;
	results?: Array<{ source_link: string }>;
	status?: string;
	collectionName?: string;
	model?: string;
	backgroundLayer?: string;
	setBackgroundLayer?: React.Dispatch<React.SetStateAction<string | null>>;
	orbitState?: string;
	postprocessMethodCroptype?: string;
	postprocessKernelSizeCroptype?: number;
	seasonId?: string;
	seasonalModelZip?: string;
	enableCroplandHead?: boolean;
	landcoverHeadZip?: string;
	croptypeHeadZip?: string;
	maskCropland?: boolean;
	postprocessMethodCropland?: string;
	postprocessKernelSizeCropland?: number;
};

/**
 * Displays detailed information about a process, including map, metadata, and download links.
 *
 * @param {DetailsProps} props - The props for the Details component.
 * @returns {JSX.Element} The rendered details view for a process.
 */
const Details = ({
	bbox,
	startDate,
	endDate,
	resultFileFormat,
	oeoCollection,
	oeoProcessId,
	results,
	status,
	collectionName,
	backgroundLayer,
	setBackgroundLayer,
	orbitState,
	postprocessMethodCroptype,
	postprocessKernelSizeCroptype,
	seasonId,
	seasonalModelZip,
	enableCroplandHead,
	landcoverHeadZip,
	croptypeHeadZip,
	maskCropland,
	postprocessMethodCropland,
	postprocessKernelSizeCropland,
	jobKey,
}: DetailsProps) => {
	const [bboxDescription, setBboxDescription] = useState<string | string[] | null>(null);

	const getFilenameFromResult = (result: { source_link: string }) => {
		const url = new URL(result.source_link);
		const pathname = url.pathname;
		const filename = pathname.substring(pathname.lastIndexOf('/') + 1);
		return filename.replace(/^openEO_/, '');
	};

	return (
		<div className="worldCereal-ProcessesTable-Details">
			<div className="worldCereal-ProcessesTable-Details-column">
				<TextDescription>
					Extent: {bboxDescription} km<sup>2</sup>
				</TextDescription>
				<MapBBox
					bbox={bbox?.map(Number)}
					disabled
					mapSize={[500, 300]}
					setBboxDescription={setBboxDescription}
					backgroundLayer={backgroundLayer}
					setBackgroundLayer={setBackgroundLayer}
				/>
			</div>
			<div className="worldCereal-ProcessesTable-Details-column">
				<div className="details-process-attributes">
					<ProcessAttributes
						jobKey={jobKey}
						collectionName={collectionName}
						resultFileFormat={resultFileFormat}
						seasonalModelZip={seasonalModelZip}
						landcoverHeadZip={landcoverHeadZip}
					croptypeHeadZip={croptypeHeadZip}
					startDate={startDate}
					endDate={endDate}
					orbitState={orbitState}
					seasonId={seasonId}
					postprocessMethodCroptype={postprocessMethodCroptype}
					postprocessKernelSizeCroptype={postprocessKernelSizeCroptype}
					enableCroplandHead={enableCroplandHead}
					maskCropland={maskCropland}
					postprocessMethodCropland={postprocessMethodCropland}
					postprocessKernelSizeCropland={postprocessKernelSizeCropland}
				/>
				</div>
				{status === Statuses.error ? (
					<div className="worldCereal-ProcessesTable-Details-error">
						Your processing job resulted in an error. Please reach out to us on the{' '}
						<a href="https://forum.dataspace.copernicus.eu/c/openeo/28" target="_blank">
							CDSE – OpenEO forum
						</a>
						, clearly mentioning the processing job ID as displayed in the first column of this table.
					</div>
				) : null}
				{results?.[0] && (
					<DetailsItem label={'Download results'}>
						{results.map((result) => (
							<div key={result.source_link} className="worldCereal-ProcessesTable-DetailItem-result">
								<a href={result.source_link} target="_blank">
									{getFilenameFromResult(result)}
								</a>
							</div>
						))}
					</DetailsItem>
				)}
			</div>
		</div>
	);
};

export default Details;
