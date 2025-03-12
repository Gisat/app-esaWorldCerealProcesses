import "./style.css";
import React, { useState } from "react";
import { MapBBox } from "@features/(shared)/_components/map/MapBBox";
import { customProducts, products } from "@features/(processes)/_constants/app";
import { TextDescription } from "@features/(shared)/_layout/_components/Content/TextDescription";
import ProductValuesInfo
	from "@features/(processes)/_components/ProcessesTable/ProductValuesInfo";
import {Statuses} from "@features/(shared)/_logic/models.statuses";

type DetailsItemProps = {
	children: React.ReactNode,
	label: string,
}

const DetailsItem = ({ children, label }: DetailsItemProps) => {
	return <div className="worldCereal-ProcessesTable-DetailItem">
		<span>{label}</span>
		<div>{children}</div>
	</div>
}

type DetailsProps = {
	startDate?: Date,
	endDate?: Date,
	extent?: number[],
	bbox?: number[],
	costs?: number,
	duration?: number,
	showValuesInfo?: boolean,
	oeoCollection?: string,
	oeoProcessId?: string,
	resultFileFormat?: string,
	results?: Array<{ source_link: string }>,
	status?: string,
}

const Details = ({ bbox, startDate, endDate, resultFileFormat, oeoCollection, oeoProcessId, results, showValuesInfo, status }: DetailsProps) => {
	const [bboxDescription, setBboxDescription] = useState<
		string | string[] | null
	>(null);
	const collection = products.find(p => p.value === oeoCollection);
	const process = customProducts.find(p => p.value === oeoProcessId);

	/**
	 * Extracts the filename from a given result object containing a source link.
	 *
	 * @param result - An object containing a `source_link` property which is a URL string.
	 * @returns The filename extracted from the URL's pathname, with the "openEO_" prefix removed if present.
	 */
	const getFilenameFromResult = (result: { source_link: string }) => {
		const url = new URL(result.source_link);
		const pathname = url.pathname;
		const filename = pathname.substring(pathname.lastIndexOf('/') + 1);
		return filename.replace(/^openEO_/, '');
	};

	return <div className="worldCereal-ProcessesTable-Details">
		<div className="worldCereal-ProcessesTable-Details-column">
			<TextDescription>
				Extent: {bboxDescription}
			</TextDescription>
			<MapBBox bbox={bbox?.map(Number)} disabled mapSize={[500, 300]} setBboxDescription={setBboxDescription}/>
		</div>
		<div className="worldCereal-ProcessesTable-Details-column">
			<DetailsItem label={"Product"}>{collection?.label || process?.label}</DetailsItem>
			<DetailsItem label={"Start date"}>{startDate ? new Date(startDate).toLocaleDateString() : ''}</DetailsItem>
			<DetailsItem label={"End date"}>{endDate ? new Date(endDate).toLocaleDateString() : ''}</DetailsItem>
			<DetailsItem label={"Output file format"}>{resultFileFormat}</DetailsItem>
		</div>
		<div className="worldCereal-ProcessesTable-Details-column">
			{status === Statuses.error ? (
				<div className="worldCereal-ProcessesTable-Details-error">
					Your processing job resulted in an error. Please reach out to us on the <a href="https://forum.dataspace.copernicus.eu/c/openeo/28" target="_blank">CDSE – OpenEO forum</a>, clearly mentioning the processing job ID as displayed in the first column of this table.
				</div>
			) : null}
			{results?.[0] && <DetailsItem label={"Download results"}>
				{results.map((result) => <div key={result.source_link} className="worldCereal-ProcessesTable-DetailItem-result"><a href={result.source_link} target="_blank">{getFilenameFromResult(result)}</a></div>)}
			</DetailsItem>}
			{showValuesInfo && <DetailsItem label="Values description"><ProductValuesInfo/></DetailsItem>}
		</div>
	</div>
}

export default Details;
