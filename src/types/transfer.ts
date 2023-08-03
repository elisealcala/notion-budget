import {
  PageObjectResponse,
  QueryDatabaseResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { Account } from "./account";

export type Properties = "Date" | "Name" | "Amount" | "From Account" | "To Account";

export interface Transfer extends PageObjectResponse {
  properties: Record<
    Properties,
    PageObjectResponse["properties"][keyof PageObjectResponse["properties"]]
  >;
  fromAccount?: Account;
  toAccount?: Account;
}

export interface QueryResponseTransfer extends QueryDatabaseResponse {
  results: Transfer[];
}
