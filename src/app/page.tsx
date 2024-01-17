import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getPage } from "@/lib/notion-utils";
import { Expense } from "@/types/expense";
import { Month } from "@/types/month";
import { QueryResponseYear } from "@/types/year";
import { formatCurrency } from "@/utils/currency";
import { getCurrentYearAndMonth } from "@/utils/date";

async function getMonth(): Promise<Month> {
  const { year } = getCurrentYearAndMonth();

  let yearUrl = `${process.env.NEXT_PUBLIC_API}/years`;

  const yearResponse = await fetch(yearUrl);

  const years: QueryResponseYear = await yearResponse.json();

  const month = years.results[0].properties.Months.relation[0];

  let url = `${process.env.NEXT_PUBLIC_API}/months?id=${month.id}`;

  const data = await fetch(url);

  const response = data.json();

  return response;
}

export default async function Home() {
  const month = await getMonth();

  return (
    <main>
      <h2 className="text-xl font-bold">{month.properties.Name.title[0].plain_text}</h2>
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
          {month.properties["Expenses Relation"].relation.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell>{expense.properties.Date.date?.start}</TableCell>
              <TableCell>{expense.properties.Name.title[0].plain_text}</TableCell>
              <TableCell>{expense.properties.Amount.number}</TableCell>
              <TableCell>{expense.properties.Amount.number}</TableCell>
              <TableCell>{expense.properties.Amount.number}</TableCell>
            </TableRow>
          ))}
          {month.properties["Incomes Relation"].relation.map((income) => (
            <TableRow key={income.id}>
              <TableCell>{income.properties.Date.date?.start}</TableCell>
              <TableCell>{income.properties.Name.title[0].plain_text}</TableCell>
              <TableCell>{income.properties.Amount.number}</TableCell>
              <TableCell>{income.properties.Amount.number}</TableCell>
              <TableCell>{income.properties.Amount.number}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  );
}
