"use client"

import { useEffect, useState, useCallback } from "react"
import { usePlaid } from "@/contexts/plaid-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp, Heart, CreditCard, ArrowRight, Coins, Target, LogOut } from "lucide-react"

interface Transaction {
  id: string
  date: string
  merchant: string
  amount: number
  roundUp: number
  category: string
}

export function Dashboard() {
  const { dispatch, accessToken } = usePlaid()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  const stats = {
    totalDonated: 247.83,
    currentAccumulation: 8.42,
    impactStats: ["12 meals provided", "3 trees planted", "5 children educated for a day"],
  }

  const preferences = {
    threshold: 10,
  }

  const selectedCharity = {
    name: "World Wildlife Fund",
    logo: "/placeholder.svg",
    mission: "Protecting wildlife and their habitats",
  }

  const progressPercentage = (stats.currentAccumulation / preferences.threshold) * 100

  const fetchTransactions = useCallback(async () => {
    // Only fetch if we have an access token
    if (!accessToken) {
      console.log("No access token available, using mock data")
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
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/transactions", { method: "GET" })
      if (response.ok) {
        const data = await response.json()
        const formattedTransactions = data.latest_transactions?.map((t: any) => ({
          id: t.transaction_id,
          date: t.date,
          merchant: t.merchant_name || t.name,
          amount: Math.abs(t.amount),
          roundUp: Math.ceil(Math.abs(t.amount)) - Math.abs(t.amount),
          category: t.category?.[0] || "Other",
        })) || []
        setTransactions(formattedTransactions)
      } else {
        console.log("API returned error, using mock data")
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
      }
    } catch (error) {
      console.error("Error fetching transactions:", error)
      // Set mock data if API fails
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
    } finally {
      setLoading(false)
    }
  }, [accessToken])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  // Refetch transactions when access token becomes available
  useEffect(() => {
    if (accessToken) {
      setLoading(true)
      fetchTransactions()
    }
  }, [accessToken, fetchTransactions])

  const handleDisconnect = () => {
    dispatch({ type: "SET_STATE", state: { linkSuccess: false, itemId: null, accessToken: null } })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
            <p className="text-gray-600 mt-2">Your spare change is making a real difference.</p>
          </div>
          <Button variant="outline" onClick={handleDisconnect}>
            <LogOut className="mr-2 h-4 w-4" />
            Disconnect
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Donated</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">${stats.totalDonated.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">+$12.50 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Round-ups</CardTitle>
              <Coins className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">${stats.currentAccumulation.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                ${(preferences.threshold - stats.currentAccumulation).toFixed(2)} until next donation
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Impact This Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">15</div>
              <p className="text-xs text-muted-foreground">Meals provided to families</p>
            </CardContent>
          </Card>
        </div>

        {/* Round-up Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Round-up Progress</span>
            </CardTitle>
            <CardDescription>Progress toward your ${preferences.threshold} donation threshold</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>${stats.currentAccumulation.toFixed(2)} accumulated</span>
                <span>${preferences.threshold.toFixed(2)} goal</span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {progressPercentage >= 100 ? "Ready to donate!" : `${(100 - progressPercentage).toFixed(0)}% to go`}
              </p>
              {progressPercentage >= 100 && <Button size="sm">Donate Now</Button>}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Selected Charity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="h-5 w-5" />
                <span>Your Charity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={selectedCharity.logo}
                    alt={selectedCharity.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold">{selectedCharity.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedCharity.mission}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Your Impact:</h4>
                  {stats.impactStats.map((stat, index) => (
                    <Badge key={index} variant="secondary" className="mr-2">
                      {stat}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Recent Transactions</span>
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{transaction.merchant}</p>
                      <p className="text-sm text-muted-foreground">${Math.abs(transaction.amount).toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">+${transaction.roundUp.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">{new Date(transaction.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
                {transactions.length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">No transactions yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}