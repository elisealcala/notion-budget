import { Category } from "./category";
import {
  PageObjectResponse,
  QueryDatabaseResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { Account } from "./account";

export type Properties = "Amount" | "Category" | "Date" | "Account" | "Name";

export interface Income extends PageObjectResponse {
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
  type: "income";
}

export interface QueryResponseIncome extends QueryDatabaseResponse {
  results: Income[];
}
