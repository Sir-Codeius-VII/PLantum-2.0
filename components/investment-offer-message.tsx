"use client"

import { useState, useEffect } from "react"
import { Check, ChevronDown, ChevronUp, FileText, HandshakeIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShareAgreement } from "@/components/share-agreement"
import { PaymentNotification } from "@/components/payment-notification"
import { EscrowWallet } from "@/components/escrow-wallet"
import { toast } from "sonner"

interface InvestmentOfferMessageProps {
  startupId: string
  startupName: string
  investorId: string
  offerAmount: number
  equityPercentage: number
  status: "offer" | "accepted" | "agreement" | "signed" | "payment" | "completed"
}

export function InvestmentOfferMessage({
  startupId,
  startupName,
  investorId,
  offerAmount,
  equityPercentage,
  status = "offer",
}: InvestmentOfferMessageProps) {
  const [currentStatus, setCurrentStatus] = useState(status)
  const [expanded, setExpanded] = useState(true)
  const [escrowWallet, setEscrowWallet] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (currentStatus === "accepted") {
      createEscrowWallet()
    }
  }, [currentStatus])

  const createEscrowWallet = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/escrow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startupId,
          investorId,
          amount: offerAmount,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create escrow wallet")
      }

      const data = await response.json()
      setEscrowWallet(data)
      toast.success("Escrow wallet created successfully")
    } catch (error) {
      console.error("Error creating escrow wallet:", error)
      toast.error("Failed to create escrow wallet")
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = (newStatus: "offer" | "accepted" | "agreement" | "signed" | "payment" | "completed") => {
    setCurrentStatus(newStatus)
  }

  const handleEscrowStatusChange = (status: "pending" | "released" | "reversed" | "expired") => {
    if (status === "released") {
      handleStatusChange("completed")
    } else if (status === "reversed" || status === "expired") {
      handleStatusChange("offer")
      toast.error("Escrow expired or reversed. Please try again.")
    }
  }

  const getStatusBadge = () => {
    switch (currentStatus) {
      case "offer":
        return <Badge variant="outline">Offer Sent</Badge>
      case "accepted":
        return <Badge variant="secondary">Offer Accepted</Badge>
      case "agreement":
        return <Badge variant="secondary">Agreement Created</Badge>
      case "signed":
        return <Badge className="bg-blue-500 text-white">Agreement Signed</Badge>
      case "payment":
        return <Badge className="bg-amber-500 text-white">Payment Pending</Badge>
      case "completed":
        return <Badge className="bg-green-500 text-white">Completed</Badge>
    }
  }

  return (
    <Card className="w-full mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-500" />
            <h3 className="font-medium">Investment Offer</h3>
            {getStatusBadge()}
          </div>
          <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)}>
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>

        {expanded && (
          <div className="space-y-4">
            <div className="bg-muted/30 p-3 rounded-md">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Investment Amount</p>
                  <p className="font-medium">R{offerAmount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Equity Percentage</p>
                  <p className="font-medium">{equityPercentage}%</p>
                </div>
              </div>
            </div>

            {currentStatus === "offer" && (
              <div className="flex gap-2 justify-end">
                <Button variant="outline">Decline</Button>
                <Button 
                  onClick={() => handleStatusChange("accepted")}
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Accept Offer"}
                </Button>
              </div>
            )}

            {currentStatus === "accepted" && escrowWallet && (
              <EscrowWallet
                startupId={startupId}
                investorId={investorId}
                amount={offerAmount}
                status={escrowWallet.status}
                createdAt={escrowWallet.created_at}
                expiresAt={escrowWallet.expires_at}
                onStatusChange={handleEscrowStatusChange}
              />
            )}

            {(currentStatus === "agreement" ||
              currentStatus === "signed" ||
              currentStatus === "payment" ||
              currentStatus === "completed") && (
              <ShareAgreement
                startupId={startupId}
                investorId={investorId}
                offerAmount={offerAmount}
                equityPercentage={equityPercentage}
                status={
                  currentStatus === "agreement"
                    ? "pending"
                    : currentStatus === "signed" || currentStatus === "payment"
                      ? "signed"
                      : "completed"
                }
                onStatusChange={(newStatus) => {
                  if (newStatus === "signed") {
                    handleStatusChange("signed")
                  } else if (newStatus === "completed") {
                    handleStatusChange("completed")
                  }
                }}
              />
            )}

            {(currentStatus === "signed" || currentStatus === "payment" || currentStatus === "completed") && (
              <div className="pt-4">
                <PaymentNotification
                  startupId={startupId}
                  startupName={startupName}
                  investorId={investorId}
                  offerAmount={offerAmount}
                  equityPercentage={equityPercentage}
                  onPaymentComplete={() => handleStatusChange("completed")}
                />
              </div>
            )}

            {currentStatus === "completed" && (
              <div className="flex items-center justify-center gap-2 p-4 bg-green-50 text-green-800 rounded-md mt-4">
                <HandshakeIcon className="h-5 w-5" />
                <p className="font-medium">Investment successfully completed!</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

