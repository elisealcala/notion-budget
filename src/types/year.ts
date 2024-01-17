import { MonthPage } from "@/app/api/years/route";
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
        id: string;
        type: "relation";
        relation: Array<{
          id: string;
          month: MonthPage;
        }>;
      }
    >;
}

export interface QueryResponseYear extends QueryDatabaseResponse {
  results: Year[];
}
