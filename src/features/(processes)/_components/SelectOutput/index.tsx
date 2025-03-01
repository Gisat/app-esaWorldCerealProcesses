import { SegmentedControl } from "@mantine/core";
import { FC } from "react";

interface SelectOutputPropos {
  data: any | undefined;
  defaultValue: "GTiff" | "NETCDF";
  onChange: (value: "GTiff" | "NETCDF") => void;
}
const SelectOutput: FC<SelectOutputPropos> = ({
  data = undefined,
  defaultValue = "GTiff",
  onChange,
}) => {
  return (
    <SegmentedControl
      onChange={(value) => onChange(value as "GTiff" | "NETCDF")}
      size="md"
      defaultValue={defaultValue}
      data={data}
    />
  );
};

export { SelectOutput };
