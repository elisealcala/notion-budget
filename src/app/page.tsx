"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Month, QueryResponseMonth } from "@/types/month";
import { formatCurrency } from "@/utils/currency";
import { useEffect, useState } from "react";

async function getMonths(): Promise<QueryResponseMonth> {
  const monthsResponse = await fetch(`${process.env.NEXT_PUBLIC_API}/months`);

  const months: QueryResponseMonth = await monthsResponse.json();

  return months;
}

async function getMonth(monthId: string): Promise<Month> {
  let url = `${process.env.NEXT_PUBLIC_API}/months/${monthId}`;

  const data = await fetch(url);

  const response = data.json();

  return response;
}

export default function Home() {
  const [months, setMonths] = useState<Month[]>([]);
  const [selectedMonthId, setSelectedMonthId] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<Month | undefined>(undefined);

  useEffect(() => {
    (async () => {
      const months = await getMonths();
      setMonths(months.results);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (selectedMonthId) {
        const month = await getMonth(selectedMonthId);
        setSelectedMonth(month);
      }
    })();
  }, [selectedMonthId]);

  return (
    <main>
      <div className="flex w-full justify-between items-center">
        <Select
          onValueChange={(e) => {
            setSelectedMonthId(e);
          }}
          value={selectedMonthId}
          defaultValue="Months"
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Months" />
          </SelectTrigger>
          <SelectContent>
            {months.map((month) => (
              <SelectItem key={month.id} value={month.id}>
                {month.properties.Name.title[0].plain_text}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Table className="mt-10">
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Account</TableHead>
            <TableHead>Category</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {selectedMonth?.properties["Movements"].relation.map((movement) => {
            switch (movement.type) {
              case "expense":
                return (
                  <TableRow key={movement.id}>
                    <TableCell>{movement.properties.Date.date?.start}</TableCell>
                    <TableCell>{movement.properties.Name.title[0].plain_text}</TableCell>
                    <TableCell>
                      - {formatCurrency(movement.properties.Amount.number ?? 0)}
                    </TableCell>
                    <TableCell>
                      {
                        movement.properties["Account Name"].rollup.array[0]?.title[0]
                          .plain_text
                      }
                    </TableCell>
                    <TableCell>
                      {
                        movement.properties["Category Name"].rollup.array[0]?.title[0]
                          .plain_text
                      }
                    </TableCell>
                  </TableRow>
                );

              case "income":
                return (
                  <TableRow key={movement.id}>
                    <TableCell>{movement.properties.Date.date?.start}</TableCell>
                    <TableCell>{movement.properties.Name.title[0].plain_text}</TableCell>
                    <TableCell>
                      {formatCurrency(movement.properties.Amount.number ?? 0)}
                    </TableCell>
                    <TableCell>
                      {
                        movement.properties["Account Name"].rollup.array[0]?.title[0]
                          .plain_text
                      }
                    </TableCell>
                    <TableCell>
                      {
                        movement.properties["Category Name"].rollup.array[0]?.title[0]
                          .plain_text
                      }
                    </TableCell>
                  </TableRow>
                );

              case "transfer":
                return (
                  <TableRow key={movement.id}>
                    <TableCell>{movement.properties.Date.date?.start}</TableCell>
                    <TableCell>{movement.properties.Name.title[0].plain_text}</TableCell>
                    <TableCell>
                      {formatCurrency(movement.properties.Amount.number ?? 0)}
                    </TableCell>
                    <TableCell>
                      {
                        movement.properties["From Account Name"].rollup.array[0]?.title[0]
                          .plain_text
                      }{" "}
                      →{" "}
                      {
                        movement.properties["To Account Name"].rollup.array[0]?.title[0]
                          .plain_text
                      }
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                );

              default:
                return null;
            }
          })}
        </TableBody>
      </Table>
    </main>
  );
}
