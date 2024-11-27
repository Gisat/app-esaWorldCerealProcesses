import { ApplicationClient, GraphNode } from "../_logic/models.panther";
import { RenderingLayer } from "../../(map)/_logic/models.layers";

/**
 * Shared state of the application
 */
export interface AppSharedState {
    appNode: ApplicationClient, // context of the application from the backend
    renderingLayers: RenderingLayer[] // backend layers in rendering context
}