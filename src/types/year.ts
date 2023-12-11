import {
  PageObjectResponse,
  QueryDatabaseResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";

export type Properties = "Expenses" | "Savings" | "Months" | "Incomes";

export interface Year extends PageObjectResponse {
  properties: Record<
    Properties,
    PageObjectResponse["properties"][keyof PageObjectResponse["properties"]]
  > &
    Record<
      "Name",
      {
        type: "title";
        title: Array<RichTextItemResponse>;
        id: string;
      }
    >;
}

export interface QueryResponseYear extends QueryDatabaseResponse {
  results: Year[];
}
