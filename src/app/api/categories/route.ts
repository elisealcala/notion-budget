import { Category, QueryResponseCategory } from "@/types/category";
import { isFullPage, Client, LogLevel } from "@notionhq/client";
import { QueryDatabaseParameters } from "@notionhq/client/build/src/api-endpoints";
import { NextRequest, NextResponse } from "next/server";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
  logLevel: LogLevel.DEBUG,
});

export async function GET(request: NextRequest) {
  const startCursor = request.nextUrl.searchParams.get("start_cursor") ?? undefined;
  const dateAfter = request.nextUrl.searchParams.get("date_after") ?? undefined;
  const dateBefore = request.nextUrl.searchParams.get("date_before") ?? undefined;

  let response: QueryResponseCategory | undefined;

  let options: QueryDatabaseParameters = {
    database_id: "81cc68bbce9d4187a5ed3c52c950d8b8",
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

  const fullOrPartialPages = await notion.databases.query(options);

  for (const page of fullOrPartialPages.results) {
    if (isFullPage(page)) {
      response = {
        ...fullOrPartialPages,
        results: (fullOrPartialPages.results as Category[]).map((result) => {
          return {
            ...result,
          };
        }),
      };
    }
  }

  return NextResponse.json(response);
}
