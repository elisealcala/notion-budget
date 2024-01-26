import { queryDatabase } from "@/lib/notion-utils";
import { Account, QueryResponseAccount, Properties } from "@/types/account";
import { isFullPage, Client, LogLevel } from "@notionhq/client";
import { QueryDatabaseParameters } from "@notionhq/client/build/src/api-endpoints";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const startCursor = request.nextUrl.searchParams.get("start_cursor") ?? undefined;
  const dateAfter = request.nextUrl.searchParams.get("date_after") ?? undefined;
  const dateBefore = request.nextUrl.searchParams.get("date_before") ?? undefined;

  const accountDatabase = process.env.NOTION_ACCOUNT_DATABASE as string;

  let options: Omit<QueryDatabaseParameters, "database_id"> = {
    sorts: [
      {
        property: "Name",
        direction: "ascending",
      },
    ],
  };

  if (startCursor) {
    options = {
      ...options,
      start_cursor: startCursor,
    };
  }

  let response = await queryDatabase(accountDatabase, options);

  // for (const page of response.results) {
  //   if (isFullPage(page)) {
  //     response = {
  //       ...response,
  //       results: response.results as Account[],
  //     };
  //   }
  // }

  return NextResponse.json(response);
}
