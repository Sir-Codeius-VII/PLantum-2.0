import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { shouldUseMockAuth } from '@/lib/mock-auth';

export async function GET(request: Request) {
  try {
    if (shouldUseMockAuth()) {
      // Mock session - check for auth header
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.includes('mock-token')) {
        return NextResponse.json({
          session: {
            user: {
              id: 'mock-user-1',
              email: 'test@example.com',
              name: 'Test User',
              is_admin: false,
              created_at: new Date().toISOString(),
            },
            access_token: 'mock-token',
            refresh_token: 'mock-refresh-token',
          }
        });
      }
      return NextResponse.json({ session: null });
    }

    // Check if environment variables are set
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Missing Supabase environment variables');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    if (!session) {
      return NextResponse.json({ session: null }, { status: 200 });
    }

    // Get user profile data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    return NextResponse.json({
      session: {
        ...session,
        user: {
          ...session.user,
          profile
        }
      }
    });
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 