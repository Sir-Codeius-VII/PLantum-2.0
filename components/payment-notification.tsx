"use client"

import { useState } from "react"
import { AlertCircle, ArrowRight, CreditCard, DollarSign, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

interface PaymentNotificationProps {
  startupId: string
  startupName: string
  investorId: string
  offerAmount: number
  equityPercentage: number
  onPaymentComplete?: () => void
}

export function PaymentNotification({
  startupId,
  startupName,
  investorId,
  offerAmount,
  equityPercentage,
  onPaymentComplete,
}: PaymentNotificationProps) {
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"bank" | "card" | "crypto">("bank")
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "processing" | "completed">("pending")

  const handleInitiatePayment = () => {
    setPaymentStatus("processing")

    // Simulate payment processing
    setTimeout(() => {
      setPaymentStatus("completed")
      onPaymentComplete?.()
    }, 2000)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Investment Payment</CardTitle>
          <Badge className={paymentStatus === "completed" ? "bg-green-500" : "bg-amber-500"}>
            {paymentStatus === "completed" ? "Completed" : "Pending"}
          </Badge>
        </div>
        <CardDescription>Complete your investment in {startupName}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted/30 p-4 rounded-md">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Investment Amount</p>
              <p className="text-xl font-bold">R{offerAmount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Equity Percentage</p>
              <p className="text-xl font-bold">{equityPercentage}%</p>
            </div>
          </div>
        </div>

        <div className="flex items-center p-3 border rounded-md bg-amber-50 text-amber-800">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <p className="text-sm">Please complete your payment to finalize the investment agreement.</p>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Payment Timeline</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <p className="text-sm">Agreement Signed</p>
              <p className="ml-auto text-xs text-muted-foreground">March 18, 2024</p>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`h-2 w-2 rounded-full ${paymentStatus !== "pending" ? "bg-green-500" : "bg-gray-300"}`}
              ></div>
              <p className="text-sm">Payment Initiated</p>
              <p className="ml-auto text-xs text-muted-foreground">
                {paymentStatus !== "pending" ? "March 20, 2024" : "Pending"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`h-2 w-2 rounded-full ${paymentStatus === "completed" ? "bg-green-500" : "bg-gray-300"}`}
              ></div>
              <p className="text-sm">Payment Completed</p>
              <p className="ml-auto text-xs text-muted-foreground">
                {paymentStatus === "completed" ? "March 20, 2024" : "Pending"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full gap-2" disabled={paymentStatus === "completed"}>
              <CreditCard className="h-4 w-4" />
              {paymentStatus === "completed" ? "Payment Completed" : "Complete Payment"}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Complete Your Investment</DialogTitle>
              <DialogDescription>
                Choose your preferred payment method to finalize your investment of R{offerAmount.toLocaleString()} for{" "}
                {equityPercentage}% equity in {startupName}.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as any)}>
                <div
                  className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted/50"
                  onClick={() => setPaymentMethod("bank")}
                >
                  <RadioGroupItem value="bank" id="bank" />
                  <Label htmlFor="bank" className="flex-1 cursor-pointer">
                    <div className="flex justify-between items-center">
                      <span>Bank Transfer</span>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </Label>
                </div>

                <div
                  className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted/50"
                  onClick={() => setPaymentMethod("card")}
                >
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex-1 cursor-pointer">
                    <div className="flex justify-between items-center">
                      <span>Credit/Debit Card</span>
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </Label>
                </div>

                <div
                  className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted/50"
                  onClick={() => setPaymentMethod("crypto")}
                >
                  <RadioGroupItem value="crypto" id="crypto" />
                  <Label htmlFor="crypto" className="flex-1 cursor-pointer">
                    <div className="flex justify-between items-center">
                      <span>Cryptocurrency</span>
                      <svg
                        className="h-4 w-4 text-muted-foreground"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9.5 2C9.5 2.82843 8.82843 3.5 8 3.5C7.17157 3.5 6.5 2.82843 6.5 2C6.5 1.17157 7.17157 0.5 8 0.5C8.82843 0.5 9.5 1.17157 9.5 2Z"
                          fill="currentColor"
                        />
                        <path
                          d="M8.5 17C8.5 17.8284 7.82843 18.5 7 18.5C6.17157 18.5 5.5 17.8284 5.5 17C5.5 16.1716 6.17157 15.5 7 15.5C7.82843 15.5 8.5 16.1716 8.5 17Z"
                          fill="currentColor"
                        />
                        <path
                          d="M13.5 22C13.5 22.8284 12.8284 23.5 12 23.5C11.1716 23.5 10.5 22.8284 10.5 22C10.5 21.1716 11.1716 20.5 12 20.5C12.8284 20.5 13.5 21.1716 13.5 22Z"
                          fill="currentColor"
                        />
                        <path
                          d="M18.5 17C18.5 17.8284 17.8284 18.5 17 18.5C16.1716 18.5 15.5 17.8284 15.5 17C15.5 16.1716 16.1716 15.5 17 15.5C17.8284 15.5 18.5 16.1716 18.5 17Z"
                          fill="currentColor"
                        />
                        <path
                          d="M17.5 2C17.5 2.82843 16.8284 3.5 16 3.5C15.1716 3.5 14.5 2.82843 14.5 2C14.5 1.17157 15.1716 0.5 16 0.5C16.8284 0.5 17.5 1.17157 17.5 2Z"
                          fill="currentColor"
                        />
                        <path
                          d="M22.5 12C22.5 12.8284 21.8284 13.5 21 13.5C20.1716 13.5 19.5 12.8284 19.5 12C19.5 11.1716 20.1716 10.5 21 10.5C21.8284 10.5 22.5 11.1716 22.5 12Z"
                          fill="currentColor"
                        />
                        <path
                          d="M4.5 12C4.5 12.8284 3.82843 13.5 3 13.5C2.17157 13.5 1.5 12.8284 1.5 12C1.5 11.1716 2.17157 10.5 3 10.5C3.82843 10.5 4.5 11.1716 4.5 12Z"
                          fill="currentColor"
                        />
                        <path
                          d="M8 3.5C8.82843 3.5 9.5 4.17157 9.5 5V14C9.5 14.8284 8.82843 15.5 8 15.5C7.17157 15.5 6.5 14.8284 6.5 14V5C6.5 4.17157 7.17157 3.5 8 3.5Z"
                          fill="currentColor"
                        />
                        <path
                          d="M16 3.5C16.8284 3.5 17.5 4.17157 17.5 5V14C17.5 14.8284 16.8284 15.5 16 15.5C15.1716 15.5 14.5 14.8284 14.5 14V5C14.5 4.17157 15.1716 3.5 16 3.5Z"
                          fill="currentColor"
                        />
                        <path
                          d="M12 20.5C12.8284 20.5 13.5 19.8284 13.5 19V10C13.5 9.17157 12.8284 8.5 12 8.5C11.1716 8.5 10.5 9.17157 10.5 10V19C10.5 19.8284 11.1716 20.5 12 20.5Z"
                          fill="currentColor"
                        />
                      </svg>
                    </div>
                  </Label>
                </div>
              </RadioGroup>

              {paymentMethod === "bank" && (
                <div className="space-y-3 mt-4">
                  <div className="bg-muted/30 p-3 rounded-md">
                    <h4 className="font-medium text-sm mb-2">Bank Transfer Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="grid grid-cols-2">
                        <span className="text-muted-foreground">Account Name:</span>
                        <span>EcoSolar Solutions</span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-muted-foreground">Bank:</span>
                        <span>First National Bank</span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-muted-foreground">Account Number:</span>
                        <span>62123456789</span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-muted-foreground">Branch Code:</span>
                        <span>250655</span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-muted-foreground">Reference:</span>
                        <span>INV-{investorId.substring(0, 6)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="proof">Upload Proof of Payment</Label>
                    <Input id="proof" type="file" />
                  </div>
                </div>
              )}

              {paymentMethod === "card" && (
                <div className="space-y-3 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input id="expiry" placeholder="MM/YY" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Cardholder Name</Label>
                    <Input id="name" placeholder="John Smith" />
                  </div>
                </div>
              )}

              {paymentMethod === "crypto" && (
                <div className="space-y-3 mt-4">
                  <div className="bg-muted/30 p-3 rounded-md">
                    <h4 className="font-medium text-sm mb-2">Cryptocurrency Payment</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Send exactly 0.12 BTC to the following address:
                    </p>
                    <div className="bg-white p-2 rounded border text-sm font-mono break-all">
                      3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5
                    </div>
                    <div className="mt-3 flex justify-center">
                      <div className="bg-white p-2 rounded border">
                        <svg className="h-24 w-24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="100" height="100" fill="white" />
                          <path d="M10 10H20V20H10V10Z" fill="black" />
                          <path d="M30 10H40V20H30V10Z" fill="black" />
                          {/* This would be a QR code in a real implementation */}
                        </svg>
                      </div>
                    </div>
                    <div className="mt-3 text-center">
                      <a href="#" className="text-sm text-blue-600 flex items-center justify-center">
                        View on Blockchain Explorer
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            <div className="pt-3">
              <div className="flex justify-between mb-2">
                <span className="text-sm">Investment Amount:</span>
                <span className="font-medium">R{offerAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">Platform Fee (2%):</span>
                <span className="font-medium">R{(offerAmount * 0.02).toLocaleString()}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between">
                <span className="font-medium">Total:</span>
                <span className="font-bold">R{(offerAmount * 1.02).toLocaleString()}</span>
              </div>
            </div>

            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleInitiatePayment} className="gap-2">
                {paymentStatus === "processing" ? (
                  <>Processing...</>
                ) : (
                  <>
                    Complete Payment
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  )
}

