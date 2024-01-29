import { queryDatabase } from "@/lib/notion-utils";
import { QueryDatabaseParameters } from "@notionhq/client/build/src/api-endpoints";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const startCursor = request.nextUrl.searchParams.get("start_cursor") ?? undefined;
  const dateAfter = request.nextUrl.searchParams.get("date_after") ?? undefined;
  const dateBefore = request.nextUrl.searchParams.get("date_before") ?? undefined;

  const categoriesDatabase = process.env.NOTION_CATEGORIES_DATABASE as string;

  let options: Omit<QueryDatabaseParameters, "database_id"> = {
    sorts: [
      {
        property: "Name",
        direction: "ascending",
      },
    ],
  };

  if (startCursor) {
    options.start_cursor = startCursor;
  }

  const response = await queryDatabase(categoriesDatabase, options);

  return NextResponse.json(response);
}
