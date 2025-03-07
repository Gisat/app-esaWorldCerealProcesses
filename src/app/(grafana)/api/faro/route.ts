import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';
import { FaroConfigProps } from "@features/(grafana)/_logic/models.faro";
import { parseFaroParameters } from "@features/(grafana)/_logic/parsers.faro";
import { handleRouteError } from "@features/(shared)/errors/handlers.errorInRoute";

// do not batch into app build
export const dynamic = 'force-dynamic'

/**
 * Rout endpoint to extract and return Faro configuration parameters as shared model
 * @returns 
 */
export async function GET() {

    try {
        // environment parameters
        const env = process.env.NODE_ENV
        const faroUrl = process.env.FARO_URL

        // read package json
        const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8'));

        // prepare grafana faro configuration from package json and environment values 
        const faroSetup: FaroConfigProps = parseFaroParameters({
            appName: packageJson["name"],
            environment: env,
            faroUrl: faroUrl as string,
            version: packageJson["version"]
        })

        return NextResponse.json(faroSetup)
    } catch (error: any) {
        const { message, status } = handleRouteError(error)
        const response = NextResponse.json({ error: message }, { status })

        if (status === 401)
            response.cookies.delete("sid")

        return response
    }
}