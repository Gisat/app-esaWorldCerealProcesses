import { fetchWithSessions } from "@/app/(shared)/_ssr/handlers.sessionFetch";
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

    const isProd = process.env.NODE_ENV === "production"
    const url = isProd ?
      "https://worldcerealprocesses-dev.gisat.cz/be-interface-openeo/openeo/jobs/start" :
      "http://localhost:6101/openeo/jobs/start"

    const response = await fetchWithSessions(
      {
        method: "POST",
        url,
        browserCookies: req.cookies,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })

    if (response.ok) {
      return NextResponse.json(await response.json());
    } else {
      return NextResponse.json({ error: ["Error starting job"] });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error["message"] });
  }
}
