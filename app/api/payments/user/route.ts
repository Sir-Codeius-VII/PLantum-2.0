import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { PaymentService } from '@/lib/payment/payment-service';

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';

    const paymentService = PaymentService.getInstance();

    if (type === 'history') {
      // Get payment history
      const { data: payments, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      return NextResponse.json({ payments });
    } else if (type === 'methods') {
      // Get payment methods
      const { data: paymentMethods, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', session.user.id)
        .order('is_default', { ascending: false });

      if (error) throw error;

      return NextResponse.json({ paymentMethods });
    } else {
      // Get both payment history and methods
      const [payments, paymentMethods] = await Promise.all([
        supabase
          .from('payments')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(50),
        supabase
          .from('payment_methods')
          .select('*')
          .eq('user_id', session.user.id)
          .order('is_default', { ascending: false })
      ]);

      if (payments.error) throw payments.error;
      if (paymentMethods.error) throw paymentMethods.error;

      return NextResponse.json({
        payments: payments.data,
        paymentMethods: paymentMethods.data
      });
    }
  } catch (error) {
    console.error('Error fetching payment data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
      case 'add_payment_method': {
        const paymentService = PaymentService.getInstance();
        const result = await paymentService.addPaymentMethod({
          userId: session.user.id,
          ...data
        });

        return NextResponse.json(result);
      }

      case 'remove_payment_method': {
        const { data: result, error } = await supabase
          .from('payment_methods')
          .delete()
          .eq('id', data.methodId)
          .eq('user_id', session.user.id);

        if (error) throw error;

        return NextResponse.json({ success: true });
      }

      case 'set_default_payment_method': {
        const { data: result, error } = await supabase
          .from('payment_methods')
          .update({ is_default: false })
          .eq('user_id', session.user.id);

        if (error) throw error;

        const { data: updateResult, error: updateError } = await supabase
          .from('payment_methods')
          .update({ is_default: true })
          .eq('id', data.methodId)
          .eq('user_id', session.user.id);

        if (updateError) throw updateError;

        return NextResponse.json({ success: true });
      }

      case 'retry_payment': {
        const paymentService = PaymentService.getInstance();
        const result = await paymentService.retryFailedPayment(data.paymentId);

        return NextResponse.json(result);
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error processing payment action:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 