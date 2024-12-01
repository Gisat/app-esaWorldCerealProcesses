import { fetchWithSessions } from "@/app/(shared)/_ssr/handlers.sessionFetch";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export async function GET(req: NextRequest) {
  try {
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

    const isProd = process.env.NODE_ENV === "production"
    const url = isProd ?
      `https://worldcerealprocesses-dev.gisat.cz/be-interface-openeo/openeo/jobs/list-all` :
      `http://localhost:6100/openeo/jobs/list-all`

    const response = await fetchWithSessions(
      {
        method: "GET",
        url,
        browserCookies: req.cookies,
        headers: {
          "Content-Type": "application/json"
        },
      })

    if (response.ok) {
      console.log(await response.json())
      return NextResponse.json(await response.json());
    } else {
      return NextResponse.json({ error: ["Error getting list of jobs"] });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error["message"] });
  }
}
