import "./style.css";
import React, { useState } from "react";
import { getPoinsDistance } from '@features/(processes)/_utils/map';
import {MapBBox} from "@features/(shared)/_components/map/MapBBox";
import { products } from "@features/(processes)/_constants/app";

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
	resultFileFormat?: string,
	results?: Array<{ source_link: string }>,
}

const Details = ({ bbox, startDate, endDate, resultFileFormat, oeoCollection, results }: DetailsProps) => {
	const [areaBbox, setAreaBbox] = useState<number | undefined>(undefined);
	const collection = products.find(p => p.value === oeoCollection);
	// let bboxPoints = null;

	// if (bbox) {
	// 	bboxPoints = [[Number(bbox[2]), Number(bbox[3])], [Number(bbox[2]), Number(bbox[1])], [Number(bbox[0]), Number(bbox[1])], [Number(bbox[0]), Number(bbox[3])]]
	// }

	//console.log(bbox)

	return <div className="worldCereal-ProcessesTable-Details">
		<div className="worldCereal-ProcessesTable-Details-column">
			<MapBBox bbox={bbox} disabled mapSize={[300, 300]} setAreaBbox={setAreaBbox}/>
			{bbox ? <div className="worldCereal-MapDetails-coordinates">Current map extent: <b>{Math.round(getPoinsDistance([bbox[0], bbox[1]],
				[bbox[2], bbox[1]],))} x {Math.round(getPoinsDistance([bbox[0], bbox[3]], [bbox[0], bbox[1]]))} m {areaBbox}</b></div> : null}
		</div>
		<div className="worldCereal-ProcessesTable-Details-column">
			<DetailsItem label={"Product"}>{collection?.label}</DetailsItem>
			<DetailsItem label={"Start date"}>{startDate ? new Date(startDate).toLocaleDateString() : ''}</DetailsItem>
			<DetailsItem label={"End date"}>{endDate ? new Date(endDate).toLocaleDateString() : ''}</DetailsItem>
			<DetailsItem label={"Output file format"}>{resultFileFormat}</DetailsItem>
		</div>
		{results?.[0] && <div className="worldCereal-ProcessesTable-Details-column">
			<DetailsItem label={"Download results"}>
				{results.map((result, index) => <a key={result.source_link} href={result.source_link}>{index > 0 ? ', ' : ''}Product {index + 1}</a>)}
			</DetailsItem>
		</div>}
	</div>
}

export default Details;
