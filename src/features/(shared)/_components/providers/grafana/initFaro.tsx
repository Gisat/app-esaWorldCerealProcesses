import { getWebInstrumentations, initializeFaro, faro } from '@grafana/faro-web-sdk';
import { TracingInstrumentation } from '@grafana/faro-web-tracing';

/**
 * Initializes the Faro SDK for application monitoring and tracing.
 *
 * This function configures the Faro SDK with the following settings:
 * - `url`: The collector endpoint for sending telemetry data.
 * - `app`: Metadata about the application, including its name.
 * - `instrumentations`: A list of instrumentations to enable, including default web telemetry and tracing.
 *
 * Note: The collector URL is hardcoded and should be moved to environment variables for better configurability.
 */
export function initFaro() {
	if (faro.api) {
		return faro;
	}

	initializeFaro({
		// The URL of the Faro collector to which telemetry data will be sent.
		url: 'https://faro-collector-prod-us-central-0.grafana.net/collect/7894d9033ca0fbdef8abefb07e88c4bd', // Move to ENVs in the future

		// Application metadata for identification in the monitoring system.
		app: {
			name: 'app-esaWorldCerealProcesses',
		},

		// List of instrumentations to enable for capturing telemetry data.
		instrumentations: [
			// Mandatory, omits default instrumentations otherwise.
			...getWebInstrumentations(),

			// Tracing package to get end-to-end visibility for HTTP requests.
			new TracingInstrumentation(),
		],
	});
}
