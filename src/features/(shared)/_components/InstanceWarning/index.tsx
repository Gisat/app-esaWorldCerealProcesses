import React from 'react';
import InstanceWarningPresentation
	from "@features/(shared)/_components/InstanceWarning/InstanceWarningPresentation";

/**
 * Instance warning strip
 * @returns {JSX.Element}
 * @constructor
 */
const InstanceWarning: React.FC = () => {
	return (
		<InstanceWarningPresentation
			hidden={process?.env?.INSTANCE_WARNING_HIDDEN === "true"}
			color={process.env.INSTANCE_WARNING_COLOR ? `#${process.env.INSTANCE_WARNING_COLOR}` : undefined}
			text={process?.env?.INSTANCE_WARNING_TEXT}
		/>
	)
};

export default InstanceWarning
