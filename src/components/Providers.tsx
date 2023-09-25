'use client'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { SessionProvider } from "next-auth/react"
import { NextUIProvider } from "@nextui-org/react";

const Providers = ({ children }: { children: React.ReactNode }) => {
    const queryClient = new QueryClient()

    return <NextUIProvider><QueryClientProvider client={queryClient}><SessionProvider>{children}</SessionProvider></QueryClientProvider></NextUIProvider>
}

export default Providers