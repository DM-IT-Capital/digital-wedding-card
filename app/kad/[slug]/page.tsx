import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { WeddingCard } from '@/components/wedding-card'
import type { Pelanggan, Media, Tetapan } from '@/lib/types'
import type { Metadata } from 'next'

interface KadPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: KadPageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  
  const { data: pelanggan } = await supabase
    .from('pelanggan')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!pelanggan) {
    return {
      title: 'Kad Tidak Ditemui',
    }
  }

  return {
    title: `${pelanggan.nama_pengantin_lelaki} & ${pelanggan.nama_pengantin_perempuan} - Kad Kahwin Digital`,
    description: `Jemputan ke majlis perkahwinan ${pelanggan.nama_pengantin_lelaki} & ${pelanggan.nama_pengantin_perempuan}`,
    openGraph: {
      title: `${pelanggan.nama_pengantin_lelaki} & ${pelanggan.nama_pengantin_perempuan}`,
      description: `Anda dijemput ke majlis perkahwinan kami`,
      type: 'website',
    },
  }
}

export default async function KadPage({ params }: KadPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  // Get wedding card data
  const { data: pelanggan } = await supabase
    .from('pelanggan')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single() as { data: Pelanggan | null }

  if (!pelanggan) {
    notFound()
  }

  // Get media
  const { data: media } = await supabase
    .from('media')
    .select('*')
    .eq('pelanggan_id', pelanggan.id)
    .order('urutan', { ascending: true }) as { data: Media[] | null }

  // Get business settings
  const { data: tetapan } = await supabase
    .from('tetapan')
    .select('*')
    .single() as { data: Tetapan | null }

  return <WeddingCard pelanggan={pelanggan} media={media || []} tetapan={tetapan} />
}
