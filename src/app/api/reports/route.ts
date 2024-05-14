import { QueryResponseAccount } from "@/types/account";
import { QueryResponseCategory } from "@/types/category";
import { Expense, QueryResponseExpense } from "@/types/expense";
import { Income, QueryResponseIncome } from "@/types/income";
import { Movement } from "@/types/month";
import { QueryResponseReports, Report } from "@/types/report";
import { QueryResponseTransfer, Transfer } from "@/types/transfer";
import { Client, LogLevel } from "@notionhq/client";
import { NextRequest, NextResponse } from "next/server";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
  logLevel: LogLevel.DEBUG,
});

async function fetchData<T>({
  url,
  type,
  params,
}: {
  url: string;
  type: string;
  params: { [key: string]: any };
}) {
  let allData: T[] = [];
  let cursor;

  while (true) {
    params.start_cursor = cursor;

    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([key, value]) => value !== undefined)
    );

    const queryString = new URLSearchParams(filteredParams).toString();

    const response = await fetch(url + queryString);

    const data: { results: T[]; next_cursor: string } = await response.json();

    allData = allData.concat(data.results);

    allData = allData.map((item) => ({
      type,
      ...item,
    }));

    if (data.next_cursor) {
      cursor = data.next_cursor;
    } else {
      break;
    }
  }

  return allData;
}

export async function GET(request: NextRequest) {
  const startDate = request.nextUrl.searchParams.get("start_date") ?? undefined;
  const endDate = request.nextUrl.searchParams.get("start_date") ?? undefined;
  const monthId = request.nextUrl.searchParams.get("month_id") ?? undefined;
  const accountId = request.nextUrl.searchParams.get("account_id") ?? undefined;
  const categoryId = request.nextUrl.searchParams.get("category_id") ?? undefined;

  const params: { [key: string]: any } = {
    date_after: startDate,
    date_before: endDate,
    month_id: monthId,
    account_id: accountId,
    category_id: categoryId,
  };

  const allExpenses = await fetchData<Movement>({
    url: `${process.env.NEXT_PUBLIC_API}/expenses?`,
    type: "expense",
    params,
  });
  const allIncomes = await fetchData<Movement>({
    url: `${process.env.NEXT_PUBLIC_API}/incomes?`,
    type: "income",
    params,
  });

  const allTransfers = await fetchData<Movement>({
    url: `${process.env.NEXT_PUBLIC_API}/transfers?`,
    type: "transfer",
    params,
  });

  const movements = allExpenses
    .concat(allIncomes, allTransfers)
    .filter((movement) => !movement.archived && !movement.in_trash);

  const movementsSorted = movements.sort((a, b) => {
    let dateA = new Date(
      a.properties.Date.type === "date" ? a.properties.Date.date!.start : new Date()
    ).getTime();
    let dateB = new Date(
      b.properties.Date.type === "date" ? b.properties.Date.date!.start : new Date()
    ).getTime();
    return dateB - dateA;
  });

  const response: Movement[] = movementsSorted;

  return NextResponse.json(response);
}
