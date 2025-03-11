import { useUrlParam } from "@features/(shared)/_hooks/_url/useUrlParam";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export type OutputFormat = "GTiff" | "NETCDF";

export const useOutputFormat = (defaultValue: OutputFormat) => {
  const { setUrlParam } = useUrlParam();
  const searchParams = useSearchParams();
  const [value, setValue] = useState<OutputFormat>(() => {
    const urlValue = searchParams.get("off") as OutputFormat;
    return urlValue || defaultValue;
  });

  // Set initial URL value if not present
  useEffect(() => {
    const urlValue = searchParams.get("off");
    if (!urlValue) {
      setUrlParam("off", defaultValue);
    }
  }, [defaultValue, setUrlParam]);

  // Update URL when value changes
  const handleSetValue = (newValue: OutputFormat) => {
    setValue(newValue);
    setUrlParam("off", newValue);
  };

  return {
    value,
    setValue: handleSetValue,
  };
};
