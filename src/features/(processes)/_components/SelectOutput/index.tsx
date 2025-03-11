import { OutputFileFormat } from "@features/(processes)/_types/outputFormats";
import { SegmentedControl } from "@mantine/core";
import { FC, useEffect, useRef, useState } from "react";

interface SelectOutputProps {
  data: { label: string; value: OutputFileFormat }[];
  defaultValue: OutputFileFormat;
  value?: OutputFileFormat;
  onChange: (value: OutputFileFormat) => void;
}

const SelectOutput: FC<SelectOutputProps> = ({
  data,
  defaultValue,
  value: initialValue,
  onChange,
}) => {
  const [value, setValue] = useState<OutputFileFormat>(
    initialValue || defaultValue
  );
  const isInitialMount = useRef(true);

  // Update local state when URL params change
  useEffect(() => {
    if (initialValue) {
      setValue(initialValue);
    }
  }, [initialValue]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    onChange(value);
  }, [value, onChange]);

  return (
    <SegmentedControl
      className="worldCereal-SegmentedControl"
      onChange={(value) => setValue(value as OutputFileFormat)}
      size="md"
      value={value}
      data={data}
    />
  );
};

export { SelectOutput };
