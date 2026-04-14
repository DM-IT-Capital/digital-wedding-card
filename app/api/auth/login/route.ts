import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email and password are required' },
      { status: 400 }
    )
  }

  const supabase = await createClient()

  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return NextResponse.json(
      { 
        error: error.message === 'Invalid login credentials' 
          ? 'Emel atau kata laluan tidak sah' 
          : error.message
      },
      { status: 401 }
    )
  }

  return NextResponse.json(
    { success: true, session: data.session },
    { status: 200 }
  )
}
