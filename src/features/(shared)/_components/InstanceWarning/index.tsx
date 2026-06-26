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
	continueText: 'Continue to developer version',
};

/**
 * Server component that reads instance environment variables and renders
 * the InstanceWarningPresentation component with the values.
 *
 * Reads the following environment variables directly from process.env:
 * - INSTANCE_WARNING_HIDDEN
 * - INSTANCE_WARNING_COLOR
 * - INSTANCE_WARNING_TEXT
 * - INSTANCE_WARNING_LINK
 * - INSTANCE_WARNING_LINK_TEXT
 * - INSTANCE_WARNING_CONTINUE_TEXT
 *
 * @param {InstanceWarningProps} [props] - Component props.
 * @returns {JSX.Element} The presentation component.
 */
export default function InstanceWarning({ fullWindow }: InstanceWarningProps = {}) {
	const merged = {
		hidden: process.env.INSTANCE_WARNING_HIDDEN === 'true' ? true : DEFAULT_INSTANCE_WARNING.hidden,
		color: process.env.INSTANCE_WARNING_COLOR ?? DEFAULT_INSTANCE_WARNING.color,
		text: process.env.INSTANCE_WARNING_TEXT ?? DEFAULT_INSTANCE_WARNING.text,
		link: process.env.INSTANCE_WARNING_LINK ?? DEFAULT_INSTANCE_WARNING.link,
		linkText: process.env.INSTANCE_WARNING_LINK_TEXT ?? DEFAULT_INSTANCE_WARNING.linkText,
		continueText: process.env.INSTANCE_WARNING_CONTINUE_TEXT ?? DEFAULT_INSTANCE_WARNING.continueText,
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
