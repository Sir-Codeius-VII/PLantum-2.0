import { createClient } from '@supabase/supabase-js'

interface NotificationData {
  userId: string
  type: 'payment_success' | 'payment_failed' | 'payment_pending' | 'payment_cancelled'
  title: string
  message: string
  data?: Record<string, any>
}

export class NotificationService {
  private supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  async createNotification(data: NotificationData) {
    try {
      // Create notification record
      const { error } = await this.supabase
        .from('notifications')
        .insert({
          user_id: data.userId,
          type: data.type,
          title: data.title,
          message: data.message,
          data: data.data,
          read: false,
        })

      if (error) throw error

      // Get user preferences
      const { data: preferences } = await this.supabase
        .from('user_preferences')
        .select('email_notifications')
        .eq('user_id', data.userId)
        .single()

      // Send email if enabled
      if (preferences?.email_notifications) {
        await this.sendEmail(data)
      }
    } catch (error) {
      console.error('Notification creation error:', error)
      throw error
    }
  }

  private async sendEmail(data: NotificationData) {
    try {
      // Get user email
      const { data: user } = await this.supabase
        .from('profiles')
        .select('email')
        .eq('id', data.userId)
        .single()

      if (!user?.email) return

      // Send email using your email service
      // This is a placeholder - implement your email service here
      console.log('Sending email to:', user.email, 'with data:', data)
    } catch (error) {
      console.error('Email sending error:', error)
      throw error
    }
  }
} 