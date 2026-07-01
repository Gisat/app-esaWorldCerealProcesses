import { InstanceWarningPresentation } from './InstanceWarningPresentation';

/**
 * Props for the InstanceWarning server component.
 *
 * @property {boolean} [fullWindow] - If true, the banner is rendered with fixed positioning across the entire viewport.
 */
interface InstanceWarningProps {
	/** If true, the banner is rendered with fixed positioning across the entire viewport. */
	fullWindow?: boolean;
}

// Default values for the instance warning if environment values are not available
export const DEFAULT_INSTANCE_WARNING = {
	hidden: false,
	color: '#d81b1b',
	text: 'DEV version',
	link: undefined,
	linkText: 'Open production',
	continueText: 'Continue',
};

/**
 * Server component that fetches instance environment variables and renders
 * the InstanceWarningPresentation component with the fetched values.
 *
 * This component performs a server-side fetch to the internal `/api/envs` endpoint
 * (no-cache) to obtain the following environment flags that control the banner:
 * - INSTANCE_WARNING_HIDDEN
 * - INSTANCE_WARNING_COLOR
 * - INSTANCE_WARNING_TEXT
 * - INSTANCE_WARNING_LINK
 * - INSTANCE_WARNING_LINK_TEXT
 * - INSTANCE_WARNING_CONTINUE_TEXT
 *
 * @param {InstanceWarningProps} [props] - Component props.
 * @returns {Promise<JSX.Element>} The presentation component.
 */
export default function InstanceWarning({ fullWindow }: InstanceWarningProps = {}) {
	// Read the instance warning configuration directly from process.env
	// (this is a server component so process.env is available). The
	// endpoint `/api/envs` is not necessary anymore and caused an extra
	// round-trip during SSR.
	const {
		INSTANCE_WARNING_HIDDEN,
		INSTANCE_WARNING_COLOR,
		INSTANCE_WARNING_TEXT,
		INSTANCE_WARNING_LINK,
		INSTANCE_WARNING_LINK_TEXT,
		INSTANCE_WARNING_CONTINUE_TEXT,
	} = process.env;

	// Merge fetched data with defaults. When data is missing, use DEFAULT_INSTANCE_WARNING.
	const merged = {
		hidden: INSTANCE_WARNING_HIDDEN === 'true' ? true : DEFAULT_INSTANCE_WARNING.hidden,
		color: INSTANCE_WARNING_COLOR ?? DEFAULT_INSTANCE_WARNING.color,
		text: INSTANCE_WARNING_TEXT ?? DEFAULT_INSTANCE_WARNING.text,
		link: INSTANCE_WARNING_LINK ?? DEFAULT_INSTANCE_WARNING.link,
		linkText: INSTANCE_WARNING_LINK_TEXT ?? DEFAULT_INSTANCE_WARNING.linkText,
		continueText: INSTANCE_WARNING_CONTINUE_TEXT ?? DEFAULT_INSTANCE_WARNING.continueText,
	};

	return (
		<InstanceWarningPresentation
			hidden={merged.hidden}
			color={merged.color}
			text={merged.text}
			link={merged.link}
			linkText={merged.linkText}
			continueText={merged.continueText}
			fullWindow={fullWindow}
		/>
	);
}
