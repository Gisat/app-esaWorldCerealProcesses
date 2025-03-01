import { Stack, Text } from "@mantine/core";
import { MonthPickerInput } from "@mantine/dates";
import { FC, useEffect, useState } from "react";

interface SelectMonthProps {
  label?: string;
  disabled?: boolean;
  placeholder?: string;
  minDate?: Date | undefined;
  maxDate?: Date | undefined;
}

const SelectMonth: FC<SelectMonthProps> = ({
  label = "Default label",
  disabled = false,
  placeholder = "Default placeholder",
  minDate = undefined,
  maxDate = undefined,
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
      : null;

  const formatEndDate =
    endMonth !== null
      ? new Date(endMonth.getFullYear(), endMonth.getMonth() + 1, 1)
      : null; // Last day of end month

  return (
    <div>
      <MonthPickerInput
        label={label}
        size="md"
        placeholder={placeholder}
        value={endMonth}
        minDate={minDate}
        maxDate={maxDate}
        onChange={setEndMonth}
        clearable={false}
        disabled={disabled}
        valueFormat="MMMM YYYY"
      />

      {formatStartDate && formatEndDate && (
        <Stack mt="xs" gap={0}>
          <Text fz="sm">
            Start date: {formatStartDate.toISOString().split("T")[0]}
          </Text>
          <Text fz="sm">
            End date: {formatEndDate.toISOString().split("T")[0]}
          </Text>
        </Stack>
      )}
    </div>
  );
};

export { SelectMonth };
