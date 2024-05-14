import {
  PageObjectResponse,
  QueryDatabaseResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { Expense } from "./expense";
import { Income } from "./income";
import { Transfer } from "./transfer";

export type Properties = "Expenses" | "Savings" | "Months" | "Incomes";

export type Movement = Expense | Transfer | Income;

export interface Month extends PageObjectResponse {
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
        type: "formula";
        formula: {
          type: "number";
          number: number | null;
        };
        id: string;
      }
    > &
    Record<
      "Expenses Relation",
      {
        type: "relation";
        id: string;
        relation: Expense[];
        has_more: boolean;
      }
    > &
    Record<
      "Expenses Rollup",
      {
        type: "rollup";
        id: string;
        rollup: {
          type: "number";
          number: number | null;
          function: "sum";
        };
      }
    > &
    Record<
      "Incomes Relation",
      {
        type: "relation";
        id: string;
        relation: Income[];
        has_more: boolean;
      }
    > &
    Record<
      "Incomes Rollup",
      {
        type: "rollup";
        id: string;
        rollup: {
          type: "number";
          number: number | null;
          function: "sum";
        };
      }
    > &
    Record<
      "Transfers Relation",
      {
        type: "relation";
        id: string;
        relation: Transfer[];
        has_more: boolean;
      }
    > &
    Record<
      "Movements",
      {
        type: "relation";
        id: string;
        relation: Movement[];
      }
    >;
}

export interface QueryResponseMonth extends QueryDatabaseResponse {
  results: Month[];
}
