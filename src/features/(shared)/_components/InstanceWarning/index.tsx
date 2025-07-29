import React from 'react';
import InstanceWarningPresentation
	from "@features/(shared)/_components/InstanceWarning/InstanceWarningPresentation";

/**
 * Instance warning strip
 * @returns {JSX.Element}
 * @constructor
 */
const InstanceWarning: React.FC<{ hidden: boolean; color?: string; text?: string }> = (props) => {
	return (
		<InstanceWarningPresentation
			hidden={props.hidden}
			color={props.color}
			text={props.text}
		/>
	)
};

export default InstanceWarning
