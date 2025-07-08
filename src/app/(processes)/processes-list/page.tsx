/**
 * ProcessesList Component
 *
 * This component serves as a wrapper for the `ProcessesListClient` component.
 * It is responsible for rendering the client-side implementation of the processes list.
 *
 * @component
 * @returns {JSX.Element} The rendered `ProcessesListClient` component.
 */

import { ProcessesListClient } from '@features/pages/processes/ProcessesListClient';

export default function ProcessesList() {
	// Render the ProcessesListClient component
	return <ProcessesListClient />;
}
