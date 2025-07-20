"use client"

import { useState } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { useApp } from "@/contexts/app-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Download, Calendar, CreditCard, Heart, Filter, Receipt, TrendingUp } from "lucide-react"

export default function HistoryPage() {
  const { transactions, donations } = useApp()
  const [searchQuery, setSearchQuery] = useState("")
  const [dateRange, setDateRange] = useState("all")

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredDonations = donations.filter((donation) =>
    donation.charity.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const totalRoundUps = transactions.reduce((sum, t) => sum + t.roundUp, 0)
  const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0)

  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">Transaction & Donation History</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Track your round-up transactions and donation history to see your impact over time.
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="animate-slide-up">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Round-ups</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">${totalRoundUps.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">From {transactions.length} transactions</p>
            </CardContent>
          </Card>

          <Card className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Donated</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${totalDonations.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Across {donations.length} donations</p>
            </CardContent>
          </Card>

          <Card className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Round-up</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                ${transactions.length > 0 ? (totalRoundUps / transactions.length).toFixed(2) : "0.00"}
              </div>
              <p className="text-xs text-muted-foreground">Per transaction</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Search & Filter</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search transactions or donations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Calendar className="mr-2 h-4 w-4" />
                  Date Range
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Transactions and Donations */}
        <Tabs defaultValue="transactions" className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="transactions" className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4" />
              <span>Transactions</span>
            </TabsTrigger>
            <TabsTrigger value="donations" className="flex items-center space-x-2">
              <Heart className="h-4 w-4" />
              <span>Donations</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>All transactions that generated round-up donations</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredTransactions.length > 0 ? (
                  <div className="space-y-4">
                    {filteredTransactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="bg-primary/10 rounded-full p-2">
                            <CreditCard className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{transaction.merchant}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="secondary">{transaction.category}</Badge>
                              <span className="text-sm text-muted-foreground">
                                {new Date(transaction.date).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${transaction.amount.toFixed(2)}</p>
                          <p className="text-sm text-primary font-medium">
                            +${transaction.roundUp.toFixed(2)} round-up
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No transactions found</h3>
                    <p className="text-muted-foreground">
                      {searchQuery
                        ? "Try adjusting your search terms"
                        : "Connect a bank account to start tracking transactions"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="donations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Donation History</CardTitle>
                <CardDescription>All completed and pending donations to charities</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredDonations.length > 0 ? (
                  <div className="space-y-4">
                    {filteredDonations.map((donation) => (
                      <div
                        key={donation.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="bg-green-100 rounded-full p-2">
                            <Heart className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{donation.charity}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant={donation.status === "completed" ? "default" : "secondary"}>
                                {donation.status}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {new Date(donation.date).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="font-semibold text-green-600">${donation.amount.toFixed(2)}</p>
                          {donation.status === "completed" && donation.receiptUrl && (
                            <Button variant="ghost" size="sm">
                              <Receipt className="mr-1 h-3 w-3" />
                              Receipt
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No donations found</h3>
                    <p className="text-muted-foreground">
                      {searchQuery
                        ? "Try adjusting your search terms"
                        : "Start making transactions to accumulate round-ups for donation"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Export Options */}
        <Card className="animate-slide-up" style={{ animationDelay: "0.5s" }}>
          <CardHeader>
            <CardTitle>Export Data</CardTitle>
            <CardDescription>
              Download your transaction and donation history for tax purposes or personal records
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Transactions (CSV)
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Donations (CSV)
              </Button>
              <Button variant="outline">
                <Receipt className="mr-2 h-4 w-4" />
                Tax Summary (PDF)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
