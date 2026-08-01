"use client"

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@openmeerkat/ui/components/ui/sidebar"
import { type ReactNode, useEffect, useState } from "react"

type ManageLayoutProps = {
  children: ReactNode
  /** Edition-specific sidebar, chosen by the server layout. */
  sidebar: ReactNode
}

export function ManageLayout({ children, sidebar }: ManageLayoutProps) {
  const [open, setOpen] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem("manage_sidebar_state")
    const openState = stored === "1"
    setOpen(openState)
    localStorage.setItem("manage_sidebar_state", openState ? "1" : "0")
  }, [])

  return (
    <SidebarProvider
      onOpenChange={(value) => {
        setOpen(value)
        localStorage.setItem("manage_sidebar_state", value ? "1" : "0")
      }}
      open={open}
    >
      {sidebar}
      <SidebarInset>
        <SidebarTrigger className="absolute -inset-s-2 top-3 z-10 border" />
        <main className="p-4 pb-24 sm:px-6 sm:pt-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
