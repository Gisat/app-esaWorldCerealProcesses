import { fetchWithSessions } from "@features/(auth)/_ssr/handlers.sessionFetch";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // read query params from the request URL
    const { searchParams } = req.nextUrl;

    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const bbox = searchParams.get("bbox");
    const off = searchParams.get("off");
    const collection = searchParams.get("collection");

    // validate inputs for safe aggragation
    if (!startDate) {
      return NextResponse.json("Missing startDate value", {
        status: 400,
      });
    }

    if (!endDate) {
      return NextResponse.json("Missing endDate value", {
        status: 400,
      });
    }

    if (!bbox) {
      return NextResponse.json("Missing bbox value", {
        status: 400,
      });
    }

    if (!off) {
      return NextResponse.json("Missing outputFileFormat value", {
        status: 400,
      });
    } 

    const data = {
      collection: collection,
      bbox: bbox.split(",").map(Number),
      timeRange: [startDate, endDate],
      // bands: ["B01", "B02"],
      // outputFileFormat: "NETCDF",
      outputFileFormat: off,
    };

    const openeoUrlPrefix = process.env.OEO_URL

    if(!openeoUrlPrefix)
      throw new Error("Missing openeo URL variable")

    const url = `${openeoUrlPrefix}/openeo/jobs/create`

    const {status, backendContent, setCookieHeader} = await fetchWithSessions(
      {
        method: "POST",
        url,
        browserCookies: req.cookies,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })

      if (status === 200) {
        const nextResponse = NextResponse.json(backendContent);

        if (setCookieHeader) {
          nextResponse.headers.set('set-cookie', setCookieHeader);
        }
        return nextResponse
    } else {
      return NextResponse.json({ error: ["Error creating entity"] });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error["message"] });
  }
}
