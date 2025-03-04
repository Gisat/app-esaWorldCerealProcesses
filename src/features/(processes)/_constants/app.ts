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
 * List of custom product configurations for the WorldCereal application.
 * 
 * @remarks
 * Each product is represented as an object with a unique identifier, display label,
 * and optional properties like namespace URL and disabled status.
 * 
 * @property {string} value - Unique identifier for the product
 * @property {string} label - Human-readable display name for the product
 * @property {string} [namespace] - Optional URL to the product's JSON definition file
 * @property {boolean} [disabled] - When true, indicates the product is currently unavailable
 */
export const customProducts: { value: string; label: string; namespace?: string; disabled?: boolean }[] = [
  {
    value: "worldcereal_crop_extent",
    label: "Cropland",
    namespace: "https://raw.githubusercontent.com/WorldCereal/worldcereal-classification/refs/tags/worldcereal_crop_extent_v1.0.1/src/worldcereal/udp/worldcereal_crop_extent.json"
  },
  {
    value: "worldcereal_crop_type",
    label: "Crop type",
    namespace: "https://raw.githubusercontent.com/WorldCereal/worldcereal-classification/refs/tags/worldcereal_crop_type_v1.0.0/src/worldcereal/udp/worldcereal_crop_type.json",
    disabled: true
  },
  {
    value: "worldcereal_active_cropland",
    label: "Active cropland",
    disabled: true
  }
];