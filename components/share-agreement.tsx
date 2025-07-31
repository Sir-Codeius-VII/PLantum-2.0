"use client"

import { useState, useEffect } from "react"
import { Check, Download, Eye, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { generateAgreementPDF } from "@/lib/agreement"

interface ShareAgreementProps {
  startupId: string
  startupName: string
  startupRegistration: string
  investorId: string
  investorName: string
  investorRegistration: string
  offerAmount: number
  equityPercentage: number
  status: "draft" | "pending" | "signed" | "completed"
  onStatusChange?: (newStatus: "draft" | "pending" | "signed" | "completed") => void
}

export function ShareAgreement({
  startupId,
  startupName,
  startupRegistration,
  investorId,
  investorName,
  investorRegistration,
  offerAmount,
  equityPercentage,
  status = "draft",
  onStatusChange,
}: ShareAgreementProps) {
  const [currentStatus, setCurrentStatus] = useState(status)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleStatusChange = async (newStatus: "draft" | "pending" | "signed" | "completed") => {
    setIsLoading(true)
    try {
      if (newStatus === "signed") {
        // Check escrow wallet status before allowing signature
        const response = await fetch(`/api/escrow?startupId=${startupId}&investorId=${investorId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch escrow wallet")
        }

        const escrowWallets = await response.json()
        const activeEscrow = escrowWallets.find((w: any) => w.status === "pending")

        if (!activeEscrow) {
          throw new Error("No active escrow wallet found")
        }

        // Update agreement status
        const agreementResponse = await fetch(`/api/agreements/${startupId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "signed",
            signed_at: new Date().toISOString(),
          }),
        })

        if (!agreementResponse.ok) {
          throw new Error("Failed to update agreement status")
        }

        // Release funds from escrow
        const releaseResponse = await fetch(`/api/escrow/${startupId}/release`, {
          method: "POST",
        })

        if (!releaseResponse.ok) {
          throw new Error("Failed to release funds from escrow")
        }

        toast.success("Agreement signed and funds released successfully")
      }

      setCurrentStatus(newStatus)
      onStatusChange?.(newStatus)
    } catch (error) {
      console.error("Error updating agreement status:", error)
      toast.error(error instanceof Error ? error.message : "Failed to update agreement status")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = () => {
    try {
      const agreementData = {
        startupName,
        startupRegistration,
        investorName,
        investorRegistration,
        offerAmount,
        equityPercentage,
        effectiveDate: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      }

      const pdfBlob = generateAgreementPDF(agreementData)
      const url = URL.createObjectURL(pdfBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `share-agreement-${startupId}-${investorId}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast.success('Agreement downloaded successfully')
    } catch (error) {
      console.error('Error generating PDF:', error)
      toast.error('Failed to download agreement')
    }
  }

  const getStatusBadge = () => {
    switch (currentStatus) {
      case "draft":
        return <Badge variant="outline">Draft</Badge>
      case "pending":
        return <Badge variant="secondary">Pending Signature</Badge>
      case "signed":
        return <Badge className="bg-blue-500 text-white">Signed</Badge>
      case "completed":
        return <Badge className="bg-green-500 text-white">Completed</Badge>
    }
  }

  const getStatusProgress = () => {
    switch (currentStatus) {
      case "draft":
        return 25
      case "pending":
        return 50
      case "signed":
        return 75
      case "completed":
        return 100
    }
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Share Agreement</CardTitle>
            {getStatusBadge()}
          </div>
          <CardDescription>Investment offer details and agreement status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Agreement Progress</span>
              <span className="font-medium">{getStatusProgress()}%</span>
            </div>
            <Progress value={getStatusProgress()} className="h-2" />
          </div>

          <div className="grid gap-4 pt-2">
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

            <Separator />

            <div className="space-y-1">
              <p className="text-sm font-medium">Agreement Timeline</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${currentStatus !== "draft" ? "bg-green-500" : "bg-gray-300"}`}
                  ></div>
                  <p className="text-sm">Agreement Created</p>
                  <p className="ml-auto text-xs text-muted-foreground">March 15, 2024</p>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${currentStatus !== "draft" ? "bg-green-500" : "bg-gray-300"}`}
                  ></div>
                  <p className="text-sm">Sent for Signature</p>
                  <p className="ml-auto text-xs text-muted-foreground">March 16, 2024</p>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${currentStatus === "signed" || currentStatus === "completed" ? "bg-green-500" : "bg-gray-300"}`}
                  ></div>
                  <p className="text-sm">Agreement Signed</p>
                  <p className="ml-auto text-xs text-muted-foreground">
                    {currentStatus === "signed" || currentStatus === "completed" ? "March 18, 2024" : "Pending"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${currentStatus === "completed" ? "bg-green-500" : "bg-gray-300"}`}
                  ></div>
                  <p className="text-sm">Payment Completed</p>
                  <p className="ml-auto text-xs text-muted-foreground">
                    {currentStatus === "completed" ? "March 20, 2024" : "Pending"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Eye className="h-4 w-4" />
                Preview
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Share Agreement Preview</DialogTitle>
                <DialogDescription>Investment agreement between startup and investor</DialogDescription>
              </DialogHeader>
              <div className="bg-muted/30 p-6 rounded-md border max-h-[60vh] overflow-y-auto">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold">SHARE PURCHASE AGREEMENT</h2>
                  <p className="text-muted-foreground">Between</p>
                  <p className="font-medium">EcoSolar Solutions (Startup)</p>
                  <p className="text-muted-foreground">And</p>
                  <p className="font-medium">Horizon Capital (Investor)</p>
                </div>

                <div className="space-y-4">
                  <p className="text-sm">
                    This Share Purchase Agreement (the "Agreement") is entered into on March 15, 2024 (the "Effective
                    Date") between EcoSolar Solutions, a company registered in South Africa with registration number
                    2021/123456/07 (the "Company"), and Horizon Capital, a venture capital firm registered in South
                    Africa with registration number 2015/789012/07 (the "Investor").
                  </p>

                  <h3 className="font-medium">1. SHARE PURCHASE</h3>
                  <p className="text-sm">
                    Subject to the terms and conditions of this Agreement, the Company agrees to issue and sell to the
                    Investor, and the Investor agrees to purchase from the Company, {equityPercentage}% of the Company's
                    ordinary shares (the "Shares") for a total purchase price of R{offerAmount.toLocaleString()} (the
                    "Purchase Price").
                  </p>

                  <h3 className="font-medium">2. CLOSING</h3>
                  <p className="text-sm">
                    The purchase and sale of the Shares shall take place at a closing (the "Closing") to be held
                    remotely via electronic exchange of documents and signatures on a date to be determined by the
                    parties, but no later than 30 days after the Effective Date.
                  </p>

                  <h3 className="font-medium">3. REPRESENTATIONS AND WARRANTIES</h3>
                  <p className="text-sm">
                    The Company represents and warrants to the Investor that the Company is duly organized, validly
                    existing, and in good standing under the laws of South Africa, has all requisite power and authority
                    to carry on its business as presently conducted and as proposed to be conducted.
                  </p>

                  <h3 className="font-medium">4. CONDITIONS TO CLOSING</h3>
                  <p className="text-sm">
                    The obligations of the Investor to purchase the Shares at the Closing are subject to the fulfillment
                    on or before the Closing of each of the following conditions, unless waived by the Investor.
                  </p>

                  <h3 className="font-medium">5. MISCELLANEOUS</h3>
                  <p className="text-sm">
                    This Agreement constitutes the full and entire understanding and agreement between the parties with
                    respect to the subject matter hereof, and any other written or oral agreement relating to the
                    subject matter hereof existing between the parties is expressly canceled.
                  </p>

                  <div className="pt-8 space-y-4">
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <p className="font-medium">For the Company:</p>
                        <div className="h-12 mt-4 border-b border-dashed"></div>
                        <p className="text-sm">Authorized Signature</p>
                      </div>
                      <div>
                        <p className="font-medium">For the Investor:</p>
                        <div className="h-12 mt-4 border-b border-dashed"></div>
                        <p className="text-sm">Authorized Signature</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setPreviewOpen(false)}>
                  Close
                </Button>
                <Button variant="outline" className="gap-2" onClick={handleDownload}>
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={handleDownload}>
              <Download className="h-4 w-4" />
              Download
            </Button>

            {currentStatus === "draft" && (
              <Button 
                className="gap-2" 
                onClick={() => handleStatusChange("pending")}
                disabled={isLoading}
              >
                <Upload className="h-4 w-4" />
                Send for Signature
              </Button>
            )}

            {currentStatus === "pending" && (
              <Button 
                className="gap-2" 
                onClick={() => handleStatusChange("signed")}
                disabled={isLoading}
              >
                {isLoading ? (
                  "Processing..."
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Sign Agreement
                  </>
                )}
              </Button>
            )}

            {currentStatus === "signed" && (
              <Button className="gap-2" onClick={() => handleStatusChange("completed")}>
                Complete Payment
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </>
  )
}

