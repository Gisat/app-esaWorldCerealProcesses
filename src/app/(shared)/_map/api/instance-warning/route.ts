import { ErrorBehavior } from "@features/(shared)/errors/enums.errorBehavior";
import { handleRouteError } from "@features/(shared)/errors/handlers.errorInRoute";
import { BaseHttpError } from "@features/(shared)/errors/models.error";
import { NextResponse } from "next/server";

// NextJS Cache controls
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

/**
 * Handles GET requests for instance warnings.
 * @returns {Promise<NextResponse>} - The response object.
 */
export async function GET(): Promise<NextResponse> {
    try {
        // Check required environment variables
        const instanceWarningHidden = process.env.INSTANCE_WARNING_HIDDEN;
        const instanceWarningColor = process.env.INSTANCE_WARNING_COLOR;
        const instanceWarningText = process.env.INSTANCE_WARNING_TEXT;

        // Throw error if INSTANCE_WARNING_TEXT is missing
        if (!instanceWarningText)
            throw new BaseHttpError("Missing INSTANCE_WARNING_TEXT environment variable", 500, ErrorBehavior.SSR);

        // Throw error if INSTANCE_WARNING_COLOR is missing
        if (!instanceWarningColor)
            throw new BaseHttpError("Missing INSTANCE_WARNING_COLOR environment variable", 500, ErrorBehavior.SSR);

        // Throw error if INSTANCE_WARNING_HIDDEN is missing
        if (!instanceWarningHidden)
            throw new BaseHttpError("Missing INSTANCE_WARNING_HIDDEN environment variable", 500, ErrorBehavior.SSR);

        // Prepare backend content
        const backendContent = {
            hidden: instanceWarningHidden === "true",
            color: instanceWarningColor ? `#${instanceWarningColor}` : undefined,
            text: instanceWarningText
        };

        // Prepare NextJS response with received cookies including new SID
        const nextResponse = NextResponse.json(backendContent);

        return nextResponse;

    } catch (error: any) {
        
        // Handle route error
        const { message, status } = handleRouteError(error);
        const response = NextResponse.json({ error: message }, { status });

        // Delete SID cookie if status is 401
        if (status === 401) response.cookies.delete("sid");

        return response;
    }
}
