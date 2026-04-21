import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DesignUploadForm } from '@/components/dashboard/design-upload-form'
import type { Pelanggan } from '@/lib/types'

interface PelangganDesignPageProps {
  params: Promise<{ id: string }>
}

export default async function PelangganDesignPage({ params }: PelangganDesignPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: pelanggan } = await supabase
    .from('pelanggan')
    .select('*')
    .eq('id', id)
    .single() as { data: Pelanggan | null }

  if (!pelanggan) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold">Rekaan Pelanggan</h1>
        <p className="text-muted-foreground">
          {pelanggan.nama_pengantin_lelaki} & {pelanggan.nama_pengantin_perempuan}
        </p>
      </div>

      <DesignUploadForm pelanggan={pelanggan} />
    </div>
  )
}
