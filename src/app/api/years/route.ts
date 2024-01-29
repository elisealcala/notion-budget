import { NextRequest, NextResponse } from "next/server";
import {
  PageObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { queryDatabase } from "@/lib/notion-utils";

export async function GET(request: NextRequest) {
  const yearDatabase = process.env.NOTION_YEAR_DATABASE as string;

  let response = await queryDatabase(yearDatabase, {});

  return NextResponse.json({ ...response });
}
