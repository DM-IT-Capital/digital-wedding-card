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
  const { data: existingCreator } = await supabase
    .from('creators')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  let creator = existingCreator

  if (!creator) {
    const userMetadata = user.user_metadata ?? {}

    const { data: createdCreator, error: createCreatorError } = await supabase
      .from('creators')
      .insert({
        id: user.id,
        email: user.email ?? '',
        nama: userMetadata.nama ?? user.email ?? 'Pengguna',
        peranan: userMetadata.peranan === 'boss' ? 'boss' : 'staff',
        telefon: userMetadata.telefon ?? null,
      })
      .select('*')
      .single()

    if (createCreatorError || !createdCreator) {
      redirect('/auth/error')
    }

    creator = createdCreator
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader creator={creator as Creator} />
      <div className="flex">
        <DashboardSidebar creator={creator as Creator} />
        <main className="flex-1 p-6 lg:p-8 pt-20 lg:ml-64">
          {children}
        </main>
      </div>
    </div>
  )
}
