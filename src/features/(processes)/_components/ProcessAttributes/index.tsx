'use client';

import { useState, useCallback } from 'react';
import './style.css';
import { truncateUrl, truncateMiddle } from '@features/(shared)/_logic/utils';

export type ProcessAttributesProps = {
	jobKey?: string;
	product?: string;
	collectionName?: string;
	resultFileFormat?: string;
	seasonalModelZip?: string;
	landcoverHeadZip?: string;
	croptypeHeadZip?: string;
	startDate?: string | Date;
	endDate?: string | Date;
	orbitState?: string;
	seasonId?: string;
	postprocessMethodCroptype?: string;
	postprocessKernelSizeCroptype?: number;
	enableCroplandHead?: boolean;
	maskCropland?: boolean;
	postprocessMethodCropland?: string;
	postprocessKernelSizeCropland?: number;
};

type AttrDef = {
	label: string;
	value: string | undefined | null;
	isLink?: boolean;
	isCopyable?: boolean;
};

export const CopyableText = ({ text, maxLength = 31 }: { text: string; maxLength?: number }) => {
	const [copied, setCopied] = useState(false);

	const handleCopy = useCallback(() => {
		navigator.clipboard.writeText(text).then(() => {
			setCopied(true);
			setTimeout(() => setCopied(false), 1500);
		});
	}, [text]);

	const display = text.length > maxLength ? truncateMiddle(text, maxLength) : text;

	return (
		<span className="process-attr-copy" onClick={handleCopy} title={`Click to copy: ${text}`}>
			{display}
			{copied && <span style={{ marginLeft: 4, fontSize: '0.75em', color: 'var(--successColor, #4caf50)' }}>Copied!</span>}
		</span>
	);
};

const AttrItem = ({ label, value, isLink, isCopyable }: AttrDef) => {
	if (!value) return null;
	return (
		<div className="process-attr">
			<span className="process-attr-label">{label}:</span>
			{isLink ? (
				<a href={value} target="_blank" rel="noopener noreferrer" className="process-attr-link">
					<span className="process-attr-value">{truncateUrl(value)}</span>
				</a>
			) : isCopyable ? (
				<span className="process-attr-value">
					<CopyableText text={value} />
				</span>
			) : (
				<span className="process-attr-value">{value}</span>
			)}
		</div>
	);
};

const ProcessAttributes = (props: ProcessAttributesProps) => {
	const items: AttrDef[] = [
		{ label: 'Job ID', value: props.jobKey, isCopyable: true },
		{ label: 'Product', value: props.product },
		{ label: 'Product collection', value: props.collectionName },
		{ label: 'Output file format', value: props.resultFileFormat },
		{ label: 'Base model', value: props.seasonalModelZip, isLink: true },
		{ label: 'Cropland head override', value: props.landcoverHeadZip, isLink: true },
		{ label: 'Crop type head override', value: props.croptypeHeadZip, isLink: true },
		{
			label: 'Start date',
			value: props.startDate ? new Date(props.startDate).toLocaleDateString() : undefined,
		},
		{
			label: 'End date',
			value: props.endDate ? new Date(props.endDate).toLocaleDateString() : undefined,
		},
		{ label: 'Season ID', value: props.seasonId },
		{ label: 'Orbit state', value: props.orbitState },
		{ label: 'Post process method - croptype', value: props.postprocessMethodCroptype },
		{
			label: 'Post process kernel size - croptype',
			value: typeof props.postprocessKernelSizeCroptype === 'number' ? String(props.postprocessKernelSizeCroptype) : undefined,
		},
		{
			label: 'Cropland head',
			value: props.enableCroplandHead !== undefined ? (props.enableCroplandHead ? 'Enabled' : 'Disabled') : undefined,
		},
		{
			label: 'Cropland mask',
			value: props.maskCropland !== undefined ? (props.maskCropland ? 'Enabled' : 'Disabled') : undefined,
		},
		{ label: 'Post process method - cropland', value: props.postprocessMethodCropland },
		{
			label: 'Post process kernel size - cropland',
			value: typeof props.postprocessKernelSizeCropland === 'number' ? String(props.postprocessKernelSizeCropland) : undefined,
		},
	];

	return items.map((item) => <AttrItem key={item.label} {...item} />);
};

export default ProcessAttributes;
