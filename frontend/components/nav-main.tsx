"use client"

import { useState } from "react"
import { IconCirclePlusFilled, type Icon } from "@tabler/icons-react"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { CreateAccountModal } from "@/components/create-account-modal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Account {
  id: number
  account_number: string
  account_name: string
  balance: number
}

export function NavMain({
  items,
  onCreateAccount,
  accounts = [],
  selectedAccount,
  onAccountChange,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
  onCreateAccount?: () => void
  accounts?: Account[]
  selectedAccount?: string
  onAccountChange?: (account: string) => void
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCreateAccount = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleAccountCreated = () => {
    setIsModalOpen(false)
    onCreateAccount?.()
  }

  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent className="flex flex-col gap-2">
          {accounts.length > 0 && (
            <SidebarMenu>
              <SidebarMenuItem>
                <Select value={selectedAccount} onValueChange={onAccountChange}>
                  <SelectTrigger className="w-full h-11 bg-primary text-white hover:bg-primary/90 hover:text-white focus:bg-primary/90 focus:text-white border-0 rounded-md">
                    <SelectValue placeholder="Select an account" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Accounts</SelectItem>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.account_number}>
                        {account.account_name} - {account.account_number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </SidebarMenuItem>
            </SidebarMenu>
          )}
          <SidebarMenu>
            <SidebarMenuItem className="flex items-center gap-2">
              <SidebarMenuButton
                tooltip="Quick Create"
                className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
                onClick={handleCreateAccount}
              >
                <IconCirclePlusFilled />
                <span>Create An Account</span>
              </SidebarMenuButton>


            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <CreateAccountModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAccountCreated={handleAccountCreated}
      />
    </>
  )
}
