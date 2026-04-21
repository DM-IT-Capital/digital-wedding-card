import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, Eye, Edit, MoreHorizontal, Trash2, Share2, ImagePlus } from 'lucide-react'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Pelanggan } from '@/lib/types'
import { DeletePelangganButton } from '@/components/dashboard/delete-pelanggan-button'
import { ShareDialog } from '@/components/dashboard/share-dialog'

export default async function PelangganPage() {
  const supabase = await createClient()

  const { data: pelangganList } = await supabase
    .from('pelanggan')
    .select('*')
    .order('created_at', { ascending: false }) as { data: Pelanggan[] | null }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold">Senarai Pelanggan</h1>
          <p className="text-muted-foreground">
            Urus semua kad kahwin digital anda
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/pelanggan/baru">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Pelanggan
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Semua Pelanggan</CardTitle>
          <CardDescription>
            {pelangganList?.length || 0} kad kahwin dalam sistem
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pelangganList && pelangganList.length > 0 ? (
            <div className="space-y-3">
              {pelangganList.map((pelanggan) => (
                <div
                  key={pelanggan.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/30 transition-colors"
                >
                  <div className="flex-1 min-w-0 mr-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {pelanggan.nama_pengantin_lelaki} & {pelanggan.nama_pengantin_perempuan}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          /{pelanggan.slug}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span>
                        {pelanggan.tarikh_sanding_lelaki || pelanggan.tarikh_sanding_perempuan || 'Tarikh belum ditetapkan'}
                      </span>
                      {pelanggan.lokasi_sanding_lelaki || pelanggan.lokasi_sanding_perempuan ? (
                        <span className="truncate max-w-[200px]">
                          {pelanggan.lokasi_sanding_lelaki || pelanggan.lokasi_sanding_perempuan}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
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
                      <>
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/kad/${pelanggan.slug}`} target="_blank">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">Lihat kad</span>
                          </Link>
                        </Button>
                        <ShareDialog 
                          slug={pelanggan.slug} 
                          namaPengantin={`${pelanggan.nama_pengantin_lelaki} & ${pelanggan.nama_pengantin_perempuan}`}
                        />
                      </>
                    )}
                    
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/pelanggan/${pelanggan.id}`}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Link>
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Lagi pilihan</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/pelanggan/${pelanggan.id}`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Maklumat
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/pelanggan/${pelanggan.id}/design`}>
                            <ImagePlus className="mr-2 h-4 w-4" />
                            Urus Rekaan
                          </Link>
                        </DropdownMenuItem>
                        {pelanggan.status === 'published' && (
                          <>
                            <DropdownMenuItem asChild>
                              <Link href={`/kad/${pelanggan.slug}`} target="_blank">
                                <Eye className="mr-2 h-4 w-4" />
                                Lihat Kad
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <Share2 className="mr-2 h-4 w-4" />
                              Kongsi Kad
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuSeparator />
                        <DeletePelangganButton pelangganId={pelanggan.id} />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium mb-2">Belum ada pelanggan</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Mulakan dengan menambah pelanggan pertama anda
              </p>
              <Button asChild>
                <Link href="/dashboard/pelanggan/baru">
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Pelanggan
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
