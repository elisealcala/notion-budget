import {
  PageObjectResponse,
  QueryDatabaseResponse,
} from '@notionhq/client/build/src/api-endpoints';

export type Properties =
  | 'Expenses'
  | 'Date'
  | 'Total Expenses'
  | 'Balance'
  | 'Available/Exceeded'
  | 'Total Incomes'
  | 'Incomes'
  | 'Dates'
  | 'Budget'
  | 'Budget Amount'
  | 'Name';

export interface Category extends PageObjectResponse {
  properties: Record<
    Properties,
    PageObjectResponse['properties'][keyof PageObjectResponse['properties']]
  >;
}

export interface QueryResponseCategory extends QueryDatabaseResponse {
  results: Category[];
}
