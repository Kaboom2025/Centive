"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function Items() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Item Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Items component will be implemented here. This will show item management functionality.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}