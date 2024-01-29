import { QueryResponseAccount } from "@/types/account";
import { QueryResponseCategory } from "@/types/category";
import { Expense, QueryResponseExpense } from "@/types/expense";
import { Income, QueryResponseIncome } from "@/types/income";
import { QueryResponseReports, Report } from "@/types/report";
import { QueryResponseTransfer, Transfer } from "@/types/transfer";
import { Client, LogLevel } from "@notionhq/client";
import { NextRequest, NextResponse } from "next/server";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
  logLevel: LogLevel.DEBUG,
});

export async function GET(request: NextRequest) {
  const startDate = request.nextUrl.searchParams.get("start_date") ?? undefined;
  const endDate = request.nextUrl.searchParams.get("start_date") ?? undefined;
  let allExpenses: Expense[] = [];
  let expenseCursor;
  let allIncomes: Income[] = [];
  let incomeCursor;
  let allTransfers: Transfer[] = [];
  let transferCursor;

  let response;

  const accounts = await fetch(`${process.env.NEXT_PUBLIC_API}/accounts`);

  const accountData: QueryResponseAccount = await accounts.json();

  const categories = await fetch(`${process.env.NEXT_PUBLIC_API}/categories`);

  const categoriesData: QueryResponseCategory = await categories.json();

  while (true) {
    let expenseUrl = `${process.env.NEXT_PUBLIC_API}/expenses?`;

    const params: { [key: string]: any } = {
      date_after: startDate,
      date_before: endDate,
      start_cursor: expenseCursor,
    };

    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([key, value]) => value !== undefined)
    );

    const queryString = new URLSearchParams(filteredParams).toString();

    expenseUrl = expenseUrl + queryString;

    const response = await fetch(expenseUrl);

    const data: QueryResponseExpense = await response.json();

    allExpenses = allExpenses.concat(data.results);

    if (data.next_cursor) {
      expenseCursor = data.next_cursor;
    } else {
      break;
    }
  }

  while (true) {
    let incomesUrl = `${process.env.NEXT_PUBLIC_API}/incomes?`;

    const params: { [key: string]: any } = {
      date_after: startDate,
      date_before: endDate,
      start_cursor: incomeCursor,
    };

    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([key, value]) => value !== undefined)
    );

    const queryString = new URLSearchParams(filteredParams).toString();

    incomesUrl = incomesUrl + queryString;

    const response = await fetch(incomesUrl);

    const data: QueryResponseIncome = await response.json();

    allIncomes = allIncomes.concat(data.results);

    if (data.next_cursor) {
      incomeCursor = data.next_cursor;
    } else {
      break;
    }
  }

  while (true) {
    let transferUrl = `${process.env.NEXT_PUBLIC_API}/transfers?`;

    const params: { [key: string]: any } = {
      date_after: startDate,
      date_before: endDate,
      start_cursor: transferCursor,
    };

    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([key, value]) => value !== undefined)
    );

    const queryString = new URLSearchParams(filteredParams).toString();

    transferUrl = transferUrl + queryString;

    const response = await fetch(transferUrl);

    const data: QueryResponseTransfer = await response.json();

    allTransfers = allTransfers.concat(data.results);

    if (data.next_cursor) {
      transferCursor = data.next_cursor;
    } else {
      break;
    }
  }

  response = {
    accounts: accountData.results.map((account) => ({
      ...account,
      properties: {
        ...account.properties,
        // Incomes: {
        //   type: "relation",
        //   relation: allIncomes.filter((income) => income.account?.id === account.id),
        // },
        // Expenses: {
        //   type: "relation",
        //   relation: allExpenses.filter((expense) => expense.account?.id === account.id),
        // },
        // "To Transfers": {
        //   type: "relation",
        //   relation: allTransfers.filter(
        //     (transfer) => transfer.toAccount?.id === account.id
        //   ),
        // },
        // "From Transfer": {
        //   type: "relation",
        //   relation: allTransfers.filter(
        //     (transfer) => transfer.fromAccount?.id === account.id
        //   ),
        // },
      },
    })),
  };

  return NextResponse.json(response);
}
