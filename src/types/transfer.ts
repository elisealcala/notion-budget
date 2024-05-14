import {
  PageObjectResponse,
  QueryDatabaseResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { Account } from "./account";

export type Properties = "Date" | "Name" | "Amount" | "From Account" | "To Account";

export interface Transfer extends PageObjectResponse {
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
      "From Account Name",
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
      "To Account Name",
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
  type: "transfer";
}

export interface QueryResponseTransfer extends QueryDatabaseResponse {
  results: Transfer[];
}
