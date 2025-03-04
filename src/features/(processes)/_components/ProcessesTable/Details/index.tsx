import "./style.css";
import React, { useState } from "react";
import {MapBBox} from "@features/(shared)/_components/map/MapBBox";
import { products } from "@features/(processes)/_constants/app";
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
	resultFileFormat?: string,
	results?: Array<{ source_link: string }>,
	model?: string,
	productCollection?: number,
}

const Details = ({ bbox, startDate, endDate, resultFileFormat, oeoCollection, results, model, productCollection }: DetailsProps) => {
	const [areaBbox, setAreaBbox] = useState<number | undefined>(undefined);
	const [coordinatesToDisplay, setCoordinatesToDisplay] = useState<string | Array<string> | null>(null);
	const collection = products.find(p => p.value === oeoCollection);

	return <div className="worldCereal-ProcessesTable-Details">
		<div className="worldCereal-ProcessesTable-Details-column">
			<TextDescription>
				Extent: {bbox ? coordinatesToDisplay : "none"}{" "}
				{areaBbox && bbox ? `(${areaBbox} sqkm)` : ""}
			</TextDescription>
			<MapBBox bbox={bbox?.map(Number)} disabled mapSize={[450, 300]} setAreaBbox={setAreaBbox} setCoordinatesToDisplay={setCoordinatesToDisplay} coordinatesToDisplay={coordinatesToDisplay}/>
		</div>
		<div className="worldCereal-ProcessesTable-Details-column">
			{productCollection ? <DetailsItem label={"Product collection:"}>{productCollection}</DetailsItem> : null}
			<DetailsItem label={"Product:"}>{collection?.label}</DetailsItem>
			{model ? <DetailsItem label={"Model:"}>{model}</DetailsItem> : null}
			{startDate ? <DetailsItem label={"Start date:"}>{new Date(startDate).toLocaleDateString()}</DetailsItem> : null}
			{endDate ? <DetailsItem label={"End date:"}>{new Date(endDate).toLocaleDateString()}</DetailsItem> : null}
			<DetailsItem label={"Output file format:"}>{resultFileFormat}</DetailsItem>
		</div>
		{results?.[0] && <div className="worldCereal-ProcessesTable-Details-column">
			<DetailsItem label={"Download results"}>
				{results.map((result, index) => <div key={result.source_link} className="worldCereal-ProcessesTable-DetailItem-result"><a href={result.source_link}>Product {index + 1}</a></div>)}
			</DetailsItem>
		</div>}
	</div>
}

export default Details;
