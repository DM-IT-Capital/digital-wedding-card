import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PelangganForm } from '@/components/dashboard/pelanggan-form'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import type { Pelanggan } from '@/lib/types'

interface EditPelangganPageProps {
  params: Promise<{ id: string }>
}

export default async function EditPelangganPage({ params }: EditPelangganPageProps) {
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold">Edit Pelanggan</h1>
          <p className="text-muted-foreground">
            {pelanggan.nama_pengantin_lelaki} & {pelanggan.nama_pengantin_perempuan}
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href={`/dashboard/pelanggan/${pelanggan.id}/design`}>
            Urus Rekaan
          </Link>
        </Button>
      </div>
      
      <PelangganForm pelanggan={pelanggan} />
    </div>
  )
}
