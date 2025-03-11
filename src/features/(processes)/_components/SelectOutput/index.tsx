import { OutputFileFormat } from "@features/(processes)/_types/outputFormats";
import { SegmentedControl } from "@mantine/core";
import { FC } from "react";

interface SelectOutputProps {
  data: { label: string; value: OutputFileFormat }[];
  defaultValue: OutputFileFormat;
  value?: OutputFileFormat;
  onChange: (value: OutputFileFormat) => void;
}

const SelectOutput: FC<SelectOutputProps> = ({
  data,
  defaultValue,
  value,
  onChange,
}) => {
  return (
    <SegmentedControl
      className="worldCereal-SegmentedControl"
      onChange={(value) => onChange(value as OutputFileFormat)}
      size="md"
      value={value || defaultValue}
      data={data}
    />
  );
};

export { SelectOutput };
