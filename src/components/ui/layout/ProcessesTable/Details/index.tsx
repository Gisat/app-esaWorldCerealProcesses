import "./style.scss";
import React from "react";

type DetailsItemProps = {
	children: React.ReactNode,
	label: string,
}

const DetailsItem = ({children, label}: DetailsItemProps) => {
	return <div className="worldCereal-ProcessesTable-DetailItem">
		<span>{label}</span>
		<div>{children}</div>
	</div>
}

type DetailsProps = {
	product: string;
	startDate: string,
	endDate: string,
	outputFileFormat: string,
	extent: number[],
}

const Details = ({product, startDate, endDate, outputFileFormat, extent}: DetailsProps) => {
	return <div className="worldCereal-ProcessesTable-Details">
		<div className="worldCereal-ProcessesTable-Details-column">
			<DetailsItem label={"Product"}>{product}</DetailsItem>
			<DetailsItem label={"Start date"}>{startDate}</DetailsItem>
			<DetailsItem label={"End date"}>{endDate}</DetailsItem>
			<DetailsItem label={"Output file format"}>{outputFileFormat}</DetailsItem>
		</div>
	</div>
}

export default Details;
