"use client"

import { usePlaid } from "@/contexts/plaid-context"
import { Dashboard } from "@/components/dashboard/dashboard"
import { LandingPage } from "@/components/landing/landing-page"

export default function HomePage() {
  const { linkSuccess } = usePlaid()

  if (linkSuccess) {
    return <Dashboard />
  }

  return <LandingPage />
}