import {
  IconFileDownload,
  IconHome,
  IconListCheck,
  IconPhotoPlus,
} from "@tabler/icons-react";

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

/**
 * Bounding box size limits for different product types.
 *
 * @property {Object} downloadProducts - Size limits for download products.
 * @property {number} downloadProducts.min - Minimum size for download products (in square kilometers).
 * @property {number} downloadProducts.max - Maximum size for download products (in square kilometers).
 * @property {Object} customProducts - Size limits for custom products.
 * @property {number} customProducts.min - Minimum size for custom products (in square kilometers).
 * @property {number} customProducts.max - Maximum size for custom products (in square kilometers).
 */
export const bboxSizeLimits = {
  downloadProducts: {
    min: 0.0009,
    max: 100000,
  },
  customProducts: {
    min: 0.0001,
    max: 2500,
  },
};
