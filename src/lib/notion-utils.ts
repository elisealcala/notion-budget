import notion from "./notion-client";
import { QueryDatabaseParameters } from "@notionhq/client/build/src/api-endpoints";

export const queryDatabase = async (
  databaseId: string,
  options: Omit<QueryDatabaseParameters, "database_id">
) => {
  return await notion.databases.query({
    database_id: databaseId,
    ...options,
  });
};
