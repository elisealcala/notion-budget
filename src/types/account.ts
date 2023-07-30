import { PageObjectResponse, QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";

export type Properties = "Balance" | "Incomes" | "Transfers Balance" | "Opening" | "From Transfer Total" | "To Transfer" | "From Transfer" | "Expenses" | "Total Incomes" | "To Transfer Total" | "Total Expenses" | "Name"

export interface Account extends PageObjectResponse {
  properties: Record<Properties, PageObjectResponse['properties'][keyof PageObjectResponse['properties']]>
}

export interface QueryResponseAccount extends QueryDatabaseResponse {
  results: Account[]
}