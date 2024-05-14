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
  const startDate = request.nextUrl.searchParams.get("start_date") ?? undefined;
  const endDate = request.nextUrl.searchParams.get("start_date") ?? undefined;
  const monthId = params["month-id"];

  let response = await getPage(monthId);

  if (!isFullPage(response)) {
    return NextResponse.json(emptyPageObjectResponse);
  }

  let month = response as Month;

  const paramsQuery: { [key: string]: any } = {
    date_after: startDate,
    date_before: endDate,
    month_id: monthId,
  };

  const filteredParams = Object.fromEntries(
    Object.entries(paramsQuery).filter(([key, value]) => value !== undefined)
  );

  const queryString = new URLSearchParams(filteredParams).toString();

  const movements = await fetch(`${process.env.NEXT_PUBLIC_API}/reports?${queryString}`);

  const movementsResponse: Movement[] = await movements.json();

  let updatedProperties = {
    ...month.properties,
    Movements: {
      type: "relation" as "relation",
      id: "movements",
      relation: movementsResponse,
    },
  };

  return NextResponse.json({
    ...month,
    properties: updatedProperties,
  });
}
