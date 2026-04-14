'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Save, Building2, Phone, Globe, Share2 } from 'lucide-react'
import { toast } from 'sonner'
import type { Tetapan } from '@/lib/types'

interface TetapanFormProps {
  tetapan: Tetapan | null
}

export function TetapanForm({ tetapan }: TetapanFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nama_perniagaan: tetapan?.nama_perniagaan || 'Kad Kahwin Digital',
    telefon_perniagaan: tetapan?.telefon_perniagaan || '',
    email_perniagaan: tetapan?.email_perniagaan || '',
    whatsapp_perniagaan: tetapan?.whatsapp_perniagaan || '',
    alamat_perniagaan: tetapan?.alamat_perniagaan || '',
    facebook_url: tetapan?.facebook_url || '',
    instagram_url: tetapan?.instagram_url || '',
    tiktok_url: tetapan?.tiktok_url || '',
    website_url: tetapan?.website_url || '',
  })

  function updateField(field: string, value: string) {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()

    if (tetapan) {
      // Update existing
      const { error } = await supabase
        .from('tetapan')
        .update(formData)
        .eq('id', tetapan.id)

      if (error) {
        toast.error('Gagal mengemaskini tetapan', { description: error.message })
        setLoading(false)
        return
      }
    } else {
      // Create new
      const { error } = await supabase
        .from('tetapan')
        .insert(formData)

      if (error) {
        toast.error('Gagal menyimpan tetapan', { description: error.message })
        setLoading(false)
        return
      }
    }

    toast.success('Tetapan berjaya disimpan')
    router.refresh()
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Business Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Maklumat Perniagaan
          </CardTitle>
          <CardDescription>
            Maklumat asas perniagaan anda
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nama_perniagaan">Nama Perniagaan *</Label>
            <Input
              id="nama_perniagaan"
              value={formData.nama_perniagaan}
              onChange={(e) => updateField('nama_perniagaan', e.target.value)}
              placeholder="Contoh: Kad Kahwin Digital"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="alamat_perniagaan">Alamat Perniagaan</Label>
            <Textarea
              id="alamat_perniagaan"
              value={formData.alamat_perniagaan}
              onChange={(e) => updateField('alamat_perniagaan', e.target.value)}
              placeholder="Alamat penuh perniagaan"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Maklumat Hubungan
          </CardTitle>
          <CardDescription>
            Maklumat untuk dihubungi pelanggan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="telefon_perniagaan">No. Telefon</Label>
              <Input
                id="telefon_perniagaan"
                type="tel"
                value={formData.telefon_perniagaan}
                onChange={(e) => updateField('telefon_perniagaan', e.target.value)}
                placeholder="012-3456789"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp_perniagaan">No. WhatsApp</Label>
              <Input
                id="whatsapp_perniagaan"
                type="tel"
                value={formData.whatsapp_perniagaan}
                onChange={(e) => updateField('whatsapp_perniagaan', e.target.value)}
                placeholder="60123456789"
              />
              <p className="text-xs text-muted-foreground">
                Format: Kod negara tanpa + (contoh: 60123456789)
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email_perniagaan">Emel</Label>
            <Input
              id="email_perniagaan"
              type="email"
              value={formData.email_perniagaan}
              onChange={(e) => updateField('email_perniagaan', e.target.value)}
              placeholder="info@perniagaan.com"
            />
          </div>
        </CardContent>
      </Card>

      {/* Social Media */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Media Sosial
          </CardTitle>
          <CardDescription>
            Pautan ke akaun media sosial perniagaan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="instagram_url">Instagram</Label>
              <Input
                id="instagram_url"
                type="url"
                value={formData.instagram_url}
                onChange={(e) => updateField('instagram_url', e.target.value)}
                placeholder="https://instagram.com/username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="facebook_url">Facebook</Label>
              <Input
                id="facebook_url"
                type="url"
                value={formData.facebook_url}
                onChange={(e) => updateField('facebook_url', e.target.value)}
                placeholder="https://facebook.com/page"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="tiktok_url">TikTok</Label>
              <Input
                id="tiktok_url"
                type="url"
                value={formData.tiktok_url}
                onChange={(e) => updateField('tiktok_url', e.target.value)}
                placeholder="https://tiktok.com/@username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website_url">Laman Web</Label>
              <Input
                id="website_url"
                type="url"
                value={formData.website_url}
                onChange={(e) => updateField('website_url', e.target.value)}
                placeholder="https://www.contoh.com"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sedang menyimpan...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Simpan Tetapan
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
