import { useState } from 'react';
import { Group, NumberInput, Radio, Stack, Text } from '@mantine/core';
import { useQueryStates } from 'nuqs';
import formParams from '@features/(processes)/_constants/generate-custom-products/formParams';
import { generateCustomProductsSearchParams } from '@features/(processes)/_constants/generate-custom-products/searchParams';
import './CropTypeOptions.css';
import { TextLink } from '@features/(shared)/_layout/_components/Content/TextLink';
import { customProductsPostprocessMethods } from '@features/(processes)/_constants/app';

export default function CropTypeOptions() {
	const [{ orbitState, postprocessMethod, postprocessKernelSize }, setParams] = useQueryStates(
		generateCustomProductsSearchParams
	);

	const [localKernelSize, setLocalKernelSize] = useState<string>(String(postprocessKernelSize));

	const handleOrbitStateChange = (value: string) => {
		setParams({ orbitState: value as 'ASCENDING' | 'DESCENDING' });
	};

	const handlePostprocessMethodChange = (value: string) => {
		setParams({ postprocessMethod: value as 'smooth_probabilities' | 'majority_vote' });
	};

	const handleKernelSizeChange = (val: string | number) => {
		const strVal = String(val);
		setLocalKernelSize(strVal);

		if (strVal !== '') {
			const num = Number(strVal);
			if (!isNaN(num)) {
				setParams({ postprocessKernelSize: num });
			}
		}
	};

	const kernelSizeNum = Number(localKernelSize);
	const kernelSizeError =
		localKernelSize === '' ||
		isNaN(kernelSizeNum) ||
		kernelSizeNum < 1 ||
		kernelSizeNum > 25 ||
		kernelSizeNum % 2 === 0
			? 'Kernel size must be an odd number between 1 and 25'
			: undefined;

	return (
		<Stack>
			<Radio.Group
				className="worldCereal-Radio"
				label="Orbit state"
				value={orbitState}
				onChange={handleOrbitStateChange}
				size="md"
			>
				<Group className="worldCereal-CropTypeOptions-radioGroup">
					{formParams.orbitState.options.map((option) => (
						<Radio key={option.value} value={option.value} label={option.label} />
					))}
				</Group>
				<Text size="sm" c="var(--textSecondaryColor)">
					Most dominant Sentinel-1 orbit for your area of interest, either &apos;ASCENDING&apos; or
					&apos;DESCENDING&apos;. See{' '}
					<TextLink url="https://docs.sentinel-hub.com/api/latest/data/sentinel-1-grd/">
						https://docs.sentinel-hub.com/api/latest/data/sentinel-1-grd/
					</TextLink>
				</Text>
			</Radio.Group>

			<Radio.Group
				className="worldCereal-Radio"
				label="Postprocess method"
				value={postprocessMethod}
				onChange={handlePostprocessMethodChange}
				size="md"
			>
				<Group className="worldCereal-CropTypeOptions-radioGroup">
					{formParams.postprocessMethod.options.map((option) => (
						<Radio key={option.value} value={option.value} label={option.label} />
					))}
				</Group>
				<Text size="sm" c="var(--textSecondaryColor)">
					&quot;smooth_probabilities&quot; will perform limited spatial cleaning of the map, while
					&quot;majority_vote&quot; will perform more aggressive spatial cleaning by assessing the most dominant
					predicted class in a moving window (see also postprocess_kernel_size parameter).
				</Text>
			</Radio.Group>
			{postprocessMethod === customProductsPostprocessMethods.majorityVote && (
				<Stack gap="xs">
					<NumberInput
						className="worldCereal-Input"
						label="Postprocess kernel size"
						value={localKernelSize}
						onChange={handleKernelSizeChange}
						min={1}
						max={25}
						step={1}
						size="md"
						error={kernelSizeError}
					/>
					<Text size="sm" c="dimmed">
						Additional parameter used for the majority vote postprocessing method. The higher the value, the more
						aggressive the spatial cleaning. Must be an odd positive number not larger than 25.
					</Text>
				</Stack>
			)}
		</Stack>
	);
}
