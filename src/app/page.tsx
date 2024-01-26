import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Month } from "@/types/month";
import { QueryResponseYear } from "@/types/year";
import { formatCurrency } from "@/utils/currency";

async function getMonth(): Promise<Month> {
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
          {month.properties["Movements"].relation.map((movement) => {
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
