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
  createProductProcess: { url: "create-product-process" },
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
    key: pages.createProductProcess.url,
    title: "Create product process",
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
  unknown = "Unknown type"
}
