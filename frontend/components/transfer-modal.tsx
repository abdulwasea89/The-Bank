"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { z } from "zod"
import { toast } from "sonner"

interface Account {
  id: number
  account_number: string
  account_name: string
  balance: number
}

const transferSchema = z.object({
  fromAccount: z.string().min(1, "Please select a from account"),
  toAccount: z.string().min(1, "Please enter a recipient account"),
  amount: z.number().positive("Amount must be positive"),
  description: z.string().min(1, "Please provide a description"),
})

interface TransferModalProps {
  isOpen: boolean
  onClose: () => void
  accounts: Account[]
  onTransfer: (data: { fromAccount: string; toAccount: string; amount: number; description: string }) => void
}

export function TransferModal({ isOpen, onClose, accounts, onTransfer }: TransferModalProps) {
  const [formData, setFormData] = useState({
    fromAccount: "",
    toAccount: "",
    amount: "",
    description: "",
  })
  const [step, setStep] = useState<'form' | 'confirm'>('form')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      transferSchema.parse({
        ...formData,
        amount: parseFloat(formData.amount),
      })
      console.log('Validation passed, setting step to confirm')
      setStep('confirm')
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log('Validation failed:', error.issues[0].message)
        toast.error(error.issues[0].message)
      }
    }
  }

  const handleConfirm = () => {
    console.log('Confirming transfer:', {
      fromAccount: formData.fromAccount,
      toAccount: formData.toAccount,
      amount: parseFloat(formData.amount),
      description: formData.description,
    })
    onTransfer({
      fromAccount: formData.fromAccount,
      toAccount: formData.toAccount,
      amount: parseFloat(formData.amount),
      description: formData.description,
    })
    setStep('form')
    setFormData({ fromAccount: "", toAccount: "", amount: "", description: "" })
  }

  const handleClose = () => {
    setStep('form')
    setFormData({ fromAccount: "", toAccount: "", amount: "", description: "" })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-bold text-center flex items-center justify-center gap-2">
            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            {step === 'form' ? 'Transfer Money' : 'Confirm Transfer'}
          </DialogTitle>
        </DialogHeader>
        {step === 'form' ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fromAccount" className="text-sm font-medium flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                From Account
              </Label>
              <Select value={formData.fromAccount} onValueChange={(value) => setFormData({ ...formData, fromAccount: value })}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select your account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.account_number} className="py-3">
                      <div className="flex flex-col">
                        <span className="font-medium">{account.account_name}</span>
                        <span className="text-sm text-muted-foreground">
                          {account.account_number} • Balance: ${Number(account.balance).toFixed(2)}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="toAccount" className="text-sm font-medium flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                To Account Number
              </Label>
              <Input
                id="toAccount"
                value={formData.toAccount}
                onChange={(e) => setFormData({ ...formData, toAccount: e.target.value })}
                placeholder="Enter recipient account number"
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-medium flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                Amount
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  className="h-12 pl-8"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="What's this transfer for?"
                className="min-h-[80px] resize-none"
              />
            </div>
            <DialogFooter className="pt-4 gap-2">
              <Button type="button" variant="outline" onClick={handleClose} className="h-12 flex-1">
                Cancel
              </Button>
              <Button type="submit" className="h-12 flex-1">Review Transfer</Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm text-muted-foreground mb-4">Please review the transfer details below</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    From Account
                  </span>
                  <span className="text-sm font-mono">{formData.fromAccount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    To Account
                  </span>
                  <span className="text-sm font-mono">{formData.toAccount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    Amount
                  </span>
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">${parseFloat(formData.amount).toFixed(2)}</span>
                </div>
                <div className="pt-4 border-t">
                  <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Description
                  </span>
                  <p className="text-sm mt-2">{formData.description}</p>
                </div>
              </div>
            </div>
            <DialogFooter className="pt-4 gap-2">
              <Button type="button" variant="outline" onClick={() => setStep('form')} className="h-12 flex-1">
                Back
              </Button>
              <Button onClick={handleConfirm} className="h-12 flex-1">
                Confirm Transfer
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}