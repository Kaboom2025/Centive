"use client"

import { AppLayout } from "@/components/layout/app-layout"
import { useApp } from "@/contexts/app-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp, Heart, CreditCard, ArrowRight, Coins, Target } from "lucide-react"
import Link from "next/link"

export function Dashboard() {
  const { stats, selectedCharity, transactions, preferences, bankAccounts } = useApp()

  const progressPercentage = (stats.currentAccumulation / preferences.threshold) * 100

  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Your spare change is making a real difference. Here's your impact summary.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="animate-slide-up">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Donated</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">${stats.totalDonated.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">+$12.50 from last month</p>
            </CardContent>
          </Card>

          <Card className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
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

          <Card className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
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
        <Card className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
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
          <Card className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="h-5 w-5" />
                <span>Your Charity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedCharity ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={selectedCharity.logo || "/placeholder.svg"}
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
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/charity-selection">Change Charity</Link>
                  </Button>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <p className="text-muted-foreground">No charity selected</p>
                  <Button asChild>
                    <Link href="/charity-selection">Select a Charity</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="animate-slide-up" style={{ animationDelay: "0.5s" }}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Recent Transactions</span>
                </span>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/history">
                    View All <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{transaction.merchant}</p>
                      <p className="text-sm text-muted-foreground">${transaction.amount.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-primary">+${transaction.roundUp.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">{new Date(transaction.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
                {transactions.length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">No transactions yet</p>
                    {bankAccounts.length === 0 && (
                      <Button variant="outline" size="sm" className="mt-2 bg-transparent" asChild>
                        <Link href="/bank-connection">Connect Bank Account</Link>
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="animate-slide-up" style={{ animationDelay: "0.6s" }}>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your account and preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" asChild>
                <Link href="/bank-connection">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Manage Banks
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/charity-selection">
                  <Heart className="mr-2 h-4 w-4" />
                  Browse Charities
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/settings">
                  <Target className="mr-2 h-4 w-4" />
                  Adjust Settings
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
