import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { RekaanManager } from '@/components/dashboard/rekaan-manager'
import type { Creator, RekaanPortal } from '@/lib/types'

export default async function RekaanPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: currentCreator } = await supabase
    .from('creators')
    .select('*')
    .eq('id', user?.id)
    .single() as { data: Creator | null }

  if (!currentCreator || currentCreator.peranan !== 'boss') {
    redirect('/dashboard')
  }

  const { data: rekaanList } = await supabase
    .from('rekaan_portal')
    .select('*')
    .order('urutan', { ascending: true })
    .order('created_at', { ascending: false }) as { data: RekaanPortal[] | null }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold">Urus Rekaan</h1>
        <p className="text-muted-foreground">
          Muat naik contoh design portal dan paparkan kepada pelanggan di laman utama.
        </p>
      </div>

      <RekaanManager rekaanList={rekaanList || []} />
    </div>
  )
}
