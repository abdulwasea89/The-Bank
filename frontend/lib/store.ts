import { create } from 'zustand'

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

interface BankingStore {
  accounts: Account[]
  transactions: Transaction[]
  setAccounts: (accounts: Account[]) => void
  setTransactions: (transactions: Transaction[]) => void
  addAccount: (account: Account) => void
  addTransaction: (transaction: Transaction) => void
}

export const useBankingStore = create<BankingStore>((set) => ({
  accounts: [],
  transactions: [],
  setAccounts: (accounts: Account[]) => set({ accounts }),
  setTransactions: (transactions: Transaction[]) => set({ transactions }),
  addAccount: (account: Account) => set((state) => ({ accounts: [...state.accounts, account] })),
  addTransaction: (transaction: Transaction) => set((state) => ({ transactions: [...state.transactions, transaction] })),
}))