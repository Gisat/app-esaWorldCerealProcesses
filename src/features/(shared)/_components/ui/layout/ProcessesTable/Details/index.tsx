import "./style.scss";
import React from "react";
import MapExtentSelect from '@/features/(map)/_components/MapExtentSelect';	
import { products } from '@/features/(shared)/constants/app';
import { getPoinsDistance } from '@/features/(shared)/_components/utils/map';

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
}

const Details = ({ bbox, startDate, endDate, resultFileFormat, oeoCollection }: DetailsProps) => {
	const collection = products.find(p => p.value === oeoCollection)
	return <div className="worldCereal-ProcessesTable-Details">
		<div className="worldCereal-ProcessesTable-Details-column">
			<MapExtentSelect bbox={bbox} disabled mapSize={[300, 300]} />
			{bbox ? <div className="worldCereal-MapDetails-coordinates">Current map extent: <b>{Math.round(getPoinsDistance([bbox[0], bbox[1]],
				[bbox[2], bbox[1]],))} x {Math.round(getPoinsDistance([bbox[0], bbox[3]], [bbox[0], bbox[1]]))} m</b></div> : null}
		</div>
		<div className="worldCereal-ProcessesTable-Details-column">
			<DetailsItem label={"Product"}>{collection?.label}</DetailsItem>
			<DetailsItem label={"Start date"}>{startDate ? new Date(startDate).toDateString() : ''}</DetailsItem>
			<DetailsItem label={"End date"}>{endDate ? new Date(endDate).toDateString() : ''}</DetailsItem>
			<DetailsItem label={"Output file format"}>{resultFileFormat}</DetailsItem>
		</div>
	</div>
}

export default Details;
