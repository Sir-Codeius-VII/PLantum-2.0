import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const body = await request.json();
    const { action, id, status } = body;

    // Check if user is admin
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!userData || userData.role !== 'admin') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    switch (action) {
      case 'approve_withdrawal': {
        const { data: withdrawal } = await supabase
          .from('withdrawals')
          .select('*, businesses(balance)')
          .eq('id', id)
          .single();

        if (!withdrawal) {
          return new NextResponse('Withdrawal not found', { status: 404 });
        }

        if (withdrawal.status !== 'pending') {
          return new NextResponse('Withdrawal is not pending', { status: 400 });
        }

        if (withdrawal.businesses.balance < withdrawal.amount) {
          return new NextResponse('Insufficient balance', { status: 400 });
        }

        // Update withdrawal status
        const { error: withdrawalError } = await supabase
          .from('withdrawals')
          .update({ status: 'approved' })
          .eq('id', id);

        if (withdrawalError) throw withdrawalError;

        // Update business balance
        const { error: balanceError } = await supabase
          .from('businesses')
          .update({
            balance: withdrawal.businesses.balance - withdrawal.amount
          })
          .eq('id', withdrawal.business_id);

        if (balanceError) throw balanceError;

        // Create transaction record
        const { error: transactionError } = await supabase.from('transactions').insert({
          business_id: withdrawal.business_id,
          business_name: withdrawal.businesses.name,
          amount: withdrawal.amount,
          currency: withdrawal.currency,
          type: 'withdrawal',
          status: 'succeeded'
        });

        if (transactionError) throw transactionError;

        return NextResponse.json({ success: true });
      }

      case 'reject_withdrawal': {
        const { error } = await supabase
          .from('withdrawals')
          .update({ status: 'rejected' })
          .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true });
      }

      case 'update_user_status': {
        const { error } = await supabase
          .from('users')
          .update({ status })
          .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true });
      }

      case 'update_business_status': {
        const { error } = await supabase
          .from('businesses')
          .update({ status })
          .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true });
      }

      default:
        return new NextResponse('Invalid action', { status: 400 });
    }
  } catch (error) {
    console.error('Error in admin actions:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 