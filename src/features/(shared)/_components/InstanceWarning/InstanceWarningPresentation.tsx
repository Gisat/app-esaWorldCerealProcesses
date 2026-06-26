'use client';

import React, { useState } from 'react';

interface InstanceWarningProps {
	color?: string | undefined;
	hidden?: boolean;
	text?: string | undefined;
	link?: string | undefined;
	linkText?: string | undefined;
	continueText?: string | undefined;
	fullWindow?: boolean;
}

/**
 * Instance warning strip
 */
export const InstanceWarningPresentation: React.FC<InstanceWarningProps> = ({
	color,
	hidden,
	text,
	link,
	linkText = 'Open production',
	continueText = 'Continue to developer version',
	fullWindow = false,
}: InstanceWarningProps) => {
	const [closed, setClosed] = useState(hidden);

	if (closed) return null;

	const cardBg = color ?? '#3d52c4';

	if (fullWindow) {
		return (
			<div
				role="alertdialog"
				aria-modal="true"
				aria-label="Instance warning"
				style={{
					position: 'fixed',
					inset: 0,
					zIndex: 9999,
					background: 'rgba(0,0,0,0.70)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<div
					style={{
						background: cardBg,
						color: '#ffffff',
						borderRadius: 12,
						padding: '40px 48px',
						maxWidth: 600,
						width: '90%',
						textAlign: 'center',
						boxShadow: '0 8px 40px rgba(0,0,0,0.55)',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						gap: 24,
					}}
				>
					{/* Warning text */}
					<div style={{ fontSize: '0.97rem', fontWeight: 600, lineHeight: 1.5 }}>{text ?? 'DEV version'}</div>

					{/* "To production" button */}
					{link ? (
						<a
							href={link}
							target="_blank"
							rel="noopener noreferrer"
							style={{
								display: 'inline-block',
								background: 'transparent',
								color: '#ffffff',
								fontWeight: 700,
								fontSize: '2rem',
								borderRadius: 6,
								border: '3px solid #ffffff',
								padding: '10px 32px',
								textDecoration: 'none',
								letterSpacing: '0.01em',
							}}
						>
							{linkText}
						</a>
					) : null}

					{/* "Continue anyway" dismiss link */}
					<button
						onClick={() => setClosed(true)}
						style={{
							background: 'none',
							border: 'none',
							color: '#d0d8ff',
							cursor: 'pointer',
							fontSize: '0.85rem',
							textDecoration: 'underline',
							padding: 0,
							marginTop: -8,
						}}
					>
						{continueText}
					</button>
				</div>
			</div>
		);
	}

	// Banner variant (top strip)
	const bannerBg = color ?? '#d81b1b';
	return (
		<div
			role="alert"
			style={{
				top: 0,
				left: 0,
				width: '100%',
				zIndex: 9999,
				display: 'flex',
				alignItems: 'center',
				padding: '6px 44px',
				position: 'fixed',
				background: bannerBg,
				color: '#f0f0f0',
			}}
		>
			{/* Left: action link to production */}
			{link ? (
				<a
					href={link}
					target="_blank"
					rel="noopener noreferrer"
					style={{
						position: 'absolute',
						left: 12,
						color: '#f0f0f0',
						textDecoration: 'underline',
						fontWeight: 500,
						fontSize: '0.85rem',
					}}
				>
					{linkText}
				</a>
			) : null}

			{/* Center: warning text */}
			<div style={{ margin: '0 auto', textAlign: 'center' }}>{text ?? 'DEV version'}</div>

			{/* Right: close button */}
			<div
				role="button"
				tabIndex={0}
				onClick={() => setClosed(true)}
				onKeyDown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
						setClosed(true);
					}
				}}
				style={{
					position: 'absolute',
					right: 10,
					cursor: 'pointer',
					fontSize: '1.1rem',
					lineHeight: 1,
					padding: '4px 8px',
				}}
				aria-label="Close instance warning"
				title="Close"
			>
				&#10006;
			</div>
		</div>
	);
};
