"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface BankAccount {
  id: string
  bankName: string
  accountType: string
  lastFour: string
  isConnected: boolean
  logo: string
}

interface Charity {
  id: string
  name: string
  logo: string
  mission: string
  category: string
  rating: number
  description: string
  impactMetrics: string[]
  financialInfo: string
}

interface Transaction {
  id: string
  date: string
  merchant: string
  amount: number
  roundUp: number
  category: string
}

interface Donation {
  id: string
  date: string
  amount: number
  charity: string
  status: "pending" | "completed"
  receiptUrl?: string
}

interface UserPreferences {
  threshold: number
  multiplier: number
  notifications: {
    transactions: boolean
    donations: boolean
    monthlyReports: boolean
    method: "email" | "app" | "both"
  }
}

interface AppContextType {
  bankAccounts: BankAccount[]
  selectedCharity: Charity | null
  transactions: Transaction[]
  donations: Donation[]
  preferences: UserPreferences
  stats: {
    totalDonated: number
    currentAccumulation: number
    impactStats: string[]
  }
  connectBank: (accountData: Partial<BankAccount>) => Promise<void>
  disconnectBank: (accountId: string) => void
  selectCharity: (charity: Charity) => void
  updatePreferences: (preferences: Partial<UserPreferences>) => void
  searchCharities: (query: string, filters?: any) => Promise<Charity[]>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([])
  const [selectedCharity, setSelectedCharity] = useState<Charity | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [donations, setDonations] = useState<Donation[]>([])
  const [preferences, setPreferences] = useState<UserPreferences>({
    threshold: 10,
    multiplier: 1,
    notifications: {
      transactions: true,
      donations: true,
      monthlyReports: true,
      method: "both",
    },
  })

  const [stats, setStats] = useState({
    totalDonated: 247.83,
    currentAccumulation: 8.42,
    impactStats: ["12 meals provided", "3 trees planted", "5 children educated for a day"],
  })

  useEffect(() => {
    // Load mock data
    loadMockData()
  }, [])

  const loadMockData = () => {
    // Mock bank accounts
    setBankAccounts([
      {
        id: "1",
        bankName: "Chase Bank",
        accountType: "Checking",
        lastFour: "1234",
        isConnected: true,
        logo: "/placeholder.svg?height=40&width=40",
      },
    ])

    // Mock selected charity
    setSelectedCharity({
      id: "1",
      name: "World Wildlife Fund",
      logo: "/placeholder.svg?height=60&width=60",
      mission: "Protecting wildlife and their habitats",
      category: "Environment",
      rating: 4.8,
      description:
        "WWF works to conserve nature and reduce the most pressing threats to the diversity of life on Earth.",
      impactMetrics: ["Protected 2.3M acres of habitat", "Saved 15 endangered species"],
      financialInfo: "87% of donations go directly to programs",
    })

    // Mock transactions
    setTransactions([
      {
        id: "1",
        date: "2024-01-15",
        merchant: "Starbucks",
        amount: 4.37,
        roundUp: 0.63,
        category: "Food & Drink",
      },
      {
        id: "2",
        date: "2024-01-14",
        merchant: "Amazon",
        amount: 23.45,
        roundUp: 0.55,
        category: "Shopping",
      },
      {
        id: "3",
        date: "2024-01-13",
        merchant: "Shell Gas Station",
        amount: 45.67,
        roundUp: 0.33,
        category: "Transportation",
      },
    ])

    // Mock donations
    setDonations([
      {
        id: "1",
        date: "2024-01-10",
        amount: 15.5,
        charity: "World Wildlife Fund",
        status: "completed",
        receiptUrl: "#",
      },
      {
        id: "2",
        date: "2024-01-01",
        amount: 12.25,
        charity: "World Wildlife Fund",
        status: "completed",
        receiptUrl: "#",
      },
    ])
  }

  const connectBank = async (accountData: Partial<BankAccount>) => {
    // Simulate Plaid connection
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const newAccount: BankAccount = {
      id: Date.now().toString(),
      bankName: accountData.bankName || "Unknown Bank",
      accountType: accountData.accountType || "Checking",
      lastFour: accountData.lastFour || "0000",
      isConnected: true,
      logo: "/placeholder.svg?height=40&width=40",
    }

    setBankAccounts((prev) => [...prev, newAccount])
  }

  const disconnectBank = (accountId: string) => {
    setBankAccounts((prev) => prev.filter((account) => account.id !== accountId))
  }

  const selectCharity = (charity: Charity) => {
    setSelectedCharity(charity)
  }

  const updatePreferences = (newPreferences: Partial<UserPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...newPreferences }))
  }

  const searchCharities = async (query: string, filters?: any): Promise<Charity[]> => {
    // Mock charity search
    await new Promise((resolve) => setTimeout(resolve, 500))

    const mockCharities: Charity[] = [
      {
        id: "1",
        name: "World Wildlife Fund",
        logo: "/placeholder.svg?height=60&width=60",
        mission: "Protecting wildlife and their habitats",
        category: "Environment",
        rating: 4.8,
        description: "WWF works to conserve nature and reduce threats to wildlife.",
        impactMetrics: ["Protected 2.3M acres", "Saved 15 species"],
        financialInfo: "87% goes to programs",
      },
      {
        id: "2",
        name: "Doctors Without Borders",
        logo: "/placeholder.svg?height=60&width=60",
        mission: "Providing medical aid where needed most",
        category: "Health",
        rating: 4.9,
        description: "Medical humanitarian organization providing aid in crisis zones.",
        impactMetrics: ["Treated 1.2M patients", "Operated in 70 countries"],
        financialInfo: "82% goes to programs",
      },
      {
        id: "3",
        name: "Feeding America",
        logo: "/placeholder.svg?height=60&width=60",
        mission: "Fighting hunger in America",
        category: "Hunger",
        rating: 4.7,
        description: "The largest hunger-relief organization in the United States.",
        impactMetrics: ["6.6B meals provided", "200 food banks supported"],
        financialInfo: "85% goes to programs",
      },
    ]

    return mockCharities.filter(
      (charity) =>
        charity.name.toLowerCase().includes(query.toLowerCase()) ||
        charity.category.toLowerCase().includes(query.toLowerCase()),
    )
  }

  return (
    <AppContext.Provider
      value={{
        bankAccounts,
        selectedCharity,
        transactions,
        donations,
        preferences,
        stats,
        connectBank,
        disconnectBank,
        selectCharity,
        updatePreferences,
        searchCharities,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
