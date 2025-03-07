import {
  IconFileDownload,
  IconHome,
  IconListCheck,
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

/**
 * URL path mappings for application process pages.
 *
 * @property {object} processesList - Configuration for the processes list page.
 * @property {string} processesList.url - URL path segment for the processes list page.
 * @property {object} createDownloadProcess - Configuration for the download process creation page.
 * @property {string} createDownloadProcess.url - URL path segment for the download process creation page.
 * @property {object} generateCustomProducts - Configuration for the custom products generation page.
 * @property {string} generateCustomProducts.url - URL path segment for the custom products generation page.
 */
export const pages = {
  home: { url: "home" },
  processesList: { url: "processes-list" },
  downloadOfficialProducts: { url: "download-official-products" },
  generateCustomProducts: { url: "generate-custom-products" },
};

/**
 * Navigation items configuration for the application's navbar.
 *
 * Each item in the array represents a navigation destination in the UI with:
 * - key: The URL path of the page (references pages object constants)
 * - title: Display text shown in the navigation
 * - icon: Icon component to display alongside the title
 *
 * @type {Array<{key: string, title: string, icon: React.ComponentType}>}
 */
export const navbarItems = [
  {
    key: pages.home.url,
    title: "Home",
    icon: IconHome,
  },
  {
    key: pages.downloadOfficialProducts.url,
    title: "Download official products",
    icon: IconFileDownload,
  },
  {
    key: pages.generateCustomProducts.url,
    title: "Generate custom products",
    icon: IconPhotoPlus,
  },
  {
    key: pages.processesList.url,
    title: "Your processes",
    icon: IconListCheck,
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
export const customProducts: {
  value: string;
  label: string;
  namespace?: string;
  disabled?: boolean;
}[] = [
  {
    value: "worldcereal_crop_extent",
    label: "Cropland",
    namespace:
      "https://raw.githubusercontent.com/WorldCereal/worldcereal-classification/refs/tags/worldcereal_crop_extent_v1.0.1/src/worldcereal/udp/worldcereal_crop_extent.json",
  },
  {
    value: "worldcereal_crop_type",
    label: "Crop type",
    namespace:
      "https://raw.githubusercontent.com/WorldCereal/worldcereal-classification/refs/tags/worldcereal_crop_type_v1.0.0/src/worldcereal/udp/worldcereal_crop_type.json",
    disabled: true,
  },
  {
    value: "worldcereal_active_cropland",
    label: "Active cropland",
    disabled: true,
  },
];

/**
 * Date range limitations for custom products in the application.
 *
 * @enum {string}
 * @readonly
 * @property {string} min - The minimum allowed date for custom products (December 31, 2018)
 * @property {string} max - The maximum allowed date for custom products (December 31, 2024)
 */
export const enum customProductsDateLimits {
  min = "2018-12-31",
  max = "2024-12-31",
}

/**
 * Enum representing the default product dates.
 *
 * @enum {string}
 * @property {string} startDate - The default start date for products (2024-01-01).
 * @property {string} endDate - The default end date for products (2024-12-31).
 */
export const enum defaultProductsDates {
  startDate = "2024-01-01",
  endDate = "2024-12-31",
}
