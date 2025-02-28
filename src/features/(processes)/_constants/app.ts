import {
  IconCirclePlus,
  IconListDetails,
  IconPhotoPlus,
} from "@tabler/icons-react";

/**
 * Represents a product available for selection.
 * @typedef {Object} Product
 * @property {string} value - The unique identifier for the product.
 * @property {string} label - The display name of the product.
 */

/**
 * List of available products for selection.
 * @type {Array<Product>}
 */
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
 * An array of custom product objects used in the application.
 * Each object represents a product with a value, label, and an optional disabled state.
 * 
 * @type {Array<{ value: string; label: string; disabled?: boolean }>}
 * 
 * @property {string} value - The unique identifier for the product.
 * @property {string} label - The display name for the product.
 * @property {boolean} [disabled] - Optional flag indicating if the product is disabled.
 */
export const customProducts: { value: string; label: string; disabled?: boolean }[] = [
  {
    value: "worldcereal_crop_extent",
    label: "Cropland",
  },
  {
    value: "worldcereal_crop_type",
    label: "Crop type",
    disabled: true
  },
  {
    value: "worldcereal_active_cropland",
    label: "Active cropland",
    disabled: true
  }
];