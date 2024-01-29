import {
  PageObjectResponse,
  QueryDatabaseResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";

export type Properties = "Expenses" | "Savings" | "Months" | "Incomes";

export interface Year extends PageObjectResponse {
  properties: Record<
    "Name",
    {
      type: "title";
      title: Array<RichTextItemResponse>;
      id: string;
    }
  > &
    Record<
      "Savings",
      {
        id: string;
        type: "rollup";
        rollup: {
          type: "number";
          number: number | null;
          function: "sum";
        };
      }
    > &
    Record<
      "Incomes",
      {
        id: string;
        type: "rollup";
        rollup: {
          type: "number";
          number: number | null;
          function: "sum";
        };
      }
    > &
    Record<
      "Expenses",
      {
        id: string;
        type: "rollup";
        rollup: {
          type: "number";
          number: number | null;
          function: "sum";
        };
      }
    > &
    Record<
      "Months",
      {
        type: "relation";
        relation: Array<{
          id: string;
        }>;
        id: string;
      }
    > &
    Record<
      "Month Names",
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
}

export interface QueryResponseYear extends QueryDatabaseResponse {
  results: Year[];
}
