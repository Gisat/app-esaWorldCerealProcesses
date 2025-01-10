import { FaroConfigProps } from "./models.faro";

/**
 * Check faro configuration parameters for empty values
 * @param faroProps Faro props creaef from uncertain sources (fetch, ENV, package.json)
 * @returns Checked and validated faro configuration properties
 */
export const parseFaroParameters = (faroProps: FaroConfigProps) => {

    if (!faroProps.appName)
        throw Error("Faro Config: App name is missing.")
    
    if (!faroProps.environment)
        throw Error("Faro Config: Environment is missing.")
    
    if (!faroProps.faroUrl)
        throw Error("Faro Config: URL is missing.")
    
    if (!faroProps.version)
        throw Error("Faro Config: App version is missing.")

    return faroProps
}