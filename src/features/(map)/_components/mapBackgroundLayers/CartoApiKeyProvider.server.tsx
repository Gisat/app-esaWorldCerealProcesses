import { CartoApiKeyProvider as CartoApiKeyProviderClient } from './CartoApiKeyProvider.client';

/**
 * Props for the server CartoApiKeyProvider component.
 */
interface CartoApiKeyServerProviderProps {
	/** React children elements to be rendered inside the provider. */
	children: React.ReactNode;
}

/**
 * Server component that reads the Carto basemap API key from `process.env`
 * and provides it to the client component tree.
 *
 * Reads the `CARTO_API_KEY` environment variable directly from `process.env`
 * (this is a server component so process.env is available at request time).
 *
 * @param {CartoApiKeyServerProviderProps} props - Component props.
 * @returns {React.ReactElement} The client provider with the API key.
 */
export function CartoApiKeyProvider({ children }: CartoApiKeyServerProviderProps) {
	const cartoApiKey = process.env.CARTO_API_KEY;

	return <CartoApiKeyProviderClient cartoApiKey={cartoApiKey}>{children}</CartoApiKeyProviderClient>;
}
