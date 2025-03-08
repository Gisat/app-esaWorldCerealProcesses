"use client"

import styles from "./map.module.css";
import React from "react";
import { LayersList } from "@deck.gl/core";
import DeckGL from '@deck.gl/react';
import { TileLayer } from "@deck.gl/geo-layers";
import { BitmapLayer } from "@deck.gl/layers";

/**
 * Interface for the RenderMapProps.
 */
export interface RenderMapProps {
    /** Reference to the map. */
    mapRef?: any;
    /** Custom base map layer. */
    customBaseMap?: TileLayer;
    /** Width of the map. */
    width?: string;
    /** Height of the map. */
    height?: string;
    /** List of layers to be rendered. */
    layer?: LayersList;
    /** Callback function for click events. */
    onClick?: (info: object) => void;
    /** Function to get the cursor style. */
    getCursor?: (info: object) => string;
    /** Callback function for hover events. */
    onHover?: (info: object) => void;
    /** Callback function for drag events. */
    onDrag?: (info: object) => void;
    /** Callback function for drag start events. */
    onStartDragging?: (info: object) => void;
    /** Callback function for drag stop events. */
    onStopDragging?: (info: object) => void;
    /** Callback function for view state change events. */
    onViewStateChange?: (info: object) => void;
    /** Boolean to disable controls. */
    disableControls?: boolean;
    /** Initial view state of the map. */
    initialView: object | null;
    /** Function to set distance scales. */
    setDistanceScales?: (distanceScales: { unitsPerDegree?: Array<number>; metersPerUnit: Array<number>; }) => void;
}

/**
 * Rendered map with DeckGL tool used as a geospatial renderer.
 * 
 * @param {RenderMapProps} props - The props for the RenderingMap component.
 * @returns {JSX.Element} The rendered map component.
 */
const RenderingMap: React.FC<RenderMapProps> = (props: RenderMapProps) => {

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

export default RenderingMap;