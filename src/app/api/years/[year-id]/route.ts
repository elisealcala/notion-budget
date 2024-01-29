import { emptyPageObjectResponse, getPage } from "@/lib/notion-utils";
import { Year } from "@/types/year";
import { isFullPage } from "@notionhq/client";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { "year-id": string } }
): Promise<NextResponse<PageObjectResponse>> {
  const yearId = params["year-id"];

  let response = await getPage(yearId);

  if (!isFullPage(response)) {
    return NextResponse.json(emptyPageObjectResponse);
  }

  let year = response as Year;

  return NextResponse.json({
    ...year,
  });
}
