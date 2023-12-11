import { Client, LogLevel } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
  logLevel: LogLevel.DEBUG,
});

export default notion;
