import { customProductsDateLimits } from '@features/(processes)/_constants/app';

const formParams: {
    product: {
        required?: boolean;
        options: {
            label: string;
            value: string;
            namespace?: string
            default?: boolean;
            disabled?: boolean
        }[]
    };
    model: {
        required?: boolean;
        options: {
            label: string;
            value: string;
            default?: boolean;
        }[]
    },
    endDate: {
        required?: boolean;
        options: {
            value: string;
            default?: boolean;
        }[]
    }
    outputFileFormat: {
        required?: boolean;
        options: {
            label: string;
            value: string;
            default?: boolean;
        }[]
    }
} = {
    product: {
        required: true,
        options:
            [
                {
                    value: "worldcereal_crop_extent",
                    label: "Cropland",
                    namespace:
                      "https://raw.githubusercontent.com/WorldCereal/worldcereal-classification/refs/tags/worldcereal_crop_extent_v1.0.1/src/worldcereal/udp/worldcereal_crop_extent.json"
                  },
                  {
                    value: "worldcereal_crop_type",
                    label: "Crop type",
                    namespace:
                      "https://raw.githubusercontent.com/WorldCereal/worldcereal-classification/refs/tags/worldcereal_crop_type_v1.0.0/src/worldcereal/udp/worldcereal_crop_type.json"
                  },
                  {
                    value: "worldcereal_active_cropland",
                    label: "Active cropland",
                    disabled: true
                  }
            ]
    },
    model: {
        required: true,
        options: [
            {
                value: "default",
                label: "Default",
                default: true
            }
        ]
    },
    endDate: {
        required: true,
        options: [
            {
                value: customProductsDateLimits.max,
                default: true
            }
        ]
    },
    outputFileFormat: {
        required: true,
        options: [
            {
                value: "GTiff",
                label: "GeoTIFF",
                default: true
            },
            {
                label: "NetCDF",
                value: "NETCDF"
            }
        ]
    }
}

export default formParams;