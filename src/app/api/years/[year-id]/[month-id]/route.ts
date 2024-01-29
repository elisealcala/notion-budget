import { NextRequest, NextResponse } from "next/server";
import {
  PageObjectResponse,
  QueryDatabaseResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { emptyPageObjectResponse, getPage } from "@/lib/notion-utils";
import { isFullPage } from "@notionhq/client";
import { Month, Movement } from "@/types/month";
import { Expense } from "@/types/expense";
import { Income } from "@/types/income";
import { Transfer } from "@/types/transfer";

export async function GET(
  request: NextRequest,
  { params }: { params: { "month-id": string } }
): Promise<NextResponse<PageObjectResponse>> {
  const monthId = params["month-id"];

  let response = await getPage(monthId);

  if (!isFullPage(response)) {
    return NextResponse.json(emptyPageObjectResponse);
  }

  let month = response as Month;

  const expenses = await fetch(
    `${process.env.NEXT_PUBLIC_API}/expenses?month_id=${monthId}`
  );

  const expensesResponse: QueryDatabaseResponse = await expenses.json();

  const incomes = await fetch(
    `${process.env.NEXT_PUBLIC_API}/incomes?month_id=${monthId}`
  );

  const incomesResponse: QueryDatabaseResponse = await incomes.json();

  const transfers = await fetch(
    `${process.env.NEXT_PUBLIC_API}/transfers?month_id=${monthId}`
  );

  const transfersResponse: QueryDatabaseResponse = await transfers.json();

  const expensesWithType = expensesResponse.results.map((expense) => ({
    ...expense,
    type: "expense",
  })) as Movement[];

  const incomesWithType = incomesResponse.results.map((income) => ({
    ...income,
    type: "income",
  })) as Movement[];

  const transfersWithType = transfersResponse.results.map((transfer) => ({
    ...transfer,
    type: "transfer",
  })) as Movement[];

  const movements = expensesWithType.concat(incomesWithType, transfersWithType);

  let updatedProperties = {
    ...month.properties,
    "Expenses Relation": {
      ...month.properties["Expenses Relation"],
      relation: expensesResponse.results as Expense[],
    },
    "Incomes Relation": {
      ...month.properties["Incomes Relation"],
      relation: incomesResponse.results as Income[],
    },
    "Transfers Relation": {
      ...month.properties["Transfers Relation"],
      relation: transfersResponse.results as Transfer[],
    },
    Movements: {
      type: "relation" as "relation",
      id: "movements",
      relation: movements.sort((a, b) => {
        let dateA = new Date(
          a.properties.Date.type === "date" ? a.properties.Date.date!.start : new Date()
        ).getTime();
        let dateB = new Date(
          b.properties.Date.type === "date" ? b.properties.Date.date!.start : new Date()
        ).getTime();
        return dateB - dateA;
      }),
    },
  };

  return NextResponse.json({
    ...month,
    properties: updatedProperties,
  });
}
