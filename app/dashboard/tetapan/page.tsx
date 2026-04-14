import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TetapanForm } from '@/components/dashboard/tetapan-form'
import type { Creator, Tetapan } from '@/lib/types'

export default async function TetapanPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Check if current user is boss
  const { data: currentCreator } = await supabase
    .from('creators')
    .select('*')
    .eq('id', user?.id)
    .single() as { data: Creator | null }

  if (!currentCreator || currentCreator.peranan !== 'boss') {
    redirect('/dashboard')
  }

  // Get settings
  const { data: tetapan } = await supabase
    .from('tetapan')
    .select('*')
    .single() as { data: Tetapan | null }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold">Tetapan Perniagaan</h1>
        <p className="text-muted-foreground">
          Urus maklumat perniagaan yang dipaparkan di laman web
        </p>
      </div>

      <TetapanForm tetapan={tetapan} />
    </div>
  )
}
