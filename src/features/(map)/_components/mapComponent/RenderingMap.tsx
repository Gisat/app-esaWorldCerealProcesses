"use client"

import styles from "./map.module.css";
import React from "react";
import { LayersList } from "@deck.gl/core";
import DeckGL from '@deck.gl/react';
import { TileLayer } from "@deck.gl/geo-layers";
import { BitmapLayer } from "@deck.gl/layers";

export interface RenderMapProps {
	mapRef?: any,
	customBaseMap?: TileLayer,
  width?: string,
  height?: string,
	layer?: LayersList,
	onClick?: (info: object) => void,
	getCursor?: (info: object) => string,
	onHover?: (info: object) => void,
	onDrag?: (info: object) => void,
	onStartDragging?: (info: object) => void,
	onStopDragging?: (info: object) => void,
	onViewStateChange?: (info: object) => void,
	disableControls?: boolean,
	initialView: object | null,
	setDistanceScales?: (distanceScales: { unitsPerDegree?: Array<number>; metersPerUnit: Array<number>; }) => void
}
/** Rendered map with DeckGL tool used as a geospatial renderer */
const RenderingMap: React.FC<RenderMapProps> = (props: RenderMapProps) => {

	// Retrieve distanceScales from the mapRef if available - otherwise dont show any distance calculations
	const distanceScales = props?.mapRef?.current?.deck?.viewManager?._viewports?.[0]?.distanceScales;

	if (props.setDistanceScales && distanceScales) {
		props.setDistanceScales(distanceScales);
	}
	
	const tileLayer = new TileLayer({
		id: 'TileLayer',
		data: 'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
		maxZoom: 19,
		minZoom: 0,

		renderSubLayers: (props: any) => {
			const { boundingBox } = props.tile;

			return new BitmapLayer(props, {
				data: undefined,
				image: props.data,
				bounds: [boundingBox[0][0], boundingBox[0][1], boundingBox[1][0], boundingBox[1][1]]
			});
		},
	});
const layers = [props.customBaseMap ? props.customBaseMap : tileLayer, props.layer].filter(layer => layer !== undefined);

  return (
    <section className={`${styles.mapRender}`}>
      <DeckGL
				ref={props.mapRef}
        initialViewState={props.initialView}
        layers={layers}
        controller={!props.disableControls}
        style={{ position: "relative", width: props.width, height: props.height }}
				onClick={props.onClick}
				onHover={props.onHover}
				onDrag={props.onDrag}
				onDragStart={props.onStartDragging}
				onDragEnd={props.onStopDragging}
				onViewStateChange={props.onViewStateChange}
				getCursor={(info) => {return props.getCursor ? props.getCursor(info) : (info.isDragging ? "grabbing" : "grab")}} // otherwise throws an error
      >
      </DeckGL>
    </section>
  )
}

export default RenderingMap
