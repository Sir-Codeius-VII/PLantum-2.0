import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, TrendingUp, Users, Wallet } from "lucide-react"

export default function ClaimR100kPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Earn Up To R100,000 With Our Affiliate Program</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Refer startups and investors to pLantum and earn a percentage of every transaction fee they generate.
          </p>
        </div>

        <Tabs defaultValue="how-it-works" className="w-full mb-12">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="how-it-works">How It Works</TabsTrigger>
            <TabsTrigger value="commission">Commission Structure</TabsTrigger>
            <TabsTrigger value="join">Join Now</TabsTrigger>
          </TabsList>
          <TabsContent value="how-it-works" className="p-6 border rounded-lg mt-2">
            <div className="grid gap-8 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <Users className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>1. Refer Users</CardTitle>
                </CardHeader>
                <CardContent>
                  Share your unique referral link with potential startups and investors in your network.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CheckCircle className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>2. They Join pLantum</CardTitle>
                </CardHeader>
                <CardContent>
                  When they sign up using your link, they're permanently linked to your affiliate account.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <TrendingUp className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>3. They Transact</CardTitle>
                </CardHeader>
                <CardContent>Every time they pay a transaction fee on the platform, you earn a percentage.</CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Wallet className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>4. You Get Paid</CardTitle>
                </CardHeader>
                <CardContent>Receive monthly payouts directly to your bank account or wallet.</CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="commission" className="p-6 border rounded-lg mt-2">
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold mb-4">Tiered Commission Structure</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border p-3 text-left">Tier</th>
                        <th className="border p-3 text-left">Monthly Transaction Volume</th>
                        <th className="border p-3 text-left">Commission Rate</th>
                        <th className="border p-3 text-left">Potential Earnings</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border p-3">Bronze</td>
                        <td className="border p-3">R0 - R100,000</td>
                        <td className="border p-3">15%</td>
                        <td className="border p-3">Up to R15,000</td>
                      </tr>
                      <tr>
                        <td className="border p-3">Silver</td>
                        <td className="border p-3">R100,001 - R500,000</td>
                        <td className="border p-3">20%</td>
                        <td className="border p-3">Up to R100,000</td>
                      </tr>
                      <tr>
                        <td className="border p-3">Gold</td>
                        <td className="border p-3">R500,001+</td>
                        <td className="border p-3">25%</td>
                        <td className="border p-3">Unlimited</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Lifetime Commission</h3>
                <p>
                  You'll earn commission on all transactions from your referred users for as long as they remain active
                  on pLantum.
                </p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="join" className="p-6 border rounded-lg mt-2">
            <Card>
              <CardHeader>
                <CardTitle>Join Our Affiliate Program</CardTitle>
                <CardDescription>Fill in your details to get your unique referral link</CardDescription>
              </CardHeader>
              <CardContent>
                <form>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="Your full name" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="Your email address" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" placeholder="Your phone number" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="company">Company (Optional)</Label>
                      <Input id="company" placeholder="Your company name" />
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Get Your Referral Link</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="bg-muted p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold">How soon can I start earning?</h3>
              <p>As soon as your referred users start transacting on the platform, you'll begin earning commission.</p>
            </div>
            <div>
              <h3 className="font-bold">Is there a limit to how many people I can refer?</h3>
              <p>No, there's no limit. The more people you refer, the more you can earn.</p>
            </div>
            <div>
              <h3 className="font-bold">When and how do I get paid?</h3>
              <p>Payments are processed monthly and can be sent to your bank account or digital wallet.</p>
            </div>
            <div>
              <h3 className="font-bold">Can I track my referrals and earnings?</h3>
              <p>
                Yes, you'll have access to a dashboard where you can track all your referrals and earnings in real-time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

