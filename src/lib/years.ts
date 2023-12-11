import { queryDatabase } from "./notion-utils";
import { QueryDatabaseParameters } from "@notionhq/client/build/src/api-endpoints";

export const getYears = async (options: Omit<QueryDatabaseParameters, "database_id">) => {
  const databaseId = process.env.NOTION_YEAR_DATABASE as string;

  return await queryDatabase(databaseId, options);
};
