"use client"

import React, { useEffect, useCallback } from "react"
import { usePlaidLink } from "react-plaid-link"
import { Button } from "@/components/ui/button"
import { usePlaid } from "@/contexts/plaid-context"
import { CreditCard } from "lucide-react"

export function PlaidLink() {
  const { linkToken, isPaymentInitiation, isCraProductsExclusively, dispatch } = usePlaid()

  // Don't render if no token
  if (!linkToken) {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  const onSuccess = useCallback(
    (public_token: string) => {
      const exchangePublicTokenForAccessToken = async () => {
        const response = await fetch("/api/set_access_token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
          body: `public_token=${public_token}`,
        })
        if (!response.ok) {
          dispatch({
            type: "SET_STATE",
            state: {
              itemId: `no item_id retrieved`,
              accessToken: `no access_token retrieved`,
              isItemAccess: false,
            },
          })
          return
        }
        const data = await response.json()
        dispatch({
          type: "SET_STATE",
          state: {
            itemId: data.item_id,
            accessToken: data.access_token,
            isItemAccess: true,
          },
        })
      }

      if (isPaymentInitiation) {
        dispatch({ type: "SET_STATE", state: { isItemAccess: false } })
      } else if (isCraProductsExclusively) {
        dispatch({ type: "SET_STATE", state: { isItemAccess: false } })
      } else {
        exchangePublicTokenForAccessToken()
      }

      dispatch({ type: "SET_STATE", state: { linkSuccess: true } })
      window.history.pushState("", "", "/")
    },
    [dispatch, isPaymentInitiation, isCraProductsExclusively]
  )

  const onExit = useCallback((err: any, metadata: any) => {
    console.log("Plaid Link exited", err, metadata)
    if (err != null) {
      console.error("Plaid Link error:", err)
    }
  }, [])

  let isOauth = false
  const config: Parameters<typeof usePlaidLink>[0] = {
    token: linkToken,
    onSuccess,
    onExit,
  }

  if (typeof window !== "undefined" && window.location.href.includes("?oauth_state_id=")) {
    // @ts-ignore
    config.receivedRedirectUri = window.location.href
    isOauth = true
  }

  const { open, ready } = usePlaidLink(config)

  useEffect(() => {
    if (isOauth && ready) {
      open()
    }
  }, [ready, open, isOauth])

  return (
    <Button size="lg" onClick={() => open()} disabled={!ready} className="bg-blue-600 hover:bg-blue-700">
      {!ready ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Preparing...
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-4 w-4" />
          Connect Your Bank Account
        </>
      )}
    </Button>
  )
}