import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { mockAuth, shouldUseMockAuth } from '@/lib/mock-auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Use mock auth if Supabase is not configured
    if (shouldUseMockAuth()) {
      console.log('Using mock authentication for development');
      const { user, error } = await mockAuth.signIn(email, password);
      
      if (error) {
        return NextResponse.json({ error }, { status: 401 });
      }

      return NextResponse.json({
        session: {
          user: user,
          access_token: 'mock-token',
          refresh_token: 'mock-refresh-token',
        }
      });
    }

    // Check if environment variables are set for real Supabase
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Missing Supabase environment variables');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    // Get user profile data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    return NextResponse.json({
      session: {
        ...data.session,
        user: {
          ...data.user,
          profile
        }
      }
    });
  } catch (error) {
    console.error('Sign in error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 