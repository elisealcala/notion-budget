import { NextRequest, NextResponse } from "next/server";
import { queryDatabase } from "@/lib/notion-utils";

export async function GET(request: NextRequest) {
  const monthsDatabase = process.env.NOTION_MONTHS_DATABASE as string;

  let response = await queryDatabase(monthsDatabase, {});

  return NextResponse.json({ ...response });
}
