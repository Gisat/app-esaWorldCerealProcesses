'use client';

import React, { createContext, useContext } from 'react';

/**
 * Context holding the Carto basemap API key provided by a server component.
 * `undefined` means no key is configured (Carto tiles are requested without authentication).
 */
const CartoApiKeyContext = createContext<string | undefined>(undefined);

/**
 * Props for the CartoApiKeyProvider component.
 */
interface CartoApiKeyProviderProps {
	/** Carto basemap API key read from the server environment. */
	cartoApiKey?: string;
	/** React children elements to be rendered inside the provider. */
	children: React.ReactNode;
}

/**
 * Client provider that exposes the Carto basemap API key to the component tree.
 *
 * @param {CartoApiKeyProviderProps} props - The props for the provider.
 * @returns {JSX.Element} The provider component.
 */
export function CartoApiKeyProvider({ cartoApiKey, children }: CartoApiKeyProviderProps) {
	return <CartoApiKeyContext.Provider value={cartoApiKey}>{children}</CartoApiKeyContext.Provider>;
}

/**
 * Hook to read the Carto basemap API key from the context.
 *
 * @returns {string | undefined} The Carto basemap API key, or `undefined` when not configured.
 */
export function useCartoApiKey(): string | undefined {
	return useContext(CartoApiKeyContext);
}
