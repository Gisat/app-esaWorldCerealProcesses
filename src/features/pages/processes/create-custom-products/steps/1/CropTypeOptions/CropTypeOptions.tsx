import { useEffect, useState } from 'react';
import { Group, NumberInput, Radio, Stack, Text } from '@mantine/core';
import formParams from '@features/(processes)/_constants/generate-custom-products/formParams';
import './CropTypeOptions.css';
import { TextLink } from '@features/(shared)/_layout/_components/Content/TextLink';
import { useSharedState } from '@gisatcz/ptr-fe-core/client';
import { WorldCerealState } from '@features/state/state.models';
import { OneOfWorldCerealActions } from '@features/state/state.actions';
import { WorldCerealStateActionType } from '@features/state/state.actionTypes';
import { getOrbitState_customProducts } from '@features/state/selectors/createCustomProducts/getOrbitState';
import { getPostProcessMethod_customProducts } from '@features/state/selectors/createCustomProducts/getPostProcessMethod';
import { getPostProcessKernelSize_customProducts } from '@features/state/selectors/createCustomProducts/getPostProcessKernelSize';

/**
 * CropTypeOptions component for selecting orbit state and postprocess options.
 *
 * - Initializes default values for orbit state, postprocess method, and kernel size on mount.
 * - Synchronizes local kernel size input with global state.
 * - Handles user input for orbit state, postprocess method, and kernel size.
 * - Validates kernel size input.
 *
 * @returns {JSX.Element} The rendered crop type options UI.
 */
export default function CropTypeOptions() {
	// Access global state and dispatch
	const [state, dispatch] = useSharedState<WorldCerealState, OneOfWorldCerealActions>();

	// Selectors for global state
	const orbitState = getOrbitState_customProducts(state);
	const postprocessMethod = getPostProcessMethod_customProducts(state);
	const kernelSize = getPostProcessKernelSize_customProducts(state);

	// Local state for kernel size input (for immediate feedback)
	const [localKernelSize, setLocalKernelSize] = useState<string>(kernelSize !== undefined ? String(kernelSize) : '5');

	/**
	 * Initializes default values for orbit state, postprocess method, and kernel size on mount.
	 * Synchronizes local kernel size input with global state if changed externally.
	 */
	useEffect(() => {
		if (!orbitState) {
			dispatch({
				type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_ORBIT_STATE,
				payload: 'DESCENDING',
			});
		}
		if (!postprocessMethod) {
			dispatch({
				type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_POSTPROCESS_METHOD,
				payload: 'smooth_probabilities',
			});
		}
		if (kernelSize === undefined) {
			dispatch({
				type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_POSTPROCESS_KERNEL_SIZE,
				payload: 5,
			});
			setLocalKernelSize('5');
		} else if (String(kernelSize) !== localKernelSize) {
			setLocalKernelSize(String(kernelSize));
		}
	}, [orbitState, postprocessMethod, kernelSize]);

	/**
	 * Handles change for orbit state radio group.
	 * @param {string} value - The selected orbit state.
	 */
	const handleOrbitStateChange = (value: string) => {
		dispatch({
			type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_ORBIT_STATE,
			payload: value as 'ASCENDING' | 'DESCENDING',
		});
	};

	/**
	 * Handles change for postprocess method radio group.
	 * @param {string} value - The selected postprocess method.
	 */
	const handlePostprocessMethodChange = (value: string) => {
		dispatch({
			type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_POSTPROCESS_METHOD,
			payload: value as 'smooth_probabilities' | 'majority_vote',
		});
	};

	/**
	 * Handles change for kernel size input.
	 * Updates local state and dispatches to global state if valid.
	 * @param {string | number} val - The input value.
	 */
	const handleKernelSizeChange = (val: string | number) => {
		const strVal = String(val);
		setLocalKernelSize(strVal);

		// Only dispatch if not empty and is a valid number
		if (strVal !== '') {
			const num = Number(strVal);
			if (!isNaN(num)) {
				dispatch({
					type: WorldCerealStateActionType.CREATE_CUSTOM_PRODUCTS_SET_POSTPROCESS_KERNEL_SIZE,
					payload: num,
				});
			}
		}
	};

	const kernelSizeNum = Number(localKernelSize);
	/**
	 * Error message for invalid kernel size input.
	 */
	const kernelSizeError =
		localKernelSize === '' || isNaN(kernelSizeNum) || kernelSizeNum < 1 || kernelSizeNum > 25
			? 'Kernel size must be a number between 1 and 25'
			: undefined;

	return (
		<Stack>
			{/* Orbit State Selection */}
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
				<Text size="sm" c="dimmed">
					Most dominant Sentinel-1 orbit for your area of interest, either &apos;ASCENDING&apos; or
					&apos;DESCENDING&apos;. See{' '}
					<TextLink url="https://docs.sentinel-hub.com/api/latest/data/sentinel-1-grd/">
						https://docs.sentinel-hub.com/api/latest/data/sentinel-1-grd/
					</TextLink>
				</Text>
			</Radio.Group>

			{/* Postprocess Method Selection */}
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
				<Text size="sm" c="dimmed">
					&quot;smooth_probabilities&quot; will perform limited spatial cleaning of the map, while
					&quot;majority_vote&quot; will perform more aggressive spatial cleaning by assessing the most dominant
					predicted class in a moving window (see also postprocess_kernel_size parameter).
				</Text>
			</Radio.Group>
			{/* Kernel Size Input (only for majority_vote) */}
			{postprocessMethod === 'majority_vote' && (
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
						aggressive the spatial cleaning. Should be a positive number not larger than 25.
					</Text>
				</Stack>
			)}
		</Stack>
	);
}
