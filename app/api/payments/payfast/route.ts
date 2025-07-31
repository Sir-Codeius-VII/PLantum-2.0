import { NextRequest, NextResponse } from 'next/server';
import { PayFastService, PayFastPaymentData } from '@/lib/payfast';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const payfast = new PayFastService({
  merchantId: process.env.PAYFAST_MERCHANT_ID!,
  merchantKey: process.env.PAYFAST_MERCHANT_KEY!,
  passPhrase: process.env.PAYFAST_PASSPHRASE!,
  sandbox: process.env.NODE_ENV !== 'production',
});

export async function POST(request: Request) {
  try {
    const { investmentId, amount, investorId, startupId } = await request.json();

    if (!investmentId || !amount || !investorId || !startupId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get investor details from profiles table
    const { data: investor, error: investorError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', investorId)
      .single();

    if (investorError) {
      return NextResponse.json(
        { error: 'Failed to fetch investor details' },
        { status: 500 }
      );
    }

    // Get startup details
    const { data: startup, error: startupError } = await supabase
      .from('startups')
      .select('*')
      .eq('id', startupId)
      .single();

    if (startupError) {
      return NextResponse.json(
        { error: 'Failed to fetch startup details' },
        { status: 500 }
      );
    }

    const paymentData: PayFastPaymentData = {
      merchant_id: process.env.PAYFAST_MERCHANT_ID!,
      merchant_key: process.env.PAYFAST_MERCHANT_KEY!,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/investments/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/investments/cancel`,
      notify_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/payfast/webhook`,
      name_first: investor.name?.split(' ')[0] || 'Investor',
      name_last: investor.name?.split(' ').slice(1).join(' ') || '',
      email_address: investor.id, // Using profile ID as email since we don't have email in profiles
      m_payment_id: investmentId,
      amount: amount,
      item_name: `Investment in ${startup.name}`,
      custom_str1: investorId,
      custom_str2: startupId,
    };

    const paymentUrl = payfast.generatePaymentUrl(paymentData);

    return NextResponse.json({ paymentUrl });
  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json(
      { error: 'Failed to process payment' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const data = Object.fromEntries(searchParams.entries());
    const signature = searchParams.get('signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    const isValid = payfast.verifyCallback(data, signature);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Update investment status
    const { error: updateError } = await supabase
      .from('investments')
      .update({
        status: 'completed',
        payment_status: 'paid',
        payment_id: data.pf_payment_id,
        payment_date: new Date().toISOString(),
      })
      .eq('id', data.m_payment_id);

    if (updateError) {
      console.error('Failed to update investment:', updateError);
      return NextResponse.json(
        { error: 'Failed to update investment status' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 