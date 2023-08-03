import { Account } from "@/types/account";
import { Transfer, QueryResponseTransfer } from "@/types/transfer";
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

  const accounts = await notion.databases.query({
    database_id: "70129f242df34bf9822c71b75bfa72da",
  });

  let response: QueryResponseTransfer | undefined;

  let options: QueryDatabaseParameters = {
    database_id: "5ef2a8e5dfdd48659c55d416b0778a6f",
    sorts: [
      {
        property: "Date",
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

  for (const page of fullOrPartialPages.results) {
    if (isFullPage(page)) {
      response = {
        ...fullOrPartialPages,
        results: (fullOrPartialPages.results as Transfer[]).map((result) => {
          const fromAccountId =
            result.properties["From Account"].type === "relation"
              ? result.properties["From Account"].relation[0].id
              : "";
          const toAccountId =
            result.properties["To Account"].type === "relation"
              ? result.properties["To Account"].relation[0].id
              : "";

          return {
            ...result,
            fromAccount: (accounts.results as Account[]).find(
              (item) => item.id === fromAccountId
            ),
            toAccount: (accounts.results as Account[]).find(
              (item) => item.id === toAccountId
            ),
          };
        }),
      };
    }
  }

  return NextResponse.json(response);
}
