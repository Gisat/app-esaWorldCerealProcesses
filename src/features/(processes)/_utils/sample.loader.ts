import fs from "node:fs"
import path from "node:path"

export const getSamples = () => {
    const sampleFilePath = path.join(process.cwd(), "samples/api.jobs.get.list.json");
    if (process.env.NODE_ENV === "development" && fs.existsSync(sampleFilePath)) {
        return JSON.parse(fs.readFileSync(sampleFilePath, "utf-8"));
    } else {
        return [];
    }
}