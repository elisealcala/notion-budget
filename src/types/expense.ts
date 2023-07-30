import { PageObjectResponse, QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";
import { Account } from "./account";

export type Properties = "Amount" | "Category" | "Paid" | "Date" | "Account" | "Name"

export interface Expense extends PageObjectResponse {
  properties: Record<Properties, PageObjectResponse['properties'][keyof PageObjectResponse['properties']]>
  account: Account
}

export interface QueryResponseExpense extends QueryDatabaseResponse {
  results: Expense[]
}