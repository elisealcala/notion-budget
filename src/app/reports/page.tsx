"use client";

import { QueryResponseReports } from "@/types/report";
import { useEffect, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const months = [
  {
    name: "July",
    date: new Date(2023, 6, 1).toISOString(),
  },
  {
    name: "August",
    date: new Date(2023, 7, 1).toISOString(),
  },
];

export default function Reports() {
  const [startDate, setStartDate] = useState(months[0].date);
  const [data, setData] = useState<QueryResponseReports | undefined>();

  useEffect(() => {});

  return (
    <main className="mt-5">
      <Select
        onValueChange={(e) => {
          setStartDate(e);
        }}
        defaultValue={months[0].date}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Months" />
        </SelectTrigger>
        <SelectContent>
          {months.map((month) => (
            <SelectItem key={month.name} value={month.date}>
              {month.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Table className="mt-10">
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Paid</TableHead>
            <TableHead>Account</TableHead>
            <TableHead>Category</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody></TableBody>
      </Table>
    </main>
  );
}
