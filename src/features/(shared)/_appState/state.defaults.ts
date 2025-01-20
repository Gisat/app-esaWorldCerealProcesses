import { UsedNodeLabels } from "../_panther/models.nodes"
import { AppSharedState } from "./state.models"

/**
 * Creates default version of the shared app state before data input from backend
 * @returns 
 */
export const defaultStateValue = () => {
    const defaultState: AppSharedState = {
        appNode: {
            key: "default",
            description: null,
            lastUpdatedAt: Date.now(),
            nameDisplay: "Default App Node",
            nameInternal: "defaultAppNode",
            configuration: {},
            labels: [UsedNodeLabels.Application]
        },
        renderingLayers: []
    }

    return defaultState
}