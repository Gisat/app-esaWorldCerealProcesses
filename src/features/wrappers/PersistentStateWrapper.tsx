'use client';
import { usePersistentStateFromPanther } from '@features/hooks/usePersistentStateFromPanther';
import { PageLoader, SharedStateWrapper } from '@gisatcz/ptr-fe-core/client';

/**
 * A React component that fetches and manages shared application state,
 * persistent state, and loading state for datasources.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to render once the data is loaded.
 *
 * @returns {JSX.Element} The rendered component, either a loading animation or the wrapped child components.
 */
export const PersistentStateWrapper = ({ children }: { children: any }) => {
	// Hook to manage shared state, persistent state, and loading state.
	const { isLoading, sharedAppState, dispatch } = usePersistentStateFromPanther({
		setPersistentStateOnDispatch: true,
		setPersistentStateOnDispatchDelay: 200,
	});

	// Render the main page when data is ready.
	if (!isLoading) {
		return (
			// Wrap the content in shared state React contexts.
			<SharedStateWrapper sharedState={sharedAppState} sharedStateDispatchFunction={dispatch}>
				{children}
			</SharedStateWrapper>
		);
	}

	// Show a loading animation while data is being fetched.
	else {
		return <PageLoader />;
	}
};
