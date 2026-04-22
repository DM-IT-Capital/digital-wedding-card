'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { CUSTOM_DESIGN_BUCKET } from '@/lib/design'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Loader2, Palette, Trash2, Upload } from 'lucide-react'
import { toast } from 'sonner'
import type { RekaanPortal } from '@/lib/types'

interface RekaanManagerProps {
  rekaanList: RekaanPortal[]
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function RekaanManager({ rekaanList }: RekaanManagerProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    tajuk: '',
    penerangan: '',
    image_url: '',
    is_active: true,
  })

  function updateField(field: string, value: string | boolean) {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  async function uploadFile(file: File) {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Sesi anda telah tamat. Sila log masuk semula.')
    }

    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'png'
    const filePath = `portal-designs/${user.id}/${Date.now()}.${fileExt}`

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
    return { imageUrl: data.publicUrl, storagePath: filePath }
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
      const result = await uploadFile(file)
      updateField('image_url', result.imageUrl)
      toast.success('Imej berjaya dimuat naik')
    } catch (error) {
      toast.error('Gagal memuat naik imej', {
        description: error instanceof Error ? error.message : 'Berlaku ralat',
      })
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()

    if (!formData.tajuk.trim() || !formData.image_url.trim()) {
      toast.error('Masukkan tajuk dan imej rekaan terlebih dahulu')
      return
    }

    setSaving(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.from('rekaan_portal').insert({
        tajuk: formData.tajuk.trim(),
        slug: slugify(formData.tajuk),
        penerangan: formData.penerangan.trim() || null,
        image_url: formData.image_url.trim(),
        urutan: rekaanList.length + 1,
        is_active: formData.is_active,
      })

      if (error) throw error

      toast.success('Rekaan berjaya ditambah')
      setFormData({
        tajuk: '',
        penerangan: '',
        image_url: '',
        is_active: true,
      })
      router.refresh()
    } catch (error) {
      toast.error('Gagal menambah rekaan', {
        description: error instanceof Error ? error.message : 'Berlaku ralat',
      })
    } finally {
      setSaving(false)
    }
  }

  async function handleToggle(id: string, isActive: boolean) {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('rekaan_portal')
        .update({ is_active: isActive })
        .eq('id', id)

      if (error) throw error
      router.refresh()
    } catch (error) {
      toast.error('Gagal mengemaskini status rekaan', {
        description: error instanceof Error ? error.message : 'Berlaku ralat',
      })
    }
  }

  async function handleDelete(rekaan: RekaanPortal) {
    try {
      const supabase = createClient()

      if (rekaan.storage_path) {
        await supabase.storage.from(CUSTOM_DESIGN_BUCKET).remove([rekaan.storage_path])
      }

      const { error } = await supabase.from('rekaan_portal').delete().eq('id', rekaan.id)

      if (error) throw error

      toast.success('Rekaan berjaya dibuang')
      router.refresh()
    } catch (error) {
      toast.error('Gagal membuang rekaan', {
        description: error instanceof Error ? error.message : 'Berlaku ralat',
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tambah Rekaan Baru</CardTitle>
          <CardDescription>
            Muat naik contoh design yang akan dipaparkan kepada pelanggan di laman utama portal.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="tajuk">Tajuk Rekaan</Label>
                <Input
                  id="tajuk"
                  value={formData.tajuk}
                  onChange={(e) => updateField('tajuk', e.target.value)}
                  placeholder="Contoh: Elegant Floral Gold"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image_url">Pautan Imej</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => updateField('image_url', e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="penerangan">Penerangan Ringkas</Label>
              <Textarea
                id="penerangan"
                rows={3}
                value={formData.penerangan}
                onChange={(e) => updateField('penerangan', e.target.value)}
                placeholder="Contoh: Rekaan minimal dengan sentuhan bunga dan warna champagne."
              />
            </div>

            <div className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="font-medium">Muat naik imej ke portal</p>
                <p className="text-sm text-muted-foreground">
                  Anda boleh muat naik fail atau tampal pautan imej secara manual.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="max-w-xs"
                />
                <Button type="button" variant="secondary" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                  {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                  Muat Naik
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium">Paparkan di laman web</p>
                <p className="text-sm text-muted-foreground">
                  Jika aktif, rekaan ini akan muncul dalam galeri awam.
                </p>
              </div>
              <Switch checked={formData.is_active} onCheckedChange={(checked) => updateField('is_active', checked)} />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={saving || uploading}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Palette className="mr-2 h-4 w-4" />}
                Simpan Rekaan
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Galeri Rekaan Semasa</CardTitle>
          <CardDescription>
            Semua rekaan contoh yang sedang tersedia untuk dilihat oleh pelanggan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {rekaanList.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {rekaanList.map((rekaan) => (
                <div key={rekaan.id} className="overflow-hidden rounded-xl border bg-card">
                  <div className="aspect-[3/4] bg-muted">
                    <img src={rekaan.image_url} alt={rekaan.tajuk} className="h-full w-full object-cover" />
                  </div>
                  <div className="space-y-3 p-4">
                    <div>
                      <h3 className="font-semibold">{rekaan.tajuk}</h3>
                      {rekaan.penerangan ? (
                        <p className="mt-1 text-sm text-muted-foreground">{rekaan.penerangan}</p>
                      ) : null}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={rekaan.is_active}
                          onCheckedChange={(checked) => handleToggle(rekaan.id, checked)}
                        />
                        <span className="text-sm text-muted-foreground">
                          {rekaan.is_active ? 'Dipaparkan' : 'Disorok'}
                        </span>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(rekaan)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 px-6 text-center">
              <Palette className="mb-4 h-10 w-10 text-muted-foreground" />
              <p className="font-medium">Belum ada rekaan portal</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Tambah contoh design pertama anda untuk dipaparkan di laman utama.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
