import { NextRequest, NextResponse } from "next/server";
import { getYears } from "@/lib/years";
import { QueryDatabaseParameters } from "@notionhq/client/build/src/api-endpoints";

export async function GET(request: NextRequest) {
  // Opciones para la consulta
  let options: Omit<QueryDatabaseParameters, "database_id"> = {
    // tus opciones de filtro, ordenación, etc.
  };

  const response = await getYears(options);

  return NextResponse.json(response);
}
