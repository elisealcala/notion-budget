import AppDialog from "@/components/app/dialog"
import { isFullPage, Client, LogLevel } from "@notionhq/client";
import { NextResponse } from "next/server";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"




async function getData() {
  const notion = new Client({
    auth: process.env.NOTION_TOKEN,
    logLevel: LogLevel.DEBUG,
  })

  const fullOrPartialPages = await notion.databases.query({
    database_id: "98f68b650d544c6697e75b47e067c3cb",
  })
 
  return fullOrPartialPages
}

export default async function Home() {
  const data = await getData()

  console.log({ data })

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">INV001</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>Credit Card</TableCell>
            <TableCell className="text-right">$250.00</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      {/* <AppDialog /> */}
    </main>
  )
}
