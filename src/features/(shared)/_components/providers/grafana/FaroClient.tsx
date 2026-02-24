'use client';
import { useEffect } from 'react';
import { initFaro } from './initFaro';

/**
 * React component responsible for initializing the Faro SDK on the client side.
 *
 * This component uses the `useEffect` hook to ensure that the Faro SDK is initialized
 * only once when the component is mounted. The initialization is performed by calling
 * the `initFaro` function, which sets up application monitoring and tracing.
 *
 * USE THIS COMPONENT ONLY ONCE IN THE APPLICATION, PREFERABLY IN THE ROOT LAYOUT.
 *
 * @returns {null} This component does not render any UI.
 */
export default function FaroClient() {
	useEffect(() => {
		// Initialize the Faro SDK when the component is mounted.
		initFaro();
	}, []);

	return null;
}
