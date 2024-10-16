import { queryDatabase } from "@/lib/notion-utils";
import { QueryDatabaseParameters } from "@notionhq/client/build/src/api-endpoints";
import { NextRequest, NextResponse } from "next/server";

function addFilter(options: Omit<QueryDatabaseParameters, "database_id">, filter: any) {
  if (options.filter && "and" in options.filter) {
    options.filter.and.push(filter);
  } else {
    options.filter = { and: [filter] } as any;
  }
}

export async function GET(request: NextRequest) {
  const startCursor = request.nextUrl.searchParams.get("start_cursor") ?? undefined;
  const dateAfter = request.nextUrl.searchParams.get("date_after") ?? undefined;
  const dateBefore = request.nextUrl.searchParams.get("date_before") ?? undefined;
  const monthId = request.nextUrl.searchParams.get("month_id") ?? undefined;
  const accountId = request.nextUrl.searchParams.get("account_id") ?? undefined;
  const categoryId = request.nextUrl.searchParams.get("category_id") ?? undefined;

  const expenseDatabase = process.env.NOTION_EXPENSES_DATABASE as string;

  let options: Omit<QueryDatabaseParameters, "database_id"> = {
    sorts: [
      {
        property: "Date",
        direction: "descending",
      },
      {
        property: "Name",
        direction: "descending",
      },
    ],
  };

  if (monthId) {
    addFilter(options, {
      property: "Month",
      relation: {
        contains: monthId,
      },
    });
  }

  if (accountId) {
    addFilter(options, {
      property: "Account",
      relation: {
        contains: accountId,
      },
    });
  }

  if (categoryId) {
    addFilter(options, {
      property: "Category",
      relation: {
        contains: categoryId,
      },
    });
  }

  if (dateAfter && dateBefore) {
    addFilter(options, {
      property: "Date",
      date: {
        after: dateAfter,
        before: dateBefore,
      },
    });
  }

  if (startCursor) {
    options.start_cursor = startCursor;
  }

  // console.log({ categoryId, options: options.filter?.and });

  const response = await queryDatabase(expenseDatabase, options);

  return NextResponse.json(response);
}
