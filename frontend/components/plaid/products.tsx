"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function Products() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Available Products</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Products component will be implemented here. This will show available Plaid product endpoints.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}