"use client"

import { createContext, useContext, useReducer, Dispatch, ReactNode } from "react"

interface PlaidState {
  linkSuccess: boolean
  isItemAccess: boolean
  isPaymentInitiation: boolean
  isUserTokenFlow: boolean
  isCraProductsExclusively: boolean
  linkToken: string | null
  accessToken: string | null
  userToken: string | null
  itemId: string | null
  isError: boolean
  backend: boolean
  products: string[]
  linkTokenError: {
    error_message: string
    error_code: string
    error_type: string
  }
}

const initialState: PlaidState = {
  linkSuccess: false,
  isItemAccess: true,
  isPaymentInitiation: false,
  isCraProductsExclusively: false,
  isUserTokenFlow: false,
  linkToken: null,
  userToken: null,
  accessToken: null,
  itemId: null,
  isError: false,
  backend: true,
  products: ["transactions"],
  linkTokenError: {
    error_type: "",
    error_code: "",
    error_message: "",
  },
}

type PlaidAction = {
  type: "SET_STATE"
  state: Partial<PlaidState>
}

interface PlaidContextType extends PlaidState {
  dispatch: Dispatch<PlaidAction>
}

const PlaidContext = createContext<PlaidContextType | undefined>(undefined)

export function PlaidProvider({ children }: { children: ReactNode }) {
  const reducer = (state: PlaidState, action: PlaidAction): PlaidState => {
    switch (action.type) {
      case "SET_STATE":
        return { ...state, ...action.state }
      default:
        return { ...state }
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <PlaidContext.Provider value={{ ...state, dispatch }}>
      {children}
    </PlaidContext.Provider>
  )
}

export function usePlaid() {
  const context = useContext(PlaidContext)
  if (context === undefined) {
    throw new Error("usePlaid must be used within a PlaidProvider")
  }
  return context
}