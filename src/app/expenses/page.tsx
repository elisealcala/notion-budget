import AppDialog from '@/components/app/dialog';
import { isFullPage, Client, LogLevel } from '@notionhq/client';
import { NextResponse } from 'next/server';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Expense, QueryResponseExpense } from '@/types/expense';

async function getData() {
  const notion = new Client({
    auth: process.env.NOTION_TOKEN,
    logLevel: LogLevel.DEBUG,
  });

  let response;

  const fullOrPartialPages = await notion.databases.query({
    database_id: '98f68b650d544c6697e75b47e067c3cb',
  });

  const accounts = await notion.databases.query({
    database_id: '70129f242df34bf9822c71b75bfa72da',
  });

  for (const page of fullOrPartialPages.results) {
    if (isFullPage(page)) {
      response = {
        ...fullOrPartialPages,
        results: fullOrPartialPages.results as Expense[],
      };
    }
  }

  return response;
}

export default async function Home() {
  const data = await getData();

  if (!data) {
    return <span>loading</span>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
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
        <TableBody>
          {data.results.map((item: Expense) => (
            <TableRow key={item.id}>
              <TableCell>
                {item.properties['Date'].type === 'date'
                  ? item.properties['Date'].date?.start
                  : ''}
              </TableCell>
              <TableCell>
                {item.properties['Name'].type === 'title'
                  ? item.properties['Name'].title[0].plain_text
                  : ''}
              </TableCell>
              <TableCell>
                {item.properties['Amount'].type === 'number'
                  ? item.properties['Amount'].number?.toFixed(2)
                  : ''}
              </TableCell>
              <TableCell>
                {item.properties['Paid'].type === 'status'
                  ? item.properties['Paid'].status?.name
                  : ''}
              </TableCell>
              <TableCell>
                {item.properties['Account'].type === 'relation'
                  ? item.properties['Account'].relation[0].id
                  : ''}
              </TableCell>
              <TableCell>
                {item.properties['Category'].type === 'relation'
                  ? item.properties['Category'].relation[0].id
                  : ''}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* <AppDialog /> */}
    </main>
  );
}
