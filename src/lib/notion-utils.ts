import notion from "./notion-client";
import {
  PageObjectResponse,
  QueryDatabaseParameters,
} from "@notionhq/client/build/src/api-endpoints";

export const emptyPageObjectResponse: PageObjectResponse = {
  parent: {
    type: "workspace",
    workspace: true,
  },
  properties: {},
  icon: null,
  cover: null,
  created_by: {
    object: "user",
    id: "",
  },
  last_edited_by: {
    object: "user",
    id: "",
  },
  object: "page",
  id: "",
  created_time: "",
  last_edited_time: "",
  archived: false,
  url: "",
  public_url: null,
};

export const queryDatabase = async (
  databaseId: string,
  options: Omit<QueryDatabaseParameters, "database_id">
) => {
  return await notion.databases.query({
    database_id: databaseId,
    ...options,
  });
};

export const getPage = async (pageId: string, filterProperties?: string[]) => {
  return await notion.pages.retrieve({
    page_id: pageId,
    filter_properties: filterProperties,
  });
};
