import { IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface Account {
  id: number
  account_number: string
  account_name: string
  balance: number
}

interface Transaction {
  id: number
  amount: number
  description: string
  timestamp: string
  direction: string
  counterparty: string
}

interface SectionCardsProps {
  accounts?: Account[]
  transactions?: Transaction[]
  isLoading?: boolean
  selectedAccount?: string
}

export function SectionCards({ accounts = [], transactions = [], isLoading = false, selectedAccount }: SectionCardsProps) {
  const filteredAccounts = selectedAccount && selectedAccount !== "all"
    ? accounts.filter(acc => acc.account_number === selectedAccount)
    : accounts

  const totalBalance = filteredAccounts.reduce((sum, account) => sum + Number(account.balance), 0)

  // Calculate recent transactions (last 7 days)
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const recentTransactions = transactions.filter(tx => new Date(tx.timestamp) >= sevenDaysAgo).length

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 px-4 lg:px-6 @xl:grid-cols-2 @5xl:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="@container/card">
            <CardHeader>
              <div className="h-4 bg-muted rounded animate-pulse"></div>
              <div className="h-8 bg-muted rounded animate-pulse"></div>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5">
              <div className="h-4 bg-muted rounded animate-pulse"></div>
              <div className="h-3 bg-muted rounded animate-pulse"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 px-4 lg:px-6 @xl:grid-cols-2 @5xl:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Balance</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            ${totalBalance.toFixed(2)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +2.1%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {selectedAccount && selectedAccount !== "all" ? "Selected account balance" : "Balance across all accounts"} <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            {selectedAccount && selectedAccount !== "all" ? "Balance of selected account" : "Combined account balance"}
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Number of Accounts</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {selectedAccount && selectedAccount !== "all" ? 1 : accounts.length}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +1
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {selectedAccount && selectedAccount !== "all" ? "Selected account" : "Active accounts"} <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            {selectedAccount && selectedAccount !== "all" ? "Currently selected account" : "Accounts you can manage"}
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
         <CardHeader>
           <CardDescription>Recent Transactions</CardDescription>
           <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
             {recentTransactions}
           </CardTitle>
           <CardAction>
             <Badge variant="outline">
               <IconTrendingUp />
               +{Math.floor(recentTransactions * 0.2)}
             </Badge>
           </CardAction>
         </CardHeader>
         <CardFooter className="flex-col items-start gap-1.5 text-sm">
           <div className="line-clamp-1 flex gap-2 font-medium">
             Transactions this week <IconTrendingUp className="size-4" />
           </div>
           <div className="text-muted-foreground">Activity summary</div>
         </CardFooter>
       </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Average Balance</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            ${filteredAccounts.length > 0 ? (totalBalance / filteredAccounts.length).toFixed(2) : '0.00'}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +5.2%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {selectedAccount && selectedAccount !== "all" ? "Account balance" : "Per account average"} <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">{selectedAccount && selectedAccount !== "all" ? "Balance of selected account" : "Balance distribution"}</div>
        </CardFooter>
      </Card>
    </div>
  )
}
