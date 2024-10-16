import {
  PageObjectResponse,
  QueryDatabaseResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";

export type Properties =
  | "Expenses"
  | "Date"
  | "Total Expenses"
  | "Balance"
  | "Available/Exceeded"
  | "Total Incomes"
  | "Incomes"
  | "Dates"
  | "Budget"
  | "Budget Amount"
  | "Name";

export interface Category extends PageObjectResponse {
  properties: Record<
    "Name",
    {
      type: "title";
      title: Array<RichTextItemResponse>;
      id: string;
    }
  >;
}

export interface QueryResponseCategory extends QueryDatabaseResponse {
  results: Category[];
}
