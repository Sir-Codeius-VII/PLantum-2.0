import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });

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

    // Get settings
    const { data: settings } = await supabase.from('settings').select('*').single();

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error in admin settings:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const body = await request.json();

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

    // Update settings
    const { error } = await supabase
      .from('settings')
      .update(body)
      .eq('id', 1);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in admin settings:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 