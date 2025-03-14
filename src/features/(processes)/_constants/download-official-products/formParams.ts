/**
 * Represents the parameters for a form used to download official products.
 * 
 * @property collection - Configuration for the collection selection.
 * @property collection.required - Indicates if the collection selection is required.
 * @property collection.options - Array of available collection options.
 * @property collection.options[].label - The display label for the collection option.
 * @property collection.options[].value - The value associated with the collection option.
 * @property collection.options[].default - Indicates if this option is the default selection.
 * @property collection.options[].start - The start date for the collection option.
 * @property collection.options[].end - The end date for the collection option.
 * 
 * @property products - Configuration for the product selection.
 * @property products.required - Indicates if the product selection is required.
 * @property products.options - Array of available product options.
 * @property products.options[].label - The display label for the product option.
 * @property products.options[].value - The value associated with the product option.
 * @property products.options[].default - Indicates if this option is the default selection.
 * 
 * @property outputFileFormat - Configuration for the output file format selection.
 * @property outputFileFormat.required - Indicates if the output file format selection is required.
 * @property outputFileFormat.options - Array of available output file format options.
 * @property outputFileFormat.options[].label - The display label for the output file format option.
 * @property outputFileFormat.options[].value - The value associated with the output file format option.
 * @property outputFileFormat.options[].default - Indicates if this option is the default selection.
 */
const formParams: {
    collection: {
        required?: boolean;
        options: {
            label: string;
            value: string;
            default?: boolean;
            start: string;
            end: string;
        }[]
    };
    products: {
        required?: boolean;
        options: {
            label: string;
            value: string;
            default?: boolean;
        }[]
    };
    outputFileFormat: {
        required?: boolean;
        options: {
            label: string;
            value: string;
            default?: boolean;
        }[]
    }
} = {
    collection: {
        required: true,
        options: [
            {
                label: "2021",
                value: "2021",
                default: true,
                start: "2021-01-01",
                end: "2021-12-31"
            }
        ]
    },
    products: {
        required: true,
        options:
            [
                {
                    value: "ESA_WORLDCEREAL_ACTIVECROPLAND",
                    label: "Active cropland",
                },
                {
                    value: "ESA_WORLDCEREAL_IRRIGATION",
                    label: "Irrigation",
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