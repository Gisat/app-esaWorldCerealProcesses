import {
  IconCirclePlus,
  IconListDetails,
  IconPhotoPlus,
} from "@tabler/icons-react";

export const products: Array<{ value: string; label: string }> = [
  {
    value: "ESA_WORLDCEREAL_ACTIVECROPLAND",
    label: "Active cropland",
  },
  {
    value: "ESA_WORLDCEREAL_IRRIGATION",
    label: "Irigation",
  },
  {
    value: "ESA_WORLDCEREAL_TEMPORARYCROPS",
    label: "Temporary crops",
  },
  {
    value: "ESA_WORLDCEREAL_WINTERCEREALS",
    label: "Winter cereals",
  },
  {
    value: "ESA_WORLDCEREAL_MAIZE",
    label: "Maize",
  },
  {
    value: "ESA_WORLDCEREAL_SPRINGCEREALS",
    label: "Spring cereals",
  },
];

export const pages = {
  processesList: { url: "processes-list" },
  createDownloadProcess: { url: "create-download-process" },
  generateCustomProducts: { url: "generate-custom-products" },
};

export const navbarItems = [
  {
    key: pages.processesList.url,
    title: "List of processes",
    icon: IconListDetails,
  },
  {
    key: pages.createDownloadProcess.url,
    title: "Create download process",
    icon: IconCirclePlus,
  },
  {
    key: pages.generateCustomProducts.url,
    title: "Generate custom products",
    icon: IconPhotoPlus,
  },
];

/**
 * Enum representing different types of processes.
 *
 * @enum {string}
 * @property {string} download - Represents a download process.
 * @property {string} product - Represents a product-related process.
 * @property {string} unknown - Represents an unknown type of process.
 */
export const enum processTypes {
  download = "Download",
  product = "Product",
  unknown = "Unknown type",
}

/**
 * Enum representing different types of World Cereal processes.
 * @enum {string}
 * @readonly
 * @property {string} WorldCerealDataCrop - Process for world cereal crop extent
 * @property {string} WorldCerealCropType - Process for world cereal crop type classification
 */
export enum UsedCerealProcesses {
  WorldCerealDataCrop = "worldcereal_crop_extent",
  WorldCerealCropType = "worldcereal_crop_type",
}
