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

  // Get creator profile
  const { data: creator } = await supabase
    .from('creators')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!creator) {
    // If no creator profile exists, sign out and redirect
    await supabase.auth.signOut()
    redirect('/auth/login')
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
