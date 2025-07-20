"use client"

import { useState } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { useApp } from "@/contexts/app-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CreditCard, Plus, Shield, CheckCircle, AlertCircle, Trash2, HelpCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function BankConnectionPage() {
  const { bankAccounts, connectBank, disconnectBank } = useApp()
  const [isConnecting, setIsConnecting] = useState(false)
  const { toast } = useToast()

  const handleConnectBank = async () => {
    setIsConnecting(true)
    try {
      // Simulate Plaid Link flow
      await new Promise((resolve) => setTimeout(resolve, 2000))

      await connectBank({
        bankName: "Wells Fargo",
        accountType: "Checking",
        lastFour: "5678",
      })

      toast({
        title: "Bank account connected!",
        description: "Your account has been successfully linked.",
      })
    } catch (error) {
      toast({
        title: "Connection failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnectBank = (accountId: string, bankName: string) => {
    disconnectBank(accountId)
    toast({
      title: "Bank account disconnected",
      description: `${bankName} has been removed from your account.`,
    })
  }

  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">Bank Connections</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Securely connect your bank accounts to start rounding up your purchases for charity.
          </p>
        </div>

        {/* Security Notice */}
        <Alert className="animate-slide-up">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Your banking information is protected with bank-level security. We use Plaid to securely connect to your
            accounts and never store your login credentials.
          </AlertDescription>
        </Alert>

        {/* Connected Accounts */}
        <Card className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Connected Accounts</span>
            </CardTitle>
            <CardDescription>Manage your connected bank accounts</CardDescription>
          </CardHeader>
          <CardContent>
            {bankAccounts.length > 0 ? (
              <div className="space-y-4">
                {bankAccounts.map((account) => (
                  <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <img
                        src={account.logo || "/placeholder.svg"}
                        alt={account.bankName}
                        className="w-10 h-10 rounded"
                      />
                      <div>
                        <h3 className="font-semibold">{account.bankName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {account.accountType} •••• {account.lastFour}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={account.isConnected ? "default" : "secondary"}
                        className="flex items-center space-x-1"
                      >
                        {account.isConnected ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : (
                          <AlertCircle className="h-3 w-3" />
                        )}
                        <span>{account.isConnected ? "Connected" : "Disconnected"}</span>
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDisconnectBank(account.id, account.bankName)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No accounts connected</h3>
                <p className="text-muted-foreground mb-4">Connect your first bank account to start making donations</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Connect New Account */}
        <Card className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Connect New Account</span>
            </CardTitle>
            <CardDescription>Add another bank account to increase your donation potential</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-4">
              <Button onClick={handleConnectBank} disabled={isConnecting} size="lg" className="w-full sm:w-auto">
                {isConnecting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Connecting...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Connect Bank Account
                  </>
                )}
              </Button>
              <p className="text-sm text-muted-foreground">Powered by Plaid - Bank-level security guaranteed</p>
            </div>
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <CardHeader>
            <CardTitle>How Bank Connection Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-2">
                <div className="bg-primary/10 rounded-full p-3 w-12 h-12 mx-auto flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Secure Connection</h3>
                <p className="text-sm text-muted-foreground">
                  We use Plaid's secure API to connect to your bank without storing credentials
                </p>
              </div>
              <div className="text-center space-y-2">
                <div className="bg-primary/10 rounded-full p-3 w-12 h-12 mx-auto flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Monitor Transactions</h3>
                <p className="text-sm text-muted-foreground">
                  We track your purchases to calculate round-up amounts automatically
                </p>
              </div>
              <div className="text-center space-y-2">
                <div className="bg-primary/10 rounded-full p-3 w-12 h-12 mx-auto flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Automatic Donations</h3>
                <p className="text-sm text-muted-foreground">
                  Round-ups accumulate and donate automatically when you reach your threshold
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <HelpCircle className="h-5 w-5" />
              <span>Frequently Asked Questions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Is my banking information secure?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes, we use Plaid which employs bank-level security. Your login credentials are never stored on our
                  servers.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Which banks are supported?</h3>
                <p className="text-sm text-muted-foreground">
                  We support over 11,000 financial institutions through Plaid, including all major banks and credit
                  unions.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Can I disconnect my account anytime?</h3>
                <p className="text-sm text-muted-foreground">
                  Absolutely. You can disconnect any account at any time from this page.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
