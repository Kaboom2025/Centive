import type { Metadata } from "next"
import "./globals.css"
import { PlaidProvider } from "@/contexts/plaid-context"

export const metadata: Metadata = {
  title: "Round-up Donations",
  description: "Turn your spare change into charitable impact with automatic round-up donations",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <PlaidProvider>
          {children}
        </PlaidProvider>
      </body>
    </html>
  )
}