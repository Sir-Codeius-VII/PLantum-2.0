import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password, name } = body

    if (!email || !password || !name) {
      return new NextResponse("Missing fields", { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data: existing, error: existingErr } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    if (existing) {
      return new NextResponse("Email already exists", { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const { data: signUp, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    })
    if (signUpError || !signUp.user) {
      return new NextResponse("Failed to create user", { status: 500 })
    }

    // Create profile row
    await supabase.from('profiles').insert({
      id: signUp.user.id,
      name,
      email,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    return NextResponse.json({
      user: {
        id: signUp.user.id,
        name,
        email,
      }
    })
  } catch (error) {
    console.log("[REGISTER_ERROR]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 