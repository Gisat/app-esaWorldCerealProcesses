import { transformDate } from "@features/(processes)/_utils/transformDate";
import { Stack, Text } from "@mantine/core";
import { MonthPickerInput } from "@mantine/dates";
import { FC, useEffect, useRef, useState } from "react";

interface SelectMonthProps {
  label?: string;
  disabled?: boolean;
  placeholder?: string;
  minDate?: Date | undefined;
  maxDate?: Date | undefined;
  startDate?: string; // Add prop for URL startDate
  endDate?: string; // Add prop for URL endDate
  onChange: (startDate: string, endDate: string) => void;
}

/**
 * A functional component that renders a month picker input and displays the selected start and end dates.
 *
 * @component
 * @param {SelectMonthProps} props - The properties for the SelectMonth component.
 * @param {string} [props.label="Default label"] - The label for the month picker input.
 * @param {boolean} [props.disabled=false] - Whether the month picker input is disabled.
 * @param {string} [props.placeholder="Default placeholder"] - The placeholder text for the month picker input.
 * @param {Date | undefined} [props.minDate=undefined] - The minimum selectable date for the month picker input.
 * @param {Date | undefined} [props.maxDate=undefined] - The maximum selectable date for the month picker input.
 * @param {(startDate: string, endDate: string) => void} props.onChange - The callback function to handle date changes.
 *
 * @returns {JSX.Element} The rendered SelectMonth component.
 *
 * @example
 * <SelectMonth
 *   label="Select a month"
 *   disabled={false}
 *   placeholder="Choose a month"
 *   minDate={new Date("2020-01-01")}
 *   maxDate={new Date("2025-12-31")}
 *   onChange={(startDate, endDate) => console.log(startDate, endDate)}
 * />
 */
const SelectMonth: FC<SelectMonthProps> = ({
  label = "Default label",
  disabled = false,
  placeholder = "Default placeholder",
  minDate = undefined,
  maxDate = undefined,
  startDate: initialStartDate,
  endDate: initialEndDate,
  onChange,
}) => {
  // Parse initial dates from URL or use default
  const getInitialEndMonth = () => {
    if (initialEndDate) {
      return new Date(initialEndDate);
    }
    return new Date("2024-12-01");
  };

  const [endMonth, setEndMonth] = useState<Date | null>(getInitialEndMonth());
  const [startMonth, setStartMonth] = useState<Date | null>(
    initialStartDate ? new Date(initialStartDate) : null
  );
  const isInitialMount = useRef(true);

  // Update local state when URL params change
  useEffect(() => {
    if (initialEndDate) {
      setEndMonth(new Date(initialEndDate));
    }
    if (initialStartDate) {
      setStartMonth(new Date(initialStartDate));
    }
  }, [initialStartDate, initialEndDate]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (endMonth) {
      const newStartMonth = new Date(endMonth);
      newStartMonth.setMonth(endMonth.getMonth() - 11);
      newStartMonth.setDate(1);
      setStartMonth(newStartMonth);

      const startDate = transformDate(
        new Date(newStartMonth.getFullYear(), newStartMonth.getMonth(), 2)
      );
      const endDate = transformDate(
        new Date(endMonth.getFullYear(), endMonth.getMonth() + 1, 1)
      );

      if (startDate && endDate) {
        onChange(startDate, endDate);
      }
    }
  }, [endMonth, onChange]);

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
        style={{ maxWidth: "25rem" }}
      />

      {startMonth && endMonth && (
        <Stack mt="xs" gap={0}>
          <Text fz="sm">
            Start date:{" "}
            {transformDate(
              new Date(startMonth.getFullYear(), startMonth.getMonth(), 2)
            )}
          </Text>
          <Text fz="sm">
            End date:{" "}
            {transformDate(
              new Date(endMonth.getFullYear(), endMonth.getMonth() + 1, 1)
            )}
          </Text>
        </Stack>
      )}
    </div>
  );
};

export { SelectMonth };
