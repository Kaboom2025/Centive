"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CreditCard, Heart, Shield, CheckCircle, DollarSign, TrendingUp } from "lucide-react"
import { PlaidLink } from "@/components/plaid/plaid-link"
import { usePlaid } from "@/contexts/plaid-context"

export function LandingPage() {
  const [showPlaidLink, setShowPlaidLink] = useState(false)
  const [isGeneratingToken, setIsGeneratingToken] = useState(false)
  const { linkToken, dispatch } = usePlaid()

  const generateToken = useCallback(async () => {
    setIsGeneratingToken(true)
    try {
      const response = await fetch("/api/create_link_token", {
        method: "POST",
      })
      if (!response.ok) {
        dispatch({ type: "SET_STATE", state: { linkToken: null } })
        return
      }
      const data = await response.json()
      if (data) {
        if (data.error != null) {
          dispatch({
            type: "SET_STATE",
            state: {
              linkToken: null,
              linkTokenError: data.error,
            },
          })
          return
        }
        dispatch({ type: "SET_STATE", state: { linkToken: data.link_token } })
      }
    } catch (error) {
      console.error("Error generating link token:", error)
    } finally {
      setIsGeneratingToken(false)
    }
  }, [dispatch])

  const handleGetStarted = async () => {
    setShowPlaidLink(true)
    if (!linkToken && !isGeneratingToken) {
      await generateToken()
    }
  }

  // Show PlaidLink only when token is ready
  const showPlaidComponent = showPlaidLink && linkToken && !isGeneratingToken
  const showLoading = showPlaidLink && (!linkToken || isGeneratingToken)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center space-y-8 mb-16">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-gray-900 tracking-tight">
              Turn Your Spare Change Into
              <span className="text-blue-600"> Real Impact</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Connect your bank account and automatically round up your purchases to donate to your favorite charities. 
              Every coffee, every grocery trip, every purchase becomes an opportunity to make a difference.
            </p>
          </div>
          
          {!showPlaidLink ? (
            <Button 
              onClick={handleGetStarted}
              size="lg" 
              className="text-lg px-8 py-4 bg-blue-600 hover:bg-blue-700"
              disabled={isGeneratingToken}
            >
              {isGeneratingToken ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Setting up connection...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-5 w-5" />
                  Connect Your Bank & Get Started
                </>
              )}
            </Button>
          ) : (
            <div className="max-w-md mx-auto">
              {showLoading ? (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-gray-600">Preparing secure connection...</p>
                </div>
              ) : showPlaidComponent ? (
                <PlaidLink />
              ) : null}
            </div>
          )}
        </div>

        {/* Security Notice */}
        <Alert className="max-w-4xl mx-auto mb-16 border-blue-200 bg-blue-50">
          <Shield className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            Your banking information is protected with bank-level security. We use Plaid to securely connect to your
            accounts and never store your login credentials.
          </AlertDescription>
        </Alert>

        {/* How It Works */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto flex items-center justify-center mb-4">
                  <CreditCard className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle>Connect Your Bank</CardTitle>
                <CardDescription>
                  Securely link your bank account using Plaid's bank-level security
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto flex items-center justify-center mb-4">
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle>Automatic Round-ups</CardTitle>
                <CardDescription>
                  Your purchases are automatically rounded up to the nearest dollar
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto flex items-center justify-center mb-4">
                  <Heart className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle>Donate to Charity</CardTitle>
                <CardDescription>
                  Choose your favorite charity and watch your spare change make an impact
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Example */}
        <Card className="max-w-4xl mx-auto mb-16">
          <CardHeader>
            <CardTitle className="text-center text-2xl">See It In Action</CardTitle>
            <CardDescription className="text-center text-lg">
              Here's how your everyday purchases can add up to real impact
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Starbucks Coffee</p>
                  <p className="text-sm text-gray-600">$4.37</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Round-up</p>
                  <p className="font-medium text-green-600">+$0.63</p>
                </div>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Amazon Purchase</p>
                  <p className="text-sm text-gray-600">$23.45</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Round-up</p>
                  <p className="font-medium text-green-600">+$0.55</p>
                </div>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Gas Station</p>
                  <p className="text-sm text-gray-600">$45.67</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Round-up</p>
                  <p className="font-medium text-green-600">+$0.33</p>
                </div>
              </div>
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <p className="text-lg font-semibold">Total Impact This Week:</p>
                  <p className="text-xl font-bold text-blue-600">$1.51 donated</p>
                </div>
                <p className="text-sm text-gray-600 mt-2">This could provide 3 meals for families in need!</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Why Choose Round-up Donations?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
              <div className="text-left">
                <h3 className="font-semibold mb-2">Effortless Giving</h3>
                <p className="text-gray-600">Donate automatically without thinking about it</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
              <div className="text-left">
                <h3 className="font-semibold mb-2">Maximum Security</h3>
                <p className="text-gray-600">Bank-level encryption and security protocols</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
              <div className="text-left">
                <h3 className="font-semibold mb-2">Real Impact</h3>
                <p className="text-gray-600">Track exactly how your donations are making a difference</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
              <div className="text-left">
                <h3 className="font-semibold mb-2">Full Control</h3>
                <p className="text-gray-600">Set your preferences and change charities anytime</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}