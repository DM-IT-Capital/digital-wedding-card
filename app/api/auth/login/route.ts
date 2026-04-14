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

    // Create response with success
    const response = NextResponse.json(
      { success: true, session: data.session },
      { status: 200 }
    )

    // Manually set the auth cookies that Supabase needs
    const cookieStore = await cookies()
    const authCookies = cookieStore.getAll()
    
    // Copy all cookies from the server to the response
    authCookies.forEach(cookie => {
      response.cookies.set(cookie.name, cookie.value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365, // 1 year
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


