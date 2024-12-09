import { fetchWithSessions } from "@/app/(shared)/_ssr/handlers.sessionFetch";
import { NextRequest, NextResponse } from "next/server";
// import { fakedbAggregationValues } from "../../../_ssr/atmotube.aggregations";
// import {
//   cacheGet,
//   cacheSet,
// } from "../../../../(shared)/_logic/caching.nodecache";
// import { ggAggregationCacheKey } from "../../../_ssr/cache.gg";
// import {
//   StatisticsMethods,
//   TimeIntervals,
// } from "../../../../(shared)/_logic/models.filtration";
// import { enumIncludes, enumToArray } from "../../../../(shared)/_logic/utils";

export async function GET(req: NextRequest) {
  try {
    // read query params from the request URL
    const { searchParams } = req.nextUrl;

    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const bbox = searchParams.get("bbox");
    const outputFileFormat = searchParams.get("outputFileFormat");
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

    // try to get value from cache
    // const cacheKey = ggAggregationCacheKey({
    //   timeInterval: timeInterval as TimeIntervals,
    //   statisticsMethod: statisticsMethod as StatisticsMethods,
    // });
    // const cacheResult = cacheGet(cacheKey);

    // if we have something in the cache, use it and return
    // if (cacheResult) return NextResponse.json(cacheResult);

    // if not, let's calculate aggregation
    // const fakeDatabaseResult = fakedbAggregationValues(
    //   statisticsMethod as StatisticsMethods,
    //   timeInterval as TimeIntervals
    // );

    // //...and save it into the cache for next time
    // cacheSet(cacheKey, fakeDatabaseResult, 1000);

    // return result
    // return NextResponse.json(fakeDatabaseResult);

    const data = {
      collection: collection,
      bbox: bbox.split(",").map(Number),
      timeRange: [startDate, endDate],
      // bands: ["B01", "B02"],
      // outputFileFormat: "NETCDF",
      outputFileFormat: outputFileFormat,
    };

    const isProd = process.env.NODE_ENV === "production"
    const url = isProd ?
      "https://worldcerealprocesses-dev.gisat.cz/be-interface-openeo/openeo/jobs/create" :
      "http://localhost:6100/openeo/jobs/create"

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
