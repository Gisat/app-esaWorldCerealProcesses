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
    product: {
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
    product: {
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