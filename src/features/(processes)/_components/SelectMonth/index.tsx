import { transformDate } from "@features/(processes)/_utils/transformDate";
import { Stack, Text } from "@mantine/core";
import { MonthPickerInput } from "@mantine/dates";
import { FC, useEffect, useState } from "react";

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
  minDate?: Date | undefined;
  maxDate?: Date | undefined;
  onChange: (startDate: string, endDate: string) => void;
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
  label = "Default label",
  disabled = false,
  placeholder = "Default placeholder",
  minDate = undefined,
  maxDate = undefined,
  onChange,
}) => {
  const defaultEndMonth = new Date("2024-12-01"); // Rule: Default end month (Dec 2024)
  const [endMonth, setEndMonth] = useState<Date | null>(defaultEndMonth);
  const [startMonth, setStartMonth] = useState<Date | null>(null);

  /**
   * Updates the start month when the end month is selected.
   * Ensures the start date is exactly 12 months prior to the selected end month.
   */
  useEffect(() => {
    if (endMonth) {
      const newStartMonth = new Date(endMonth);
      newStartMonth.setMonth(endMonth.getMonth() - 11); // Ensures exactly 12 months before
      newStartMonth.setDate(1); // Always the first day of the month

      setStartMonth(newStartMonth);
    }
  }, [endMonth]);

  // Ensure valid start and end dates
  const formatStartDate =
    startMonth !== null
      ? new Date(startMonth.getFullYear(), startMonth.getMonth(), 2)
      : undefined;

  const formatEndDate =
    endMonth !== null
      ? new Date(endMonth.getFullYear(), endMonth.getMonth() + 1, 1)
      : undefined; // Last day of end month

  /**
   * Handles the selection of a month, updating state and triggering `onChange`.
   * (Handle `onChange` inside MonthPickerInput)
   *
   * @param {Date | null} value - The newly selected month.
   */
  const handleMonthChange = (value: Date | null) => {
    if (!value) return;

    // Immediately calculate the correct start month instead of relying on useEffect
    const newStartMonth = new Date(value);
    newStartMonth.setMonth(value.getMonth() - 11);
    newStartMonth.setDate(1);

    setEndMonth(value);
    setStartMonth(newStartMonth);

    // Calculate formatted dates immediately
    const startDate = transformDate(
      new Date(newStartMonth.getFullYear(), newStartMonth.getMonth(), 2)
    );
    const endDate = transformDate(
      new Date(value.getFullYear(), value.getMonth() + 1, 1)
    );

    if (startDate && endDate) {
      onChange(startDate, endDate);
    }
  };

  return (
    <div>
      <MonthPickerInput
        label={label}
        size="md"
        placeholder={placeholder}
        value={endMonth}
        minDate={minDate}
        maxDate={maxDate}
        onChange={handleMonthChange}
        clearable={false}
        disabled={disabled}
        valueFormat="MMMM YYYY"
        style={{ maxWidth: "25rem" }}
      />

      {formatStartDate && formatEndDate && (
        <Stack mt="xs" gap={0}>
          <Text fz="sm">Start date: {transformDate(formatStartDate)}</Text>
          <Text fz="sm">End date: {transformDate(formatEndDate)}</Text>
        </Stack>
      )}
    </div>
  );
};

export { SelectMonth };
