"use client"

import React, {useState} from 'react';

interface InstanceWarningProps {
	color?: string | undefined,
	hidden?: boolean,
	text?: string | undefined,
}

/**
 * Instance warning strip
 * @param [color] {string | undefined} color of the strip
 * @param [hidden] {boolean} true, if warning should be hidden
 * @param [text] {string | undefined} text of the warning
 * @returns {JSX.Element}
 * @constructor
 */
const InstanceWarningPresentation: React.FC<InstanceWarningProps> = ({color, hidden, text}: InstanceWarningProps) => {
	const [closed, setClosed] = useState(hidden);

	return closed ? null : (
		<div
			style={{
				top: 0,
				display: 'flex',
				position: 'absolute',
				left: 0,
				color: 'white',
				background: color || '#d81b1b',
				width: '100%',
				zIndex: 9999,
			}}
		>
			<div
				style={{
					position: 'relative',
					margin: '0 auto',
				}}
			>
				{text || 'DEV version'}
			</div>
			<div
				onClick={() => setClosed(true)}
				style={{
					position: 'absolute',
					right: 10,
					cursor: 'pointer',
				}}
			>
				{/* Close icon */}
				&#10006;
			</div>
		</div>
	);
};

export default InstanceWarningPresentation;
