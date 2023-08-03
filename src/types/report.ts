import {
  PageObjectResponse,
  QueryDatabaseResponse,
} from "@notionhq/client/build/src/api-endpoints";

export type Properties = "Tags" | "Expenses" | "Incomes" | "Date" | "Savings" | "Name";

export interface Report extends PageObjectResponse {
  properties: Record<
    Properties,
    PageObjectResponse["properties"][keyof PageObjectResponse["properties"]]
  >;
}

export interface QueryResponseReports extends QueryDatabaseResponse {
  results: Report[];
}
