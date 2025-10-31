import {
	ActionGlobalStateUpdate,
	AppSharedState,
	defaultStateValue,
	parseNodesFromPanther,
	reducerForSpecificApp,
	StateActionType,
	swrFetcher,
} from '@gisatcz/ptr-fe-core/client';
import { useEffect, useReducer } from 'react';
import useSWR from 'swr';
import { stateReducerMapForWorldCerealApplication } from '@features/state/state.reducer';
import { WorldCerealState } from '@features/state/state.models';

interface useStateFromPantherProps {
	fetchUrl?: string; // The API endpoint to fetch the application state.
	defaultAppState?: Partial<AppSharedState>; // Optional prefilled state to merge with the fetched data.
	loginRedirectPath?: string; // Path to redirect to in case of login issues (e.g., '/account').
	errorRedirectPath?: string; // Path to redirect to in case of errors (e.g., '/error').
}

/**
 * Custom hook for managing shared application state by fetching data from the Panther backend.
 *
 * This hook initializes a shared application state using a reducer, fetches data from the backend
 * using the SWR library, and updates the state based on the fetched data. It also supports optional
 * default state and redirect paths for handling login or error scenarios.
 *
 * @param {string} fetchUrl - The API endpoint to fetch the application state.
 * @param {Partial<AppSharedState>} [defaultAppState] - Optional prefilled state to merge with the fetched data.
 * @param {string} [loginRedirectPath] - Path to redirect to in case of login issues.
 * @param {string} [errorRedirectPath] - Path to redirect to in case of errors.
 * @returns {Object} An object containing the shared application state, error status, loading status, validation status, and the dispatch function.
 */
export const useStateFromPanther = ({
	fetchUrl,
	defaultAppState,
	loginRedirectPath,
	errorRedirectPath,
}: useStateFromPantherProps) => {
	// Prepare reducer map for this application
	const feCoreReducerMap = stateReducerMapForWorldCerealApplication();

	// generate React reducer funtion for this application
	const reactReducer = reducerForSpecificApp<WorldCerealState>(feCoreReducerMap);

	// Initialize the shared application state using a reducer
	const [sharedAppState, dispatch] = useReducer(reactReducer, defaultStateValue());
	console.log('### AppState', sharedAppState);

	const { data, error, isLoading, isValidating } = useSWR(fetchUrl, (url: string) =>
		swrFetcher(url, { loginRedirectPath, errorRedirectPath })
	);

	// Effect to update state based on the fetched data
	useEffect(() => {
		if (data) {
			// Parse the nodes from the response
			const { applicationsNode, datasourceNodes, placeNodes, periodNodes } = parseNodesFromPanther(data);

			// Dispatch actions to update the state
			dispatch({ type: StateActionType.APP_NODE, payload: applicationsNode });
			dispatch({ type: StateActionType.FETCH_SOURCES, payload: datasourceNodes });
			dispatch({ type: StateActionType.FETCH_PLACES, payload: placeNodes });
			dispatch({ type: StateActionType.FETCH_PERIODS, payload: periodNodes });

			// If defaultAppState is provided, merge it with the fetched data
			if (defaultAppState) {
				dispatch({ type: StateActionType.GLOBAL_STATE_UPDATE, payload: defaultAppState } as ActionGlobalStateUpdate);
			}
		}
	}, [data, error]);

	// Return state and fetch status for usage in components
	return { sharedAppState, error, isLoading, isValidating, dispatch };
};
