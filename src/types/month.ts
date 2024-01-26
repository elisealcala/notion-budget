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
        type: "title";
        title: Array<RichTextItemResponse>;
        id: string;
      }
    > &
    Record<
      "Expenses Relation",
      {
        type: "relation";
        id: string;
        relation: Expense[];
      }
    > &
    Record<
      "Incomes Relation",
      {
        type: "relation";
        id: string;
        relation: Income[];
      }
    > &
    Record<
      "Transfers Relation",
      {
        type: "relation";
        id: string;
        relation: Transfer[];
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
