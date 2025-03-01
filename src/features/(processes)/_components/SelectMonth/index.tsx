import { transformDate } from "@features/(processes)/_utils/transformDate";
import { Stack, Text } from "@mantine/core";
import { MonthPickerInput } from "@mantine/dates";
import { FC, useEffect, useState } from "react";

interface SelectMonthProps {
  label?: string;
  disabled?: boolean;
  placeholder?: string;
  minDate?: Date | undefined;
  maxDate?: Date | undefined;
  onChange: (startDate: string, endDate: string) => void;
}

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

  // Update start month when end month is selected
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

  // Handle `onChange` inside MonthPickerInput
  const handleMonthChange = (value: Date | null) => {
    if (!value) return;
    setEndMonth(value);

    if (formatStartDate && formatEndDate) {
      const startDate = transformDate(formatStartDate);
      const endDate = transformDate(formatEndDate);

      if (startDate && endDate) {
        onChange(startDate, endDate);
      }
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
