import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
  category: 'payment' | 'security' | 'system' | 'marketing';
  description: string;
  variables: string[];
}

export interface EmailData {
  to: string;
  template: string;
  data?: Record<string, any>;
}

export interface EmailPreferences {
  userId: string;
  paymentNotifications: boolean;
  securityAlerts: boolean;
  marketingEmails: boolean;
  systemUpdates: boolean;
  lastUpdated: Date;
}

export class EmailService {
  private static instance: EmailService;
  private templates: Map<string, EmailTemplate> = new Map();

  private constructor() {
    this.initializeTemplates();
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  private initializeTemplates() {
    // Payment Templates
    this.templates.set('payment_confirmation', {
      subject: 'Payment Confirmation - Plantum',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2E7D32;">Payment Confirmed</h2>
          <p>Dear {{name}},</p>
          <p>Your payment of {{amount}} has been successfully processed.</p>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Payment Details:</strong></p>
            <ul>
              <li>Amount: {{amount}}</li>
              <li>Payment ID: {{paymentId}}</li>
              <li>Date: {{date}}</li>
              <li>Status: {{status}}</li>
            </ul>
          </div>
          <p>Thank you for using Plantum!</p>
          <p>Best regards,<br>The Plantum Team</p>
        </div>
      `,
      text: `
        Payment Confirmation - Plantum

        Dear {{name}},

        Your payment of {{amount}} has been successfully processed.

        Payment Details:
        - Amount: {{amount}}
        - Payment ID: {{paymentId}}
        - Date: {{date}}
        - Status: {{status}}

        Thank you for using Plantum!

        Best regards,
        The Plantum Team
      `,
      category: 'payment',
      description: 'Sent when a payment is successfully processed',
      variables: ['name', 'amount', 'paymentId', 'date', 'status']
    });

    // Security Templates
    this.templates.set('security_alert', {
      subject: 'Security Alert - Plantum',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #C62828;">Security Alert</h2>
          <p>Dear {{name}},</p>
          <p>We detected a suspicious activity on your account.</p>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Activity Details:</strong></p>
            <ul>
              <li>Type: {{activityType}}</li>
              <li>Time: {{time}}</li>
              <li>Location: {{location}}</li>
              <li>Device: {{device}}</li>
            </ul>
          </div>
          <p>If this wasn't you, please secure your account immediately.</p>
          <p>Best regards,<br>The Plantum Security Team</p>
        </div>
      `,
      text: `
        Security Alert - Plantum

        Dear {{name}},

        We detected a suspicious activity on your account.

        Activity Details:
        - Type: {{activityType}}
        - Time: {{time}}
        - Location: {{location}}
        - Device: {{device}}

        If this wasn't you, please secure your account immediately.

        Best regards,
        The Plantum Security Team
      `,
      category: 'security',
      description: 'Sent when suspicious activity is detected',
      variables: ['name', 'activityType', 'time', 'location', 'device']
    });

    // System Templates
    this.templates.set('system_update', {
      subject: 'System Update - Plantum',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1565C0;">System Update</h2>
          <p>Dear {{name}},</p>
          <p>We're making some improvements to our system.</p>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Update Details:</strong></p>
            <ul>
              <li>Type: {{updateType}}</li>
              <li>Date: {{date}}</li>
              <li>Duration: {{duration}}</li>
              <li>Impact: {{impact}}</li>
            </ul>
          </div>
          <p>Thank you for your understanding.</p>
          <p>Best regards,<br>The Plantum Team</p>
        </div>
      `,
      text: `
        System Update - Plantum

        Dear {{name}},

        We're making some improvements to our system.

        Update Details:
        - Type: {{updateType}}
        - Date: {{date}}
        - Duration: {{duration}}
        - Impact: {{impact}}

        Thank you for your understanding.

        Best regards,
        The Plantum Team
      `,
      category: 'system',
      description: 'Sent for system maintenance and updates',
      variables: ['name', 'updateType', 'date', 'duration', 'impact']
    });

    // Marketing Templates
    this.templates.set('marketing_newsletter', {
      subject: 'Plantum Newsletter - {{month}} {{year}}',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2E7D32;">Plantum Newsletter</h2>
          <p>Dear {{name}},</p>
          <p>Here's what's new at Plantum this month:</p>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3>Featured Updates</h3>
            <ul>
              {{#each updates}}
              <li>{{this}}</li>
              {{/each}}
            </ul>
          </div>
          <p>Stay tuned for more exciting updates!</p>
          <p>Best regards,<br>The Plantum Team</p>
        </div>
      `,
      text: `
        Plantum Newsletter - {{month}} {{year}}

        Dear {{name}},

        Here's what's new at Plantum this month:

        Featured Updates:
        {{#each updates}}
        - {{this}}
        {{/each}}

        Stay tuned for more exciting updates!

        Best regards,
        The Plantum Team
      `,
      category: 'marketing',
      description: 'Monthly newsletter with platform updates',
      variables: ['name', 'month', 'year', 'updates']
    });
  }

  private async getUserEmail(userId: string): Promise<string | null> {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', userId)
      .single();

    if (error || !profile) {
      console.error('Error fetching user email:', error);
      return null;
    }

    return profile.email;
  }

  private async getUserPreferences(userId: string): Promise<EmailPreferences | null> {
    const { data: preferences, error } = await supabase
      .from('email_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !preferences) {
      // Create default preferences if none exist
      const defaultPreferences: EmailPreferences = {
        userId,
        paymentNotifications: true,
        securityAlerts: true,
        marketingEmails: false,
        systemUpdates: true,
        lastUpdated: new Date(),
      };

      const { error: insertError } = await supabase
        .from('email_preferences')
        .insert(defaultPreferences);

      if (insertError) {
        console.error('Error creating email preferences:', insertError);
        return null;
      }

      return defaultPreferences;
    }

    return preferences;
  }

  private async shouldSendEmail(userId: string, category: EmailTemplate['category']): Promise<boolean> {
    const preferences = await this.getUserPreferences(userId);
    if (!preferences) return false;

    switch (category) {
      case 'payment':
        return preferences.paymentNotifications;
      case 'security':
        return preferences.securityAlerts;
      case 'marketing':
        return preferences.marketingEmails;
      case 'system':
        return preferences.systemUpdates;
      default:
        return false;
    }
  }

  private replaceTemplateVariables(template: string, data: Record<string, any>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] || match;
    });
  }

  public async sendEmail({ to, template, data = {} }: EmailData): Promise<boolean> {
    try {
      const emailTemplate = this.templates.get(template);
      if (!emailTemplate) {
        throw new Error(`Template ${template} not found`);
      }

      const html = this.replaceTemplateVariables(emailTemplate.html, data);
      const text = this.replaceTemplateVariables(emailTemplate.text, data);

      const { error } = await resend.emails.send({
        from: 'Plantum <noreply@plantum.com>',
        to,
        subject: emailTemplate.subject,
        html,
        text,
      });

      if (error) {
        console.error('Error sending email:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in sendEmail:', error);
      return false;
    }
  }

  public async updateEmailPreferences(
    userId: string,
    preferences: Partial<EmailPreferences>
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('email_preferences')
        .update({
          ...preferences,
          lastUpdated: new Date().toISOString(),
        })
        .eq('user_id', userId);

      if (error) {
        console.error('Error updating email preferences:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateEmailPreferences:', error);
      return false;
    }
  }

  public async getEmailPreferences(userId: string): Promise<EmailPreferences | null> {
    return this.getUserPreferences(userId);
  }

  public async getTemplates(category?: EmailTemplate['category']): Promise<EmailTemplate[]> {
    const templates = Array.from(this.templates.values());
    return category
      ? templates.filter(template => template.category === category)
      : templates;
  }

  public async updateTemplate(
    name: string,
    template: Partial<EmailTemplate>
  ): Promise<boolean> {
    try {
      const existingTemplate = this.templates.get(name);
      if (!existingTemplate) {
        throw new Error(`Template ${name} not found`);
      }

      this.templates.set(name, {
        ...existingTemplate,
        ...template,
      });

      return true;
    } catch (error) {
      console.error('Error updating template:', error);
      return false;
    }
  }

  // Payment-related email methods
  public async sendPaymentConfirmation(userId: string, payment: any): Promise<boolean> {
    if (!(await this.shouldSendEmail(userId, 'payment'))) return false;

    const email = await this.getUserEmail(userId);
    if (!email) return false;

    const data = {
      name: payment.user_name || 'User',
      amount: payment.amount,
      paymentId: payment.id,
      date: new Date(payment.created_at).toLocaleString(),
      status: payment.status,
    };

    return this.sendEmail({
      to: email,
      template: 'payment_confirmation',
      data,
    });
  }

  public async sendPaymentFailed(userId: string, payment: any, error: string): Promise<boolean> {
    if (!(await this.shouldSendEmail(userId, 'payment'))) return false;

    const email = await this.getUserEmail(userId);
    if (!email) return false;

    const data = {
      name: payment.user_name || 'User',
      amount: payment.amount,
      paymentId: payment.id,
      date: new Date(payment.created_at).toLocaleString(),
      error,
    };

    return this.sendEmail({
      to: email,
      template: 'payment_failed',
      data,
    });
  }

  public async sendPaymentRefund(userId: string, payment: any, reason: string): Promise<boolean> {
    if (!(await this.shouldSendEmail(userId, 'payment'))) return false;

    const email = await this.getUserEmail(userId);
    if (!email) return false;

    const data = {
      name: payment.user_name || 'User',
      amount: payment.amount,
      paymentId: payment.id,
      date: new Date().toLocaleString(),
      reason,
    };

    return this.sendEmail({
      to: email,
      template: 'payment_refund',
      data,
    });
  }

  // Security-related email methods
  public async sendSecurityAlert(
    userId: string,
    activityType: string,
    location: string,
    device: string
  ): Promise<boolean> {
    if (!(await this.shouldSendEmail(userId, 'security'))) return false;

    const email = await this.getUserEmail(userId);
    if (!email) return false;

    const data = {
      name: 'User',
      activityType,
      time: new Date().toLocaleString(),
      location,
      device,
    };

    return this.sendEmail({
      to: email,
      template: 'security_alert',
      data,
    });
  }

  // System-related email methods
  public async sendSystemUpdate(
    userId: string,
    updateType: string,
    date: string,
    duration: string,
    impact: string
  ): Promise<boolean> {
    if (!(await this.shouldSendEmail(userId, 'system'))) return false;

    const email = await this.getUserEmail(userId);
    if (!email) return false;

    const data = {
      name: 'User',
      updateType,
      date,
      duration,
      impact,
    };

    return this.sendEmail({
      to: email,
      template: 'system_update',
      data,
    });
  }

  // Marketing-related email methods
  public async sendNewsletter(
    userId: string,
    month: string,
    year: string,
    updates: string[]
  ): Promise<boolean> {
    if (!(await this.shouldSendEmail(userId, 'marketing'))) return false;

    const email = await this.getUserEmail(userId);
    if (!email) return false;

    const data = {
      name: 'User',
      month,
      year,
      updates,
    };

    return this.sendEmail({
      to: email,
      template: 'marketing_newsletter',
      data,
    });
  }
} 