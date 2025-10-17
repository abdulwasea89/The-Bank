"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { z } from "zod"

const createAccountSchema = z.object({
  account_name: z.string().min(1, "Account name is required").max(50, "Account name too long"),
  account_type: z.enum(["checking", "savings", "business"]),
  initial_balance: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, "Initial balance must be a positive number"),
})

interface CreateAccountModalProps {
  isOpen: boolean
  onClose: () => void
  onAccountCreated: () => void
}

export function CreateAccountModal({ isOpen, onClose, onAccountCreated }: CreateAccountModalProps) {
  const [formData, setFormData] = useState({
    account_name: "",
    account_type: "",
    initial_balance: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validation = createAccountSchema.safeParse(formData)
    if (!validation.success) {
      toast.error(validation.error.issues[0].message)
      return
    }

    setIsLoading(true)
    const token = localStorage.getItem('token')
    if (!token) {
      toast.error("Not authenticated")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/accounts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          account_name: formData.account_name,
          initial_deposit: parseFloat(formData.initial_balance),
        }),
      })

      if (response.ok) {
        toast.success('Account created successfully!')
        onAccountCreated()
        handleClose()
      } else {
        toast.error('Failed to create account')
      }
    } catch (error) {
      console.error('Error creating account:', error)
      toast.error('Failed to create account')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({ account_name: "", account_type: "", initial_balance: "" })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-bold text-center">
            Create Bank Account
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="account_name" className="text-sm font-medium">Account Name</Label>
            <Input
              id="account_name"
              value={formData.account_name}
              onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
              placeholder="e.g., Savings Account"
              className="h-11"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="account_type" className="text-sm font-medium">Account Type</Label>
            <Select value={formData.account_type} onValueChange={(value) => setFormData({ ...formData, account_type: value })}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="checking">Checking</SelectItem>
                <SelectItem value="savings">Savings</SelectItem>
                <SelectItem value="business">Business</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="initial_balance" className="text-sm font-medium">Initial Balance</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                id="initial_balance"
                type="number"
                step="0.01"
                min="0"
                value={formData.initial_balance}
                onChange={(e) => setFormData({ ...formData, initial_balance: e.target.value })}
                placeholder="0.00"
                className="h-11 pl-8"
                required
              />
            </div>
          </div>
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="h-11">
              Cancel
            </Button>
            <Button type="submit" className="h-11" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Account"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}