interface PaymentDetails {
  amount: number
  currency: string
  paymentProvider: string
  userId: string
  ipAddress: string
  userAgent: string
  timestamp: Date
}

interface FraudCheck {
  name: string
  weight: number
  check: (details: PaymentDetails) => Promise<boolean>
}

interface FraudScore {
  score: number
  risk: 'low' | 'medium' | 'high'
  reasons: string[]
}

class FraudDetectionService {
  private checks: FraudCheck[] = []
  private readonly HIGH_RISK_THRESHOLD = 70
  private readonly MEDIUM_RISK_THRESHOLD = 40

  constructor() {
    this.initializeChecks()
  }

  private initializeChecks() {
    this.checks = [
      {
        name: 'Amount Check',
        weight: 20,
        check: async (details) => {
          // Check for unusually large amounts
          const maxAmount = 100000 // R100,000
          return details.amount <= maxAmount
        },
      },
      {
        name: 'Velocity Check',
        weight: 15,
        check: async (details) => {
          // Check for multiple payments in short time
          const recentPayments = await this.getRecentPayments(details.userId)
          return recentPayments.length < 5 // Max 5 payments per hour
        },
      },
      {
        name: 'Location Check',
        weight: 15,
        check: async (details) => {
          // Check if payment location matches user's usual location
          const userLocation = await this.getUserLocation(details.userId)
          const paymentLocation = await this.getLocationFromIP(details.ipAddress)
          return this.areLocationsClose(userLocation, paymentLocation)
        },
      },
      {
        name: 'Device Check',
        weight: 10,
        check: async (details) => {
          // Check if device is known to user
          const knownDevices = await this.getKnownDevices(details.userId)
          return knownDevices.includes(details.userAgent)
        },
      },
      {
        name: 'Time Check',
        weight: 10,
        check: async (details) => {
          // Check if payment time is unusual
          const hour = details.timestamp.getHours()
          return hour >= 6 && hour <= 22 // Only allow payments between 6 AM and 10 PM
        },
      },
      {
        name: 'Provider Check',
        weight: 10,
        check: async (details) => {
          // Check if payment provider is trusted
          const trustedProviders = ['payfast', 'stripe']
          return trustedProviders.includes(details.paymentProvider)
        },
      },
      {
        name: 'Amount Pattern Check',
        weight: 10,
        check: async (details) => {
          // Check if amount follows usual patterns
          const usualAmounts = await this.getUsualAmounts(details.userId)
          return this.isAmountUnusual(details.amount, usualAmounts)
        },
      },
      {
        name: 'Currency Check',
        weight: 10,
        check: async (details) => {
          // Check if currency is supported
          const supportedCurrencies = ['ZAR', 'USD', 'EUR']
          return supportedCurrencies.includes(details.currency)
        },
      },
    ]
  }

  public async checkPayment(details: PaymentDetails): Promise<FraudScore> {
    const results = await Promise.all(
      this.checks.map(async (check) => {
        const passed = await check.check(details)
        return {
          name: check.name,
          passed,
          weight: check.weight,
        }
      })
    )

    const failedChecks = results.filter((result) => !result.passed)
    const totalWeight = this.checks.reduce((sum, check) => sum + check.weight, 0)
    const riskScore = (failedChecks.reduce((sum, check) => sum + check.weight, 0) / totalWeight) * 100

    return {
      score: riskScore,
      risk: this.getRiskLevel(riskScore),
      reasons: failedChecks.map((check) => check.name),
    }
  }

  private getRiskLevel(score: number): 'low' | 'medium' | 'high' {
    if (score >= this.HIGH_RISK_THRESHOLD) return 'high'
    if (score >= this.MEDIUM_RISK_THRESHOLD) return 'medium'
    return 'low'
  }

  // Mock methods for demonstration - replace with actual implementations
  private async getRecentPayments(userId: string): Promise<any[]> {
    // Implement actual database query
    return []
  }

  private async getUserLocation(userId: string): Promise<{ lat: number; lng: number }> {
    // Implement actual location lookup
    return { lat: 0, lng: 0 }
  }

  private async getLocationFromIP(ip: string): Promise<{ lat: number; lng: number }> {
    // Implement actual IP geolocation
    return { lat: 0, lng: 0 }
  }

  private areLocationsClose(loc1: { lat: number; lng: number }, loc2: { lat: number; lng: number }): boolean {
    // Implement actual distance calculation
    return true
  }

  private async getKnownDevices(userId: string): Promise<string[]> {
    // Implement actual device history lookup
    return []
  }

  private async getUsualAmounts(userId: string): Promise<number[]> {
    // Implement actual payment history lookup
    return []
  }

  private isAmountUnusual(amount: number, usualAmounts: number[]): boolean {
    if (usualAmounts.length === 0) return false
    const avg = usualAmounts.reduce((sum, val) => sum + val, 0) / usualAmounts.length
    const stdDev = Math.sqrt(
      usualAmounts.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / usualAmounts.length
    )
    return Math.abs(amount - avg) <= 2 * stdDev
  }
}

// Create a singleton instance
export const fraudDetectionService = new FraudDetectionService() 