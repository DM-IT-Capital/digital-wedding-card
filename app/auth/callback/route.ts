import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data: creator } = await supabase
          .from('creators')
          .select('id')
          .eq('id', user.id)
          .maybeSingle()

        if (!creator) {
          const userMetadata = user.user_metadata ?? {}

          await supabase.from('creators').insert({
            id: user.id,
            email: user.email ?? '',
            nama: userMetadata.nama ?? user.email ?? 'Pengguna',
            peranan: userMetadata.peranan === 'boss' ? 'boss' : 'staff',
            telefon: userMetadata.telefon ?? null,
          })
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/error`)
}
