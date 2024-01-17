import { NextRequest, NextResponse } from "next/server";
import {
  PageObjectResponse,
  QueryDatabaseParameters,
} from "@notionhq/client/build/src/api-endpoints";
import { emptyPageObjectResponse, getPage, queryDatabase } from "@/lib/notion-utils";
import { isFullPage } from "@notionhq/client";
import { Month } from "@/types/month";
import { Expense } from "@/types/expense";
import { Income } from "@/types/income";
import { Transfer } from "@/types/transfer";

export async function GET(
  request: NextRequest
): Promise<NextResponse<PageObjectResponse>> {
  const monthId = request.nextUrl.searchParams.get("id") ?? "";

  const expenseDatabase = process.env.NOTION_EXPENSES_DATABASE as string;

  const incomesDatabase = process.env.NOTION_INCOMES_DATABASE as string;

  const transfersDatabase = process.env.NOTION_TRANSFERS_DATABASE as string;

  let response = await getPage(monthId);

  if (!isFullPage(response)) {
    return NextResponse.json(emptyPageObjectResponse);
  }

  let month = response as Month;

  const filter = {
    property: "Month",
    relation: {
      contains: monthId,
    },
  };

  const sorts = [
    {
      property: "Date",
      direction: "descending" as "descending",
    },
  ];

  const expenses = await queryDatabase(expenseDatabase, {
    filter,
    sorts,
  });

  const incomes = await queryDatabase(incomesDatabase, {
    filter,
    sorts,
  });

  const transfers = await queryDatabase(transfersDatabase, {
    // filter,
    sorts,
  });

  let updatedProperties = {
    ...month.properties,
    "Expenses Relation": {
      ...month.properties["Expenses Relation"],
      relation: expenses.results as Expense[],
    },
    "Incomes Relation": {
      ...month.properties["Incomes Relation"],
      relation: incomes.results as Income[],
    },
    "Transfers Relation": {
      ...month.properties["Transfers Relation"],
      relation: transfers.results as Transfer[],
    },
  };

  return NextResponse.json({
    ...month,
    properties: updatedProperties,
  });
}
