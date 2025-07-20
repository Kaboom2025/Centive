"use client"

import { usePlaid } from "@/contexts/plaid-context"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { PlaidLink } from "./plaid-link"

export function Header() {
  const {
    itemId,
    accessToken,
    userToken,
    linkToken,
    linkSuccess,
    isItemAccess,
    backend,
    linkTokenError,
    isPaymentInitiation,
  } = usePlaid()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary">Plaid Quickstart</h1>

      {!linkSuccess ? (
        <>
          <h2 className="text-xl font-semibold text-muted-foreground">
            A sample end-to-end integration with Plaid
          </h2>
          <p className="text-muted-foreground">
            The Plaid flow begins when your user wants to connect their bank
            account to your app. Simulate this by clicking the button below to
            launch Link - the client-side component that your users will
            interact with in order to link their accounts to Plaid and allow you
            to access their accounts via the Plaid API.
          </p>
          
          {!backend ? (
            <Alert variant="warning">
              <AlertDescription>
                Unable to fetch link_token: please make sure your backend server
                is running and that your .env file has been configured with your
                <code className="bg-muted px-1 rounded">PLAID_CLIENT_ID</code> and <code className="bg-muted px-1 rounded">PLAID_SECRET</code>.
              </AlertDescription>
            </Alert>
          ) : linkToken == null && backend ? (
            <Alert variant="warning">
              <AlertDescription>
                <div className="space-y-2">
                  <div>
                    Unable to fetch link_token: please make sure your backend server
                    is running and that your .env file has been configured
                    correctly.
                  </div>
                  <div>
                    If you are on a Windows machine, please ensure that you have
                    cloned the repo with{" "}
                    <a
                      href="https://github.com/plaid/quickstart#special-instructions-for-windows"
                      target="_blank"
                      className="text-primary hover:underline"
                      rel="noopener noreferrer"
                    >
                      symlinks turned on.
                    </a>{" "}
                    You can also try checking your{" "}
                    <a
                      href="https://dashboard.plaid.com/activity/logs"
                      target="_blank"
                      className="text-primary hover:underline"
                      rel="noopener noreferrer"
                    >
                      activity log
                    </a>{" "}
                    on your Plaid dashboard.
                  </div>
                  <div>
                    Error Code: <code className="bg-muted px-1 rounded">{linkTokenError.error_code}</code>
                  </div>
                  <div>
                    Error Type: <code className="bg-muted px-1 rounded">{linkTokenError.error_type}</code>
                  </div>
                  <div>Error Message: {linkTokenError.error_message}</div>
                </div>
              </AlertDescription>
            </Alert>
          ) : linkToken === "" ? (
            <div>
              <Button size="lg" disabled>
                Loading...
              </Button>
            </div>
          ) : (
            <div>
              <PlaidLink />
            </div>
          )}
        </>
      ) : (
        <>
          {isPaymentInitiation ? (
            <>
              <h2 className="text-xl font-semibold text-green-600">
                Congrats! Your payment is now confirmed.
              </h2>
              <Alert>
                <AlertDescription>
                  You can see information of all your payments in the{" "}
                  <a
                    href="https://dashboard.plaid.com/activity/payments"
                    target="_blank"
                    className="text-primary hover:underline"
                    rel="noopener noreferrer"
                  >
                    Payments Dashboard
                  </a>
                  .
                </AlertDescription>
              </Alert>
              <p className="text-muted-foreground">
                Now that the 'payment_id' stored in your server, you can use it
                to access the payment information:
              </p>
            </>
          ) : (
            <>
              {isItemAccess ? (
                <h2 className="text-xl font-semibold text-green-600">
                  Congrats! By linking an account, you have created an{" "}
                  <a
                    href="http://plaid.com/docs/quickstart/glossary/#item"
                    target="_blank"
                    className="text-primary hover:underline"
                    rel="noopener noreferrer"
                  >
                    Item
                  </a>
                  .
                </h2>
              ) : userToken ? (
                <h2 className="text-xl font-semibold text-green-600">
                  Congrats! You have successfully linked data to a User.
                </h2>
              ) : (
                <Alert variant="warning">
                  <AlertDescription>
                    Unable to create an item. Please check your backend server
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2 bg-muted p-4 rounded-lg">
                {itemId && (
                  <div className="flex gap-4">
                    <span className="font-mono text-sm text-muted-foreground min-w-[120px]">item_id</span>
                    <span className="font-mono text-sm break-all">{itemId}</span>
                  </div>
                )}

                {accessToken && (
                  <div className="flex gap-4">
                    <span className="font-mono text-sm text-muted-foreground min-w-[120px]">access_token</span>
                    <span className="font-mono text-sm break-all">{accessToken}</span>
                  </div>
                )}

                {userToken && (
                  <div className="flex gap-4">
                    <span className="font-mono text-sm text-muted-foreground min-w-[120px]">user_token</span>
                    <span className="font-mono text-sm break-all">{userToken}</span>
                  </div>
                )}
              </div>
              
              {(isItemAccess || userToken) && (
                <p className="text-muted-foreground">
                  Now that you have {accessToken && "an access_token"}
                  {accessToken && userToken && " and "}
                  {userToken && "a user_token"}, you can make all of the
                  following requests:
                </p>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}