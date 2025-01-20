import { fetchWithSessions } from "@features/(auth)/_ssr/handlers.sessionFetch";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params: { jobid } }: { params: { jobid: string } }
) {
  try {
    // validate inputs for safe aggragation
    if (!jobid) {
      return NextResponse.json("Missing jobid value", {
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
      key: jobid,
    };

    const openeoUrlPrefix = process.env.OEO_URL

    if(!openeoUrlPrefix)
      throw new Error("Missing openeo URL variable")

    const url = `${openeoUrlPrefix}/openeo/jobs/start`

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
      return NextResponse.json({ error: ["Error starting job"] });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error["message"] });
  }
}
