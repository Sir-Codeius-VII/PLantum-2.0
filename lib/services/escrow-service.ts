import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface EscrowReleaseConditions {
  type: 'milestone' | 'delivery' | 'time'
  description: string
  requirements: string[]
  deadline?: string
}

export interface CreateEscrowParams {
  paymentId: string
  amount: number
  sellerId: string
  buyerId: string
  projectId: string
  releaseConditions: EscrowReleaseConditions
  metadata?: Record<string, any>
}

export class EscrowService {
  static async createEscrow(params: CreateEscrowParams) {
    const { data, error } = await supabase
      .from('escrow')
      .insert({
        payment_id: params.paymentId,
        amount: params.amount,
        seller_id: params.sellerId,
        buyer_id: params.buyerId,
        project_id: params.projectId,
        release_conditions: params.releaseConditions,
        metadata: params.metadata,
        status: 'PENDING'
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async getEscrow(id: string) {
    const { data, error } = await supabase
      .from('escrow')
      .select(`
        *,
        seller:profiles!escrow_seller_id_fkey(*),
        buyer:profiles!escrow_buyer_id_fkey(*),
        project:projects(*)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }

  static async getUserEscrows(userId: string) {
    const { data, error } = await supabase
      .from('escrow')
      .select(`
        *,
        seller:profiles!escrow_seller_id_fkey(*),
        buyer:profiles!escrow_buyer_id_fkey(*),
        project:projects(*)
      `)
      .or(`seller_id.eq.${userId},buyer_id.eq.${userId}`)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  static async releaseEscrow(id: string, userId: string) {
    // Verify user has permission to release
    const escrow = await this.getEscrow(id)
    if (!escrow) throw new Error('Escrow not found')
    if (escrow.buyer_id !== userId) throw new Error('Only buyer can release funds')

    // Verify release conditions are met
    const conditionsMet = await this.verifyReleaseConditions(escrow)
    if (!conditionsMet) throw new Error('Release conditions not met')

    const { data, error } = await supabase
      .from('escrow')
      .update({
        status: 'RELEASED',
        released_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    // Update payment status
    await supabase
      .from('payments')
      .update({ status: 'COMPLETE' })
      .eq('id', escrow.payment_id)

    return data
  }

  static async cancelEscrow(id: string, userId: string) {
    // Verify user has permission to cancel
    const escrow = await this.getEscrow(id)
    if (!escrow) throw new Error('Escrow not found')
    if (escrow.seller_id !== userId && escrow.buyer_id !== userId) {
      throw new Error('Only seller or buyer can cancel')
    }

    const { data, error } = await supabase
      .from('escrow')
      .update({
        status: 'CANCELLED',
        cancelled_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    // Update payment status
    await supabase
      .from('payments')
      .update({ status: 'CANCELLED' })
      .eq('id', escrow.payment_id)

    return data
  }

  private static async verifyReleaseConditions(escrow: any): Promise<boolean> {
    const conditions = escrow.release_conditions

    switch (conditions.type) {
      case 'milestone':
        // Check if all required milestones are completed
        const { data: milestones } = await supabase
          .from('project_milestones')
          .select('*')
          .eq('project_id', escrow.project_id)
          .in('id', conditions.requirements)

        return milestones?.every(m => m.status === 'COMPLETED') ?? false

      case 'delivery':
        // Check if all required deliverables are submitted
        const { data: deliverables } = await supabase
          .from('project_deliverables')
          .select('*')
          .eq('project_id', escrow.project_id)
          .in('id', conditions.requirements)

        return deliverables?.every(d => d.status === 'SUBMITTED') ?? false

      case 'time':
        // Check if deadline has passed
        if (!conditions.deadline) return false
        return new Date() >= new Date(conditions.deadline)

      default:
        return false
    }
  }
} 