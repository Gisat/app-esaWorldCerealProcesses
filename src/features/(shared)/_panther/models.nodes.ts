import { Nullable } from "@features/(shared)/coding/code.types"


/**
 * What types of graph nodes we use in metadata model
 */
export enum UsedNodeLabels {
    Application = "application",
    Datasource = "datasource",
    Place = "place",
    Period = "period",
    Case = "case",
    Scenario = "scenario",
    Scope = "scope",
    Attribute = "attribute",
    AreaTree = "areaTree",
    AreaTreeLevel = "areaTreeLevel",
    LayerTemplate = "layerTemplate",
    Style = "style"
}

/**
 * What datasources we use in system
 */
export enum UsedDatasourceLabels {
    Attribute = "property", // column with attribute values
    Spatial = "vector", // column with geomery values
    FeatureId = "featureId", // column with feature IDs values
    WMS = "wms", // WMS online source
    COG = "cogBitmap", // COG online source
    MVT = "mvt" // tiled vector image
  }
  

/**
 * General graph node - same for all metadatata entities
 */
export interface GraphNode {
    labels: Array<string | UsedNodeLabels | UsedDatasourceLabels>,
    key: string
    nameDisplay: string,
    nameInternal: string,
    description: Nullable<string>,
    lastUpdatedAt: number,
}

/**
 * Entity that has relevant time interval.
 * Example: Period is connected to some time range.
 */
export interface HasInterval {
    validUtcIntervalIso: string,
    validFrom: number,
    validTo: number
}

/**
 * Entity with custom configuration
 */
export interface HasConfiguration {
    configuration: any
}

/**
 * Place node - somewhere in the world
 */
export interface HasGeometry {
    geometry: any,
    bbox: any,
}

/**
 * Place node - somewhere in the world
 */
export interface HasLevels {
    level: number,
}

/**
 * Place node - somewhere in the world
 */
export interface Place extends GraphNode, HasGeometry { }

/**
 * Period node - selected time in timeline
 */
export interface Period extends GraphNode, HasInterval { }

/**
 * Area tree node - tree of areas
 */
export interface AreaTreeLevel extends GraphNode, HasLevels {}

/**
 * Datasource with source configuration
 */
export interface Datasource extends GraphNode, HasConfiguration {}

/**
 * Application node - main entity in metadata model
 */
export interface ApplicationNode extends GraphNode, HasConfiguration {}