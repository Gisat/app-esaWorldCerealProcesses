import "./style.scss";
import React from "react";
import MapExtentSelect from '@/components/map/MapExtentSelect';
import { products } from '@/constants/app';

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
			<DetailsItem label={"Product"}>{collection?.label}</DetailsItem>
			<DetailsItem label={"Start date"}>{startDate ? new Date(startDate).toDateString() : ''}</DetailsItem>
			<DetailsItem label={"End date"}>{endDate ? new Date(endDate).toDateString() : ''}</DetailsItem>
			<DetailsItem label={"Output file format"}>{resultFileFormat}</DetailsItem>
			<MapExtentSelect bbox={bbox} disabled mapSize={[300, 300]} />
		</div>
	</div>
}

export default Details;
