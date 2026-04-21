import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email and password are required' },
      { status: 400 }
    )
  }

  try {
    const cookieStore = await cookies()
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

    if (!data.session) {
      return NextResponse.json(
        { error: 'Gagal mendapatkan sesi' },
        { status: 401 }
      )
    }

    // Log cookies for debugging
    console.log('Available cookies after signin:', cookieStore.getAll().map(c => c.name))

    // Create response
    const response = NextResponse.json(
      { 
        success: true, 
        session: data.session,
        cookies: cookieStore.getAll().map(c => ({ name: c.name, value: c.value.substring(0, 20) + '...' }))
      },
      { status: 200 }
    )

    // Supabase server client should have already set cookies through the handler
    // But let's manually ensure they're in the response
    cookieStore.getAll().forEach(({ name, value }) => {
      response.cookies.set(name, value, {
        httpOnly: name.includes('sb-'), // Supabase cookies should be httpOnly
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      })
    })

    return response
  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Berlaku ralat' },
      { status: 500 }
    )
  }
}



