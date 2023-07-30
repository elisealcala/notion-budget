import { isFullPage, Client, LogLevel } from "@notionhq/client";
import { NextResponse } from "next/server";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
  logLevel: LogLevel.DEBUG,
})

export async function GET(request: Request) {
  const fullOrPartialPages = await notion.databases.query({
    database_id: "98f68b650d544c6697e75b47e067c3cb",
  })
  // for (const page of fullOrPartialPages.results) {
  //   if (!isFullPage(page)) {
  //     continue
  //   }
  //   // The page variable has been narrowed from PageObjectResponse | PartialPageObjectResponse to PageObjectResponse.
  //   console.log("Created at:", page.created_time)
  // }
  return NextResponse.json({ data: fullOrPartialPages.results })
}
