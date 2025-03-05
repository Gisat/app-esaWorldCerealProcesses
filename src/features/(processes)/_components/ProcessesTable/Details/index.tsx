import "./style.css";
import React, { useState } from "react";
import {MapBBox} from "@features/(shared)/_components/map/MapBBox";
import { customProducts, products } from "@features/(processes)/_constants/app";
import { TextDescription } from "@features/(shared)/_layout/_components/Content/TextDescription";

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
	oeoCollection?: string,
	oeoProcessId?: string,
	resultFileFormat?: string,
	results?: Array<{ source_link: string }>,
}

const Details = ({ bbox, startDate, endDate, resultFileFormat, oeoCollection, oeoProcessId, results }: DetailsProps) => {
	const [areaBbox, setAreaBbox] = useState<number | undefined>(undefined);
	const [coordinatesToDisplay, setCoordinatesToDisplay] = useState<string | Array<string> | null>(null);
	const collection = products.find(p => p.value === oeoCollection);
	const process = customProducts.find(p => p.value === oeoProcessId);

	return <div className="worldCereal-ProcessesTable-Details">
		<div className="worldCereal-ProcessesTable-Details-column">
			<TextDescription>
				Extent: {bbox ? coordinatesToDisplay : "none"}{" "}
				{areaBbox && bbox ? `(${areaBbox} sqkm)` : ""}
			</TextDescription>
			<MapBBox bbox={bbox?.map(Number)} disabled mapSize={[300, 300]} setAreaBbox={setAreaBbox} setCoordinatesToDisplay={setCoordinatesToDisplay} coordinatesToDisplay={coordinatesToDisplay}/>
		</div>
		<div className="worldCereal-ProcessesTable-Details-column">
			<DetailsItem label={"Product"}>{collection?.label || process?.label}</DetailsItem>
			<DetailsItem label={"Start date"}>{startDate ? new Date(startDate).toLocaleDateString() : ''}</DetailsItem>
			<DetailsItem label={"End date"}>{endDate ? new Date(endDate).toLocaleDateString() : ''}</DetailsItem>
			<DetailsItem label={"Output file format"}>{resultFileFormat}</DetailsItem>
		</div>
		{results?.[0] && <div className="worldCereal-ProcessesTable-Details-column">
			<DetailsItem label={"Download results"}>
				{results.map((result, index) => <div key={result.source_link} className="worldCereal-ProcessesTable-DetailItem-result"><a href={result.source_link}>Product {index + 1}</a></div>)}
			</DetailsItem>
		</div>}
	</div>
}

export default Details;
