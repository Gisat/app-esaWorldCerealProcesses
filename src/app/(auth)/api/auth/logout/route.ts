import { NextRequest, NextResponse } from "next/server";
import { IAM_CONSTANTS } from "../../../_logic/models.auth";
import { pages } from "@/constants/app";

export const dynamic = 'force-dynamic'
export async function GET(req: NextRequest) {
    try {
        // get url origin
        const parsedUrl = new URL(process.env.OID_SELF_REDIRECT_URL as string);
        const url = `${parsedUrl.protocol}//${parsedUrl.host}/${pages.processesList.url}`;
        const feRedirect = NextResponse.redirect(url);
        
        // TODO Edit in prod
        // remove cookie
        feRedirect.cookies.delete(IAM_CONSTANTS.Cookie_Email)

        return feRedirect
    } catch (error: any) {
        return NextResponse.json({"error": error["message"]})
    }
}