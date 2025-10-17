"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Transaction {
  id: number
  amount: number
  description: string
  timestamp: string
  direction: string
  counterparty: string
}

interface DataTableProps {
  data: Transaction[]
  isLoading?: boolean
}

export function DataTable({ data, isLoading = false }: DataTableProps) {
  return (
    <div>
      <div className="overflow-hidden rounded-lg border shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-semibold">Date</TableHead>
              <TableHead className="font-semibold">Description</TableHead>
              <TableHead className="font-semibold text-right">Amount</TableHead>
              <TableHead className="font-semibold">Direction</TableHead>
              <TableHead className="font-semibold">Counterparty</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><div className="h-4 bg-muted rounded animate-pulse"></div></TableCell>
                  <TableCell><div className="h-4 bg-muted rounded animate-pulse"></div></TableCell>
                  <TableCell><div className="h-4 bg-muted rounded animate-pulse"></div></TableCell>
                  <TableCell><div className="h-4 bg-muted rounded animate-pulse"></div></TableCell>
                  <TableCell><div className="h-4 bg-muted rounded animate-pulse"></div></TableCell>
                </TableRow>
              ))
            ) : data.length ? (
              data.map((transaction) => (
                <TableRow key={transaction.id} className="hover:bg-muted/30">
                  <TableCell className="font-mono text-sm">
                    {new Date(transaction.timestamp).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="max-w-xs truncate" title={transaction.description}>
                    {transaction.description}
                  </TableCell>
                  <TableCell className={`text-right font-medium ${transaction.direction === 'incoming' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.direction === 'incoming' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      transaction.direction === 'incoming'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {transaction.direction === 'incoming' ? 'Received' : 'Sent'}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{transaction.counterparty}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No transactions found for the selected account.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
