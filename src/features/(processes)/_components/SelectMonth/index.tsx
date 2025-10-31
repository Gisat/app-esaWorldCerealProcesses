import getBoundaryDates from '@features/(processes)/_utils/boundaryDates';
import { transformDate } from '@features/(processes)/_utils/transformDate';
import { Stack, Text } from '@mantine/core';
import { MonthPickerInput } from '@mantine/dates';
import { FC, useEffect, useState } from 'react';

/**
 * Props for the SelectMonth component.
 *
 * @typedef {Object} SelectMonthProps
 * @property {string} [label] - The label for the month picker.
 * @property {boolean} [disabled] - Whether the month picker is disabled.
 * @property {string} [placeholder] - The placeholder text for the input.
 * @property {Date} [minDate] - The minimum selectable date.
 * @property {Date} [maxDate] - The maximum selectable date.
 * @property {(startDate: string, endDate: string) => void} onChange - Callback function called when a month is selected.
 */
interface SelectMonthProps {
	label?: string;
	disabled?: boolean;
	placeholder?: string;
	minDate: Date | undefined;
	maxDate: Date | undefined;
	value?: string;
	onChange: (endDate: string) => void;
}

/**
 * SelectMonth Component
 *
 * A reusable component that allows users to pick an ending month, automatically setting the start date
 * to 12 months prior. The selected start and end dates are passed to the parent component via `onChange`.
 *
 * @component
 * @param {SelectMonthProps} props - Component props.
 * @returns {JSX.Element} A month picker input with auto-calculated start and end dates.
 */
const SelectMonth: FC<SelectMonthProps> = ({
	label = 'Default label',
	disabled = false,
	placeholder = 'Default placeholder',
	minDate,
	maxDate,
	value,
	onChange,
}) => {
	const [selectedDate, setSelectedDate] = useState<Date>();
	const [startDateString, setStartDateString] = useState<string>('');
	const [endDateString, setEndDateString] = useState<string>('');

	useEffect(() => {
		if (selectedDate) {
			const boundaryDates = getBoundaryDates(selectedDate);
			setStartDateString(transformDate(boundaryDates.startDate));
			setEndDateString(transformDate(boundaryDates.endDate));
			onChange(transformDate(boundaryDates.endDate));
		}
	}, [selectedDate, onChange]);

	return (
		<div>
			<MonthPickerInput
				label={label}
				size="md"
				placeholder={placeholder}
				value={selectedDate || (value && new Date(value)) || null}
				minDate={minDate}
				maxDate={maxDate}
				onChange={(value) => value && setSelectedDate(new Date(value))}
				clearable={false}
				disabled={disabled}
				valueFormat="MMMM YYYY"
				style={{ maxWidth: '25rem' }}
			/>

			{startDateString && endDateString && (
				<Stack mt="xs" gap={0}>
					<Text fz="sm">Start date: {startDateString}</Text>
					<Text fz="sm">End date: {endDateString}</Text>
				</Stack>
			)}
		</div>
	);
};

export { SelectMonth };
