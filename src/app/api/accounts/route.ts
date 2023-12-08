import { Account, QueryResponseAccount, Properties } from "@/types/account";
import { isFullPage, Client, LogLevel } from "@notionhq/client";
import { QueryDatabaseParameters } from "@notionhq/client/build/src/api-endpoints";
import { NextRequest, NextResponse } from "next/server";

type Relation = {
  type: "relation";
  relation: Array<{
    id: string;
  }>;
  id: string;
};

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
  logLevel: LogLevel.DEBUG,
});

// export async function getPage(id: string) {
//   const response = await notion.pages.retrieve({
//     page_id: id,
//   });

//   return response;
// }

// export async function fillProperty(
//   account: Account,
//   property: Properties
// ): Promise<Account> {
//   return {
//     ...account,
//     properties: {
//       ...account.properties,
//       ...(account.properties[property].type === "relation"
//         ? {
//             [property]: {
//               ...account.properties[property],
//               relation: await Promise.all(
//                 (account.properties[property] as Relation).relation.map(
//                   async ({ id }) => {
//                     const response = await notion.pages.retrieve({
//                       page_id: id,
//                     });

//                     return response;
//                   }
//                 )
//               ),
//             },
//           }
//         : {}),
//     },
//   };
// }

export async function GET(request: NextRequest) {
  const startCursor = request.nextUrl.searchParams.get("start_cursor") ?? undefined;
  const dateAfter = request.nextUrl.searchParams.get("date_after") ?? undefined;
  const dateBefore = request.nextUrl.searchParams.get("date_before") ?? undefined;

  let response: QueryResponseAccount | undefined;

  let options: QueryDatabaseParameters = {
    database_id: "70129f242df34bf9822c71b75bfa72da",
    sorts: [
      {
        property: "Name",
        direction: "ascending",
      },
    ],
  };

  if (startCursor) {
    options = {
      ...options,
      start_cursor: startCursor,
    };
  }

  const fullOrPartialPages = await notion.databases.query(options);

  for (const page of fullOrPartialPages.results) {
    if (isFullPage(page)) {
      response = {
        ...fullOrPartialPages,
        results: fullOrPartialPages.results as Account[],
      };
    }
  }

  return NextResponse.json(response);
}
