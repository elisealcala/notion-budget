import {
  PageObjectResponse,
  QueryDatabaseResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";

export type Properties =
  | "Balance"
  | "Incomes"
  | "Transfers Balance"
  | "Opening"
  | "From Transfer Total"
  | "To Transfer"
  | "From Transfer"
  | "Expenses"
  | "Total Incomes"
  | "To Transfer Total"
  | "Total Expenses"
  | "Name";

export interface Account extends PageObjectResponse {
  properties: Record<
    Properties,
    PageObjectResponse["properties"][keyof PageObjectResponse["properties"]]
  > &
    Record<
      "Name",
      {
        type: "title";
        title: Array<RichTextItemResponse>;
        id: string;
      }
    >;
}

export interface QueryResponseAccount extends QueryDatabaseResponse {
  results: Account[];
}
