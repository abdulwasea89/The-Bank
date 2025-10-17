"use client"

import { useState, useEffect, useCallback } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { TransferModal } from "@/components/transfer-modal"
import { AuthModal } from "@/components/auth-modal"
import { CreateAccountModal } from "@/components/create-account-modal"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { useAuth } from "@/components/providers/auth-provider"
import { toast } from "sonner"

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

export default function Page() {
  const { user, isLoading: authLoading } = useAuth()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false)
  const [isCreateAccountModalOpen, setIsCreateAccountModalOpen] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<string>("all")
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true)
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false)

  useEffect(() => {
    if (user) {
      fetchAccounts()
    }
  }, [user])

  const fetchAccounts = async () => {
    const token = localStorage.getItem('token')
    if (!token) return
    setIsLoadingAccounts(true)
    try {
      const response = await fetch('/api/accounts', {
        headers: { 'Authorization': `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setAccounts(data)
      } else {
        toast.error('Failed to load accounts')
      }
    } catch (error) {
      console.error('Failed to fetch accounts:', error)
      toast.error('Failed to load accounts')
    } finally {
      setIsLoadingAccounts(false)
    }
  }

  const fetchTransactions = useCallback(async () => {
    if (selectedAccount === "all") {
      // For all accounts, fetch transactions for all accounts or leave empty
      setTransactions([])
      return
    }
    const token = localStorage.getItem('token')
    if (!token) return
    setIsLoadingTransactions(true)
    try {
      const response = await fetch(`/api/accounts/transactions?account_number=${selectedAccount}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setTransactions(data)
      } else {
        toast.error('Failed to load transactions')
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error)
      toast.error('Failed to load transactions')
    } finally {
      setIsLoadingTransactions(false)
    }
  }, [selectedAccount])

  useEffect(() => {
    if (user) {
      fetchTransactions()
    }
  }, [fetchTransactions, user])

  const handleTransfer = async (transferData: {
    fromAccount: string
    toAccount: string
    amount: number
    description: string
  }) => {
    console.log('Initiating transfer:', transferData)
    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Not authenticated')
      return
    }

    const fromAccount = accounts.find(acc => acc.account_number === transferData.fromAccount)

    if (!fromAccount) {
      toast.error('Invalid from account')
      return
    }

    try {
      console.log('Sending transfer request to /api/accounts/transfer')
      const response = await fetch('/api/accounts/transfer', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from_account_number: transferData.fromAccount,
          to_account_number: transferData.toAccount,
          amount: transferData.amount.toFixed(2), // Send as string
          description: transferData.description,
          idempotency_key: `transfer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        }),
      })
      if (response.ok) {
        toast.success('Transfer completed successfully!')
        fetchAccounts()
        fetchTransactions()
        setIsTransferModalOpen(false)
      } else {
        const errorData = await response.json().catch(() => ({}))
        toast.error(`Transfer failed: ${errorData.detail || 'Please check your details.'}`)
      }
    } catch (error) {
      console.error('Transfer error:', error)
      toast.error('Transfer failed. Please try again.')
    }
  }

  if (!user && !authLoading) {
    return <AuthModal isOpen={true} onClose={() => {}} />
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" onCreateAccount={fetchAccounts} accounts={accounts} selectedAccount={selectedAccount} onAccountChange={setSelectedAccount} />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-4 lg:px-6">
                 <h1 className="text-2xl font-bold">Dashboard</h1>
                 <div className="flex gap-2">
                   <Button onClick={() => setIsTransferModalOpen(true)} className="h-11">
                     Transfer Money
                   </Button>
                 </div>
               </div>
                <SectionCards accounts={accounts} transactions={transactions} isLoading={isLoadingAccounts} selectedAccount={selectedAccount} />
               <div className="px-4 lg:px-6">
                 <ChartAreaInteractive transactions={transactions} />
               </div>
               <div className="px-4 lg:px-6">
                  <DataTable data={transactions} isLoading={isLoadingTransactions} />
               </div>
            </div>
          </div>
        </div>
      </SidebarInset>
      <TransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        accounts={accounts}
        onTransfer={handleTransfer}
      />
      <CreateAccountModal
        isOpen={isCreateAccountModalOpen}
        onClose={() => setIsCreateAccountModalOpen(false)}
        onAccountCreated={fetchAccounts}
      />
    </SidebarProvider>
  )
}
