"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Expense, QueryResponseExpense } from "@/types/expense";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/currency";

export default function Home() {
  const [data, setData] = useState<QueryResponseExpense | undefined>();

  const getFirstItems = useCallback(async () => {
    let url = `${process.env.NEXT_PUBLIC_API}/expenses`;

    const data = await fetch(url);

    const response: QueryResponseExpense = await data.json();

    setData(response);
  }, []);

  const handleData = useCallback(async (startCursor?: string | null) => {
    let url = `${process.env.NEXT_PUBLIC_API}/expenses`;

    if (startCursor) {
      url = url += `?start_cursor=${startCursor}`;
    }

    const data = await fetch(url);

    const response: QueryResponseExpense = await data.json();

    setData((previousData) => ({
      ...response,
      results: [...(previousData?.results ?? []), ...response.results],
    }));
  }, []);

  useEffect(() => {
    getFirstItems();
  }, [getFirstItems]);

  if (!data) {
    return <span>loading</span>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Account</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Paid</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.results.map((item: Expense) => (
            <TableRow key={item.id}>
              <TableCell>{item.properties["Date"].date?.start}</TableCell>
              <TableCell>{item.properties["Name"].title[0].plain_text}</TableCell>
              <TableCell>{formatCurrency(item.properties.Amount.number ?? 0)}</TableCell>
              <TableCell>
                {item.properties["Account Name"].rollup.array[0]?.title[0].plain_text}
              </TableCell>
              <TableCell>
                {item.properties["Category Name"].rollup.array[0]?.title[0].plain_text}
              </TableCell>
              <TableCell>{item.properties["Paid"]?.status?.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {data.next_cursor && (
        <Button onClick={() => handleData(data.next_cursor)}>Load more</Button>
      )}
    </main>
  );
}
