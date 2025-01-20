import { Nullable } from "@features/(shared)/coding/code.types"

export enum UsedEdgeLabels {
    RelatedTo = "RELATED",
}

/**
 * Tuple for relation between two graph nodes
 * It is point to point definition of graph edge
 */
export type EdgeConnectionTuple = [string, string]


/**
 * Edge of the graph model.
 * It connects two graph nodes and have some properties.
 * Have "key" witch is composed from node keys.
 */
export interface GraphEdge{
    labels: string[] | UsedEdgeLabels[],
    edgeNodes: EdgeConnectionTuple
    properties: Nullable<object>
}