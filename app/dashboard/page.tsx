import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, FileText, MessageSquare, Plus, Eye, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import type { Creator, Pelanggan, Pertanyaan } from '@/lib/types'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get creator profile
  const { data: creator } = await supabase
    .from('creators')
    .select('*')
    .eq('id', user?.id)
    .single() as { data: Creator | null }

  // Get pelanggan count and recent
  const { count: pelangganCount } = await supabase
    .from('pelanggan')
    .select('*', { count: 'exact', head: true })

  const { data: recentPelanggan } = await supabase
    .from('pelanggan')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5) as { data: Pelanggan[] | null }

  // Get pertanyaan count (new only)
  const { count: pertanyaanCount } = await supabase
    .from('pertanyaan')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'baru')

  // Get published count
  const { count: publishedCount } = await supabase
    .from('pelanggan')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published')

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold">Selamat Datang, {creator?.nama}</h1>
          <p className="text-muted-foreground">
            Urus kad kahwin digital anda di sini
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/pelanggan/baru">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Pelanggan
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Jumlah Pelanggan</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pelangganCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              kad kahwin dalam sistem
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Kad Diterbitkan</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publishedCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              kad aktif dan boleh diakses
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pertanyaan Baru</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pertanyaanCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              menunggu tindakan
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Pelanggan */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Pelanggan Terkini</CardTitle>
            <CardDescription>
              Senarai kad kahwin yang baru ditambah
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/pelanggan">
              Lihat Semua
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentPelanggan && recentPelanggan.length > 0 ? (
            <div className="space-y-4">
              {recentPelanggan.map((pelanggan) => (
                <div
                  key={pelanggan.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {pelanggan.nama_pengantin_lelaki} & {pelanggan.nama_pengantin_perempuan}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {pelanggan.tarikh_sanding_lelaki || pelanggan.tarikh_sanding_perempuan || 'Tarikh belum ditetapkan'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        pelanggan.status === 'published'
                          ? 'bg-green-100 text-green-700'
                          : pelanggan.status === 'draft'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {pelanggan.status === 'published' ? 'Diterbitkan' : 
                       pelanggan.status === 'draft' ? 'Draf' : 'Diarkib'}
                    </span>
                    {pelanggan.status === 'published' && (
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/kad/${pelanggan.slug}`} target="_blank">
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/pelanggan/${pelanggan.id}`}>
                        Edit
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">Belum ada pelanggan</p>
              <Button asChild>
                <Link href="/dashboard/pelanggan/baru">
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Pelanggan Pertama
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
