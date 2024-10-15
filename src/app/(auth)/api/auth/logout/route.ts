import { NextRequest, NextResponse } from "next/server";
import { IAM_CONSTANTS } from "../../../_logic/models.auth";

export const dynamic = 'force-dynamic'
export async function GET(req: NextRequest) {
    try {
        // get url origin
        const parsedUrl = new URL(process.env.OID_SELF_REDIRECT_URL as string)
        const url = `${parsedUrl.protocol}//${parsedUrl.host}`
        
        // build redirect back to frontend
        // add auth result as cookie
        const feRedirect = NextResponse.redirect(url)
        feRedirect.cookies.delete(IAM_CONSTANTS.Cookie_Email)

        return feRedirect
    } catch (error: any) {
        return NextResponse.json({"error": error["message"]})
    }
}