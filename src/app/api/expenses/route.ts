import { Account } from "@/types/account";
import { Category } from "@/types/category";
import { Expense, QueryResponseExpense } from "@/types/expense";
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

  let response: QueryResponseExpense | undefined;

  let options: QueryDatabaseParameters = {
    database_id: "98f68b650d544c6697e75b47e067c3cb",
    sorts: [
      {
        property: "Date",
        direction: "ascending",
      },
      {
        property: "Name",
        direction: "ascending",
      },
    ],
  };

  if (dateAfter && dateBefore) {
    options = {
      ...options,
      filter: {
        property: "Date",
        date: {
          after: dateAfter,
          before: dateBefore,
        },
      },
    };
  }

  if (startCursor) {
    options = {
      ...options,
      start_cursor: startCursor,
    };
  }

  const fullOrPartialPages = await notion.databases.query(options);

  const accounts = await notion.databases.query({
    database_id: "70129f242df34bf9822c71b75bfa72da",
  });

  const categories = await notion.databases.query({
    database_id: "81cc68bbce9d4187a5ed3c52c950d8b8",
  });

  for (const page of fullOrPartialPages.results) {
    if (isFullPage(page)) {
      response = {
        ...fullOrPartialPages,
        results: (fullOrPartialPages.results as Expense[]).map((result) => {
          const accountId =
            result.properties["Account"].type === "relation"
              ? result.properties["Account"].relation[0].id
              : "";
          const categoryId =
            result.properties["Category"].type === "relation"
              ? result.properties["Category"].relation[0].id
              : "";

          return {
            ...result,
            account: (accounts.results as Account[]).find(
              (item) => item.id === accountId
            ),
            category: (categories.results as Category[]).find(
              (item) => item.id === categoryId
            ),
          };
        }),
      };
    }
  }

  return NextResponse.json(response);
}
