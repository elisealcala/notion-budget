import { NextRequest, NextResponse } from "next/server";
import {
  PageObjectResponse,
  QueryDatabaseParameters,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { getPage, queryDatabase } from "@/lib/notion-utils";
import { isFullPage } from "@notionhq/client";
import { isFullPageOrDatabase } from "@notionhq/client/build/src/helpers";

type Month = {
  type: "relation";
  relation: Array<{
    id: string;
  }>;
  id: string;
  name: string;
};

export interface MonthPage extends PageObjectResponse {
  properties: Record<
    "Name",
    {
      type: "title";
      title: Array<RichTextItemResponse>;
      id: string;
    }
  > &
    Record<
      "Date",
      {
        type: "date";
        date: {
          start: string;
          end: string | null;
          time_zone: "UTC";
        } | null;
        id: string;
      }
    >;
}

export async function GET(request: NextRequest) {
  const selectedYear = request.nextUrl.searchParams.get("name");

  let options: Omit<QueryDatabaseParameters, "database_id"> = {};

  if (selectedYear) {
    options = {
      filter: {
        property: "Name",
        rich_text: {
          equals: selectedYear,
        },
      },
    };
  }

  const databaseId = process.env.NOTION_YEAR_DATABASE as string;

  let response = await queryDatabase(databaseId, options);

  let updatedResults = await Promise.all(
    response.results.map(async (result) => {
      if (isFullPage(result)) {
        let monthsInfo = await Promise.all(
          (result.properties["Months"] as Month).relation.map(async (month) => ({
            id: month.id,
            month: (await getPage(month.id, ["title"])) as MonthPage,
          }))
        );

        // monthsInfo = monthsInfo.sort((a, b) => {
        //   let startDateA = new Date(a.month.properties.Date.date?.start ?? "").getTime();
        //   let startDateB = new Date(b.month.properties.Date.date?.start ?? "").getTime();
        //   return startDateB - startDateA;
        // });

        return {
          ...result,
          properties: {
            ...result.properties,
            Months: {
              ...result.properties["Months"],
              relation: monthsInfo,
            },
          },
        };
      }
      return result;
    })
  );

  return NextResponse.json({ ...response, results: updatedResults });
}
