import { Category } from "./category";
import {
  PageObjectResponse,
  QueryDatabaseResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { Account } from "./account";

export type Properties = "Amount" | "Category" | "Paid" | "Date" | "Account" | "Name";

export interface Expense extends PageObjectResponse {
  in_trash: boolean;
  properties: Record<
    "Date",
    {
      type: "date";
      date: {
        start: string;
        end: string | null;
        time_zone: "UTC";
      } | null;
      id: string;
    }
  > &
    Record<
      "Name",
      {
        type: "title";
        title: Array<RichTextItemResponse>;
        id: string;
      }
    > &
    Record<
      "Amount",
      {
        type: "number";
        number: number | null;
        id: string;
      }
    > &
    Record<
      "Paid",
      {
        type: "status";
        status: {
          id: string;
          name: string;
          color: "default";
        } | null;
        id: string;
      }
    > &
    Record<
      "Account Name",
      {
        type: "rollup";
        id: string;
        rollup: {
          type: "array";
          array: Array<{
            type: "title";
            title: Array<RichTextItemResponse>;
            id: string;
          }>;
          function: "show_original";
        };
      }
    > &
    Record<
      "Category Name",
      {
        type: "rollup";
        id: string;
        rollup: {
          type: "array";
          array: Array<{
            type: "title";
            title: Array<RichTextItemResponse>;
            id: string;
          }>;
          function: "show_original";
        };
      }
    >;
  type: "expense";
}

export interface QueryResponseExpense extends QueryDatabaseResponse {
  results: Expense[];
}
