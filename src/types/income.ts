import { Category } from "./category";
import {
  PageObjectResponse,
  QueryDatabaseResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { Account } from "./account";

export type Properties = "Amount" | "Category" | "Date" | "Account" | "Name";

export interface Income extends PageObjectResponse {
  properties: Record<
    Properties,
    PageObjectResponse["properties"][keyof PageObjectResponse["properties"]]
  >;
  account?: Account;
  category?: Category;
}

export interface QueryResponseIncome extends QueryDatabaseResponse {
  results: Income[];
}
