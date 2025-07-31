import { NextRequest, NextResponse } from 'next/server';
import { createPayFast } from '@/lib/payfast';
import { prisma } from '@/lib/prisma';

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

    // Get payment record
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      console.error('Payment not found:', paymentId);
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    // Update payment status
    const status = paymentStatus === 'COMPLETE' ? 'completed' : 'failed';
    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status,
        payfastPaymentId: data.pf_payment_id,
        payfastSignature: data.signature,
        payfastTimestamp: data.payment_date,
        payfastResponse: data,
      },
    });

    // If payment is successful, create a transaction record
    if (status === 'completed') {
      await prisma.transaction.create({
        data: {
          businessId,
          userId,
          type: 'payment',
          amount: payment.amount,
          currency: payment.currency,
          status: 'completed',
          description: `Payment for ${payment.payfastResponse?.item_name}`,
          metadata: {
            paymentId,
            payfastPaymentId: data.pf_payment_id,
          },
        },
      });
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