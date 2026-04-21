'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { CUSTOM_DESIGN_BUCKET, isCustomDesignValue } from '@/lib/design'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, ImagePlus, Link2, Loader2, Trash2, Upload } from 'lucide-react'
import { toast } from 'sonner'
import type { Pelanggan } from '@/lib/types'

interface DesignUploadFormProps {
  pelanggan: Pelanggan
}

export function DesignUploadForm({ pelanggan }: DesignUploadFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [savingUrl, setSavingUrl] = useState(false)
  const [currentDesignUrl, setCurrentDesignUrl] = useState(
    isCustomDesignValue(pelanggan.template) ? pelanggan.template : '',
  )
  const [customUrl, setCustomUrl] = useState(
    isCustomDesignValue(pelanggan.template) ? pelanggan.template : '',
  )

  async function saveDesignUrl(url: string) {
    const supabase = createClient()

    const { error } = await supabase
      .from('pelanggan')
      .update({ template: url || 'classic' })
      .eq('id', pelanggan.id)

    if (error) {
      throw error
    }

    router.refresh()
  }

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Sila pilih fail imej sahaja')
      return
    }

    setUploading(true)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast.error('Sesi anda telah tamat. Sila log masuk semula.')
        router.push('/auth/login')
        return
      }

      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'png'
      const filePath = `${user.id}/${pelanggan.id}/${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from(CUSTOM_DESIGN_BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        })

      if (uploadError) {
        throw uploadError
      }

      const { data } = supabase.storage.from(CUSTOM_DESIGN_BUCKET).getPublicUrl(filePath)
      await saveDesignUrl(data.publicUrl)
      setCurrentDesignUrl(data.publicUrl)
      setCustomUrl(data.publicUrl)

      toast.success('Rekaan berjaya dimuat naik')
    } catch (error) {
      toast.error('Gagal memuat naik rekaan', {
        description: error instanceof Error ? error.message : 'Berlaku ralat',
      })
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  async function handleSaveUrl() {
    if (!customUrl.trim()) {
      toast.error('Masukkan pautan imej terlebih dahulu')
      return
    }

    setSavingUrl(true)

    try {
      await saveDesignUrl(customUrl.trim())
      setCurrentDesignUrl(customUrl.trim())
      toast.success('Pautan rekaan berjaya disimpan')
    } catch (error) {
      toast.error('Gagal menyimpan pautan rekaan', {
        description: error instanceof Error ? error.message : 'Berlaku ralat',
      })
    } finally {
      setSavingUrl(false)
    }
  }

  async function handleClearDesign() {
    setSavingUrl(true)

    try {
      await saveDesignUrl('')
      setCurrentDesignUrl('')
      setCustomUrl('')
      toast.success('Rekaan tersuai telah dibuang')
    } catch (error) {
      toast.error('Gagal membuang rekaan', {
        description: error instanceof Error ? error.message : 'Berlaku ralat',
      })
    } finally {
      setSavingUrl(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Button variant="ghost" asChild>
          <Link href={`/dashboard/pelanggan/${pelanggan.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Pelanggan
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href={`/kad/${pelanggan.slug}`} target="_blank">
            Lihat Kad
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Rekaan Tersuai</CardTitle>
          <CardDescription>
            Muat naik imej design anda sendiri. Apabila rekaan tersuai disimpan, halaman kad awam akan memaparkan imej itu.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="design-file">Muat Naik Imej</Label>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Input
                id="design-file"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
              />
              <Button type="button" variant="secondary" disabled={uploading} onClick={() => fileInputRef.current?.click()}>
                {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                Muat Naik
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Bucket Supabase yang digunakan: <code>{CUSTOM_DESIGN_BUCKET}</code>
            </p>
          </div>

          <div className="space-y-3 border-t pt-6">
            <Label htmlFor="design-url">Atau Guna Pautan Imej</Label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Input
                id="design-url"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="https://..."
              />
              <Button type="button" onClick={handleSaveUrl} disabled={savingUrl}>
                {savingUrl ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Link2 className="mr-2 h-4 w-4" />}
                Simpan Pautan
              </Button>
            </div>
          </div>

          <div className="space-y-3 border-t pt-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="font-medium">Pratonton Rekaan Semasa</h3>
                <p className="text-sm text-muted-foreground">
                  Jika tiada rekaan tersuai, portal akan guna template lalai.
                </p>
              </div>
              {currentDesignUrl ? (
                <Button type="button" variant="outline" onClick={handleClearDesign} disabled={savingUrl}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Buang Rekaan
                </Button>
              ) : null}
            </div>

            {currentDesignUrl ? (
              <div className="overflow-hidden rounded-xl border bg-muted/30">
                <img
                  src={currentDesignUrl}
                  alt={`Rekaan ${pelanggan.nama_pengantin_lelaki} dan ${pelanggan.nama_pengantin_perempuan}`}
                  className="max-h-[720px] w-full object-contain"
                />
              </div>
            ) : (
              <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 px-6 text-center">
                <ImagePlus className="mb-4 h-10 w-10 text-muted-foreground" />
                <p className="font-medium">Belum ada rekaan tersuai</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Muat naik imej design pelanggan dan portal awam akan memaparkannya secara automatik.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
