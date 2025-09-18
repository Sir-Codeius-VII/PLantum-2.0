import { NextRequest, NextResponse } from 'next/server';
import { createPayFast } from '@/lib/payfast';
import { createClient } from '@supabase/supabase-js';

// Initialize PayFast with configuration
const payfast = createPayFast({
  merchantId: process.env.PAYFAST_MERCHANT_ID!,
  merchantKey: process.env.PAYFAST_MERCHANT_KEY!,
  passPhrase: process.env.PAYFAST_PASSPHRASE!,
  sandbox: process.env.NODE_ENV !== 'production',
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const data = Object.fromEntries(formData.entries()) as Record<string, string>;

    // Validate PayFast signature
    if (!payfast.validateCallback(data)) {
      console.error('Invalid PayFast signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    const paymentId = data.m_payment_id;
    const paymentStatus = data.payment_status;
    const businessId = data.custom_str1;
    const userId = data.custom_str2;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Get payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('id', paymentId)
      .single()

    if (paymentError || !payment) {
      console.error('Payment not found:', paymentId);
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    // Update payment status
    const status = paymentStatus === 'COMPLETE' ? 'completed' : 'failed';
    await supabase
      .from('payments')
      .update({
        status,
        payfast_payment_id: data.pf_payment_id,
        payfast_signature: data.signature,
        payfast_timestamp: data.payment_date,
        payfast_response: data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', paymentId)

    // If payment is successful, create a transaction record
    if (status === 'completed') {
      await supabase.from('transactions').insert({
        business_id: businessId,
        user_id: userId,
        type: 'payment',
        amount: payment.amount,
        currency: payment.currency,
        status: 'completed',
        description: `Payment for ${payment?.payfast_response?.item_name || ''}`,
        metadata: {
          paymentId,
          payfastPaymentId: data.pf_payment_id,
        },
        created_at: new Date().toISOString(),
      })
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PayFast webhook error:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
} 