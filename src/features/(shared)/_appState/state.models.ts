import { RenderingLayer } from "@features/(shared)/_logic/models.layers";
import { ApplicationNode } from "@features/(shared)/_panther/models.nodes";
/**
 * Shared state of the application
 */
export interface AppSharedState {
    appNode: ApplicationNode, // context of the application from the backend
    renderingLayers: RenderingLayer[] // backend layers in rendering context
}