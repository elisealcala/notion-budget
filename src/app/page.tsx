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
import { Category, QueryResponseCategory } from "@/types/category";

async function getMonths(): Promise<QueryResponseMonth> {
  const monthsResponse = await fetch(`${process.env.NEXT_PUBLIC_API}/months`);

  const months: QueryResponseMonth = await monthsResponse.json();

  return months;
}

async function getCategories(): Promise<QueryResponseCategory> {
  const categoriesResponse = await fetch(`${process.env.NEXT_PUBLIC_API}/categories`);

  const categories: QueryResponseCategory = await categoriesResponse.json();

  return categories;
}

async function getMonth(monthId: string, categoryId?: string): Promise<Month> {
  let url = `${process.env.NEXT_PUBLIC_API}/months/${monthId}`;

  if (categoryId) {
    url = url + `?category_id=${categoryId}`;
  }

  const data = await fetch(url);

  const response = data.json();

  return response;
}

export default function Home() {
  const [months, setMonths] = useState<Month[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedMonthId, setSelectedMonthId] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<Month | undefined>(undefined);
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(
    undefined
  );

  const totalExpenses =
    selectedMonth?.properties["Movements"].relation.reduce((a, b) => {
      if (b.type === "expense") {
        return a + (b.properties.Amount.number || 0);
      }
      return a;
    }, 0) || 0;

  const totalIncomes =
    selectedMonth?.properties["Movements"].relation.reduce((a, b) => {
      if (b.type === "income") {
        return a + (b.properties.Amount.number || 0);
      }
      return a;
    }, 0) || 0;

  useEffect(() => {
    (async () => {
      const months = await getMonths();
      setMonths(months.results);
      const categories = await getCategories();
      setCategories(categories.results);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (selectedMonthId) {
        const month = await getMonth(selectedMonthId, selectedCategory?.id);
        setSelectedMonth(month);
      }
    })();
  }, [selectedMonthId, selectedCategory]);

  console.log({ totalExpenses, totalIncomes });

  return (
    <main>
      <div className="grid grid-cols-2 w-full items-center">
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
        <Select
          onValueChange={(e) => {
            setSelectedCategory(categories.find((category) => category.id === e));
          }}
          value={selectedCategory?.id}
          defaultValue="Months"
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Months" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.properties.Name.title[0].plain_text}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-5 flex flex-col">
        <span className="text-sm"> Total Expenses = {totalExpenses}</span>
        <span className="text-sm"> Total Incomes = {totalIncomes}</span>
        <span className="text-sm"> Total = {totalIncomes - totalExpenses}</span>
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
