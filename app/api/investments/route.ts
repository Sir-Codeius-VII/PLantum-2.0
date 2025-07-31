import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const { startupId, amount, fundingRoundId } = await request.json();

    if (!startupId || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
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
        { error: 'Startup not found' },
        { status: 404 }
      );
    }

    // Get funding round details if provided
    let fundingRound = null;
    if (fundingRoundId) {
      const { data: round, error: roundError } = await supabase
        .from('funding_rounds')
        .select('*')
        .eq('id', fundingRoundId)
        .single();

      if (roundError) {
        return NextResponse.json(
          { error: 'Funding round not found' },
          { status: 404 }
        );
      }
      fundingRound = round;
    }

    // Validate investment amount
    const minimumInvestment = fundingRound?.minimum_investment || startup.funding_goal * 0.01; // 1% of funding goal as default
    if (amount < minimumInvestment) {
      return NextResponse.json(
        { error: `Minimum investment amount is R${minimumInvestment.toLocaleString()}` },
        { status: 400 }
      );
    }

    // Check if investment exceeds remaining funding goal
    const remainingAmount = startup.funding_goal - startup.raised_amount;
    if (amount > remainingAmount) {
      return NextResponse.json(
        { error: `Investment amount exceeds remaining funding goal of R${remainingAmount.toLocaleString()}` },
        { status: 400 }
      );
    }

    // Create investment record
    const { data: investment, error: investmentError } = await supabase
      .from('investments')
      .insert([
        {
          investor_id: session.user.id,
          startup_id: startupId,
          funding_round_id: fundingRoundId,
          amount,
          status: 'pending',
          payment_status: 'pending',
          investment_type: 'equity',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (investmentError) {
      console.error('Investment creation error:', investmentError);
      return NextResponse.json(
        { error: 'Failed to create investment' },
        { status: 500 }
      );
    }

    return NextResponse.json({ investment });
  } catch (error) {
    console.error('Investment creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create investment' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    // Get user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's investments with related data
    const { data: investments, error: investmentsError } = await supabase
      .from('investments')
      .select(`
        *,
        startups (
          id,
          name,
          description,
          funding_goal,
          raised_amount,
          industry,
          stage,
          logo_url
        ),
        funding_rounds (
          id,
          round_type,
          target_amount,
          raised_amount,
          status
        )
      `)
      .eq('investor_id', session.user.id)
      .order('created_at', { ascending: false });

    if (investmentsError) {
      console.error('Investment retrieval error:', investmentsError);
      return NextResponse.json(
        { error: 'Failed to fetch investments' },
        { status: 500 }
      );
    }

    return NextResponse.json({ investments });
  } catch (error) {
    console.error('Investment retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch investments' },
      { status: 500 }
    );
  }
} 