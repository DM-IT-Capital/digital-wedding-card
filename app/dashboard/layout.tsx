import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/header'
import type { Creator } from '@/lib/types'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Get creator profile and self-heal older accounts that only have auth metadata.
  const { data: existingCreator, error: existingCreatorError } = await supabase
    .from('creators')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  if (existingCreatorError) {
    redirect(`/auth/error?error=${encodeURIComponent(existingCreatorError.message)}`)
  }

  let creator = existingCreator

  if (!creator) {
    const userMetadata = user.user_metadata ?? {}

    const { error: upsertCreatorError } = await supabase
      .from('creators')
      .upsert({
        id: user.id,
        email: user.email ?? '',
        nama: userMetadata.nama ?? user.email ?? 'Pengguna',
        peranan: userMetadata.peranan === 'boss' ? 'boss' : 'staff',
        telefon: userMetadata.telefon ?? null,
      })
      .select('id')
      .single()

    if (upsertCreatorError) {
      redirect(`/auth/error?error=${encodeURIComponent(upsertCreatorError.message)}`)
    }

    const { data: createdCreator, error: createdCreatorError } = await supabase
      .from('creators')
      .select('*')
      .eq('id', user.id)
      .single()

    if (createdCreatorError || !createdCreator) {
      redirect(
        `/auth/error?error=${encodeURIComponent(
          createdCreatorError?.message ?? 'Creator profile could not be loaded',
        )}`,
      )
    }

    creator = createdCreator
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader creator={creator as Creator} />
      <div className="flex">
        <DashboardSidebar creator={creator as Creator} />
        <main className="flex-1 p-6 pt-20 lg:ml-64 lg:p-8 lg:pt-24">
          {children}
        </main>
      </div>
    </div>
  )
}
