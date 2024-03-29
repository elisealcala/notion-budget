import { queryDatabase } from "@/lib/notion-utils";
import { QueryDatabaseParameters } from "@notionhq/client/build/src/api-endpoints";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const startCursor = request.nextUrl.searchParams.get("start_cursor") ?? undefined;
  const dateAfter = request.nextUrl.searchParams.get("date_after") ?? undefined;
  const dateBefore = request.nextUrl.searchParams.get("date_before") ?? undefined;
  const monthId = request.nextUrl.searchParams.get("month_id") ?? undefined;
  const accountId = request.nextUrl.searchParams.get("account_id") ?? undefined;
  const categoryId = request.nextUrl.searchParams.get("category_id") ?? undefined;

  const incomesDatabase = process.env.NOTION_INCOMES_DATABASE as string;

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
    const monthFilter = {
      property: "Month",
      relation: {
        contains: monthId,
      },
    };

    if (options.filter && "and" in options.filter) {
      options.filter.and.push(monthFilter);
    } else {
      options.filter = { and: [monthFilter] } as any;
    }
  }

  if (accountId) {
    const accountFilter = {
      property: "Account",
      relation: {
        contains: accountId,
      },
    };

    if (options.filter && "and" in options.filter) {
      options.filter.and.push(accountFilter);
    } else {
      options.filter = { and: [accountFilter] } as any;
    }
  }

  if (categoryId) {
    const categoryFilter = {
      property: "Category",
      relation: {
        contains: categoryId,
      },
    };

    if (options.filter && "and" in options.filter) {
      options.filter.and.push(categoryFilter);
    } else {
      options.filter = { and: [categoryFilter] } as any;
    }
  }

  if (dateAfter && dateBefore) {
    const dateFilter = {
      property: "Date",
      date: {
        after: dateAfter,
        before: dateBefore,
      },
    };

    if (options.filter && "and" in options.filter) {
      options.filter.and.push(dateFilter);
    } else {
      options.filter = { and: [dateFilter] };
    }
  }

  if (startCursor) {
    options.start_cursor = startCursor;
  }

  const response = await queryDatabase(incomesDatabase, options);

  return NextResponse.json(response);
}
