import InstanceWarningPresentation from "@features/(shared)/_components/InstanceWarning/InstanceWarningPresentation";
import { headers } from "next/headers";

export default async function InstanceWarning() {
	// TODO: There probably should be some better solution for this as part of ptr-fe-core package
    const headersList = await headers();
    const host = headersList.get("host");
    const protocol = headersList.get("x-forwarded-proto") || "http";
    const baseUrl = `${protocol}://${host}`;

    const res = await fetch(`${baseUrl}/api/envs`, { cache: "no-store" });
    const data = await res.json();

    return (
        <InstanceWarningPresentation
            hidden={data.INSTANCE_WARNING_HIDDEN === "true"}
            color={data.INSTANCE_WARNING_COLOR}
            text={data.INSTANCE_WARNING_TEXT}
        />
    );
}
