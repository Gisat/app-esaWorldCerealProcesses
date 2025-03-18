import { OutputFileFormat } from "@features/(processes)/_types/outputFormats";
import { SegmentedControl } from "@mantine/core";
import { FC } from "react";

/**
 * Props for the SelectOutput component.
 *
 * @typedef {Object} SelectOutputProps
 * @property {any | undefined} data - The options for the segmented control.
 * @property {OutputFileFormat} defaultValue - The default selected output format.
 * @property {(value: OutputFileFormat) => void} onChange - Callback function triggered when the format is changed.
 */
interface SelectOutputProps {
  data: any | undefined;
  defaultValue: OutputFileFormat;
  onChange: (value: OutputFileFormat) => void;
}

/**
 * SelectOutput Component
 *
 * A segmented control for selecting an output file format (e.g., "GTiff" or "NETCDF").
 *
 * @component
 * @param {SelectOutputProps} props - Component props.
 * @returns {JSX.Element} A segmented control UI component for format selection.
 */
const SelectOutput: FC<SelectOutputProps> = ({
  data = undefined,
  defaultValue = "GTiff",
  onChange,
}) => {
  return (
    <SegmentedControl
			className="worldCereal-SegmentedControl"
      onChange={(value) => onChange(value as OutputFileFormat)}
      size="md"
      defaultValue={defaultValue}
      data={data}
    />
  );
};

export { SelectOutput };
