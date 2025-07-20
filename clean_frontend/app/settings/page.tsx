"use client"

import { useState } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { useApp } from "@/contexts/app-context"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Bell, DollarSign, Shield, CreditCard, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { user } = useAuth()
  const { preferences, updatePreferences, bankAccounts } = useApp()
  const [localPreferences, setLocalPreferences] = useState(preferences)
  const [hasChanges, setHasChanges] = useState(false)
  const { toast } = useToast()

  const handlePreferenceChange = (key: string, value: any) => {
    const newPreferences = { ...localPreferences }
    if (key.includes(".")) {
      const [parent, child] = key.split(".")
      newPreferences[parent as keyof typeof newPreferences] = {
        ...newPreferences[parent as keyof typeof newPreferences],
        [child]: value,
      }
    } else {
      newPreferences[key as keyof typeof newPreferences] = value
    }
    setLocalPreferences(newPreferences)
    setHasChanges(true)
  }

  const handleSave = () => {
    updatePreferences(localPreferences)
    setHasChanges(false)
    toast({
      title: "Settings saved!",
      description: "Your preferences have been updated successfully.",
    })
  }

  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Manage your account preferences, round-up settings, and notification options.
          </p>
        </div>

        {/* Profile Section */}
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Profile Information</span>
            </CardTitle>
            <CardDescription>Your account information (read-only)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                <AvatarFallback className="text-lg">{user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{user?.name}</h3>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Full Name</Label>
                <Input value={user?.name || ""} disabled />
              </div>
              <div>
                <Label>Email Address</Label>
                <Input value={user?.email || ""} disabled />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Round-up Settings */}
        <Card className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>Round-up Configuration</span>
            </CardTitle>
            <CardDescription>Customize how your round-ups are calculated and when donations are made</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Donation Threshold: ${localPreferences.threshold}</Label>
              <p className="text-sm text-muted-foreground">Donate when round-ups reach this amount</p>
              <Slider
                value={[localPreferences.threshold]}
                onValueChange={(value) => handlePreferenceChange("threshold", value[0])}
                max={50}
                min={5}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>$5</span>
                <span>$50</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Round-up Multiplier: {localPreferences.multiplier}x</Label>
              <p className="text-sm text-muted-foreground">Multiply your round-ups for greater impact</p>
              <Slider
                value={[localPreferences.multiplier]}
                onValueChange={(value) => handlePreferenceChange("multiplier", value[0])}
                max={5}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1x</span>
                <span>5x</span>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Example:</h4>
              <p className="text-sm text-blue-800">
                With a ${localPreferences.threshold} threshold and {localPreferences.multiplier}x multiplier:
                <br />A $4.37 purchase becomes a ${(0.63 * localPreferences.multiplier).toFixed(2)} round-up donation.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notification Preferences</span>
            </CardTitle>
            <CardDescription>Choose how and when you want to be notified about your donations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Transaction Notifications</Label>
                  <p className="text-sm text-muted-foreground">Get notified when round-ups are added</p>
                </div>
                <Switch
                  checked={localPreferences.notifications.transactions}
                  onCheckedChange={(checked) => handlePreferenceChange("notifications.transactions", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Donation Notifications</Label>
                  <p className="text-sm text-muted-foreground">Get notified when donations are completed</p>
                </div>
                <Switch
                  checked={localPreferences.notifications.donations}
                  onCheckedChange={(checked) => handlePreferenceChange("notifications.donations", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Monthly Reports</Label>
                  <p className="text-sm text-muted-foreground">Receive monthly impact summaries</p>
                </div>
                <Switch
                  checked={localPreferences.notifications.monthlyReports}
                  onCheckedChange={(checked) => handlePreferenceChange("notifications.monthlyReports", checked)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Notification Method</Label>
              <Select
                value={localPreferences.notifications.method}
                onValueChange={(value) => handlePreferenceChange("notifications.method", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email Only</SelectItem>
                  <SelectItem value="app">App Only</SelectItem>
                  <SelectItem value="both">Email & App</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Connected Accounts */}
        <Card className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Connected Accounts</span>
            </CardTitle>
            <CardDescription>Manage your connected bank accounts</CardDescription>
          </CardHeader>
          <CardContent>
            {bankAccounts.length > 0 ? (
              <div className="space-y-3">
                {bankAccounts.map((account) => (
                  <div key={account.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <img
                        src={account.logo || "/placeholder.svg"}
                        alt={account.bankName}
                        className="w-8 h-8 rounded"
                      />
                      <div>
                        <p className="font-medium">{account.bankName}</p>
                        <p className="text-sm text-muted-foreground">
                          {account.accountType} •••• {account.lastFour}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground">No accounts connected</p>
                <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                  Connect Account
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Privacy & Security</span>
            </CardTitle>
            <CardDescription>Manage your data and security preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Data Sharing</Label>
                  <p className="text-sm text-muted-foreground">Allow anonymized data to help improve our service</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Marketing Communications</Label>
                  <p className="text-sm text-muted-foreground">Receive updates about new features and charities</p>
                </div>
                <Switch />
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline">Download My Data</Button>
                <Button variant="outline">Delete Account</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        {hasChanges && (
          <div className="fixed bottom-6 right-6 animate-slide-up">
            <Button onClick={handleSave} size="lg" className="shadow-lg">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
