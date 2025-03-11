export const requiredParamsStep1 = {
  product: false,
  startDate: false,
  endDate: false,
  outputFileFormat: false,
  bbox: false,
};

export const requiredParamsStep2 = {
  product: true,
  startDate: false,
  endDate: false,
  outputFileFormat: false,
  bbox: false,
};

export const requiredParamsStep3 = {
  product: true,
  startDate: true,
  endDate: true,
  outputFileFormat: true,
  bbox: true,
};
