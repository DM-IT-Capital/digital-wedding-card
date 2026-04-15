'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Save, Eye, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import type { Pelanggan } from '@/lib/types'

interface PelangganFormProps {
  pelanggan?: Pelanggan
}

function generateSlug(nameLelaki: string, namePerempuan: string): string {
  const combined = `${nameLelaki}-${namePerempuan}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  const random = Math.random().toString(36).substring(2, 6)
  return `${combined}-${random}`
}

export function PelangganForm({ pelanggan }: PelangganFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('pengantin')
  
  const [formData, setFormData] = useState({
    // Pengantin Lelaki
    nama_pengantin_lelaki: pelanggan?.nama_pengantin_lelaki || '',
    nama_bapa_lelaki: pelanggan?.nama_bapa_lelaki || '',
    nama_ibu_lelaki: pelanggan?.nama_ibu_lelaki || '',
    telefon_pengantin_lelaki: pelanggan?.telefon_pengantin_lelaki || '',
    
    // Pengantin Perempuan
    nama_pengantin_perempuan: pelanggan?.nama_pengantin_perempuan || '',
    nama_bapa_perempuan: pelanggan?.nama_bapa_perempuan || '',
    nama_ibu_perempuan: pelanggan?.nama_ibu_perempuan || '',
    telefon_pengantin_perempuan: pelanggan?.telefon_pengantin_perempuan || '',
    
    // Majlis Nikah
    tarikh_nikah: pelanggan?.tarikh_nikah || '',
    masa_nikah: pelanggan?.masa_nikah || '',
    lokasi_nikah: pelanggan?.lokasi_nikah || '',
    alamat_nikah: pelanggan?.alamat_nikah || '',
    google_maps_nikah: pelanggan?.google_maps_nikah || '',
    waze_nikah: pelanggan?.waze_nikah || '',
    
    // Majlis Sanding Lelaki
    tarikh_sanding_lelaki: pelanggan?.tarikh_sanding_lelaki || '',
    masa_mula_sanding_lelaki: pelanggan?.masa_mula_sanding_lelaki || '',
    masa_tamat_sanding_lelaki: pelanggan?.masa_tamat_sanding_lelaki || '',
    lokasi_sanding_lelaki: pelanggan?.lokasi_sanding_lelaki || '',
    alamat_sanding_lelaki: pelanggan?.alamat_sanding_lelaki || '',
    google_maps_sanding_lelaki: pelanggan?.google_maps_sanding_lelaki || '',
    waze_sanding_lelaki: pelanggan?.waze_sanding_lelaki || '',
    
    // Majlis Sanding Perempuan
    tarikh_sanding_perempuan: pelanggan?.tarikh_sanding_perempuan || '',
    masa_mula_sanding_perempuan: pelanggan?.masa_mula_sanding_perempuan || '',
    masa_tamat_sanding_perempuan: pelanggan?.masa_tamat_sanding_perempuan || '',
    lokasi_sanding_perempuan: pelanggan?.lokasi_sanding_perempuan || '',
    alamat_sanding_perempuan: pelanggan?.alamat_sanding_perempuan || '',
    google_maps_sanding_perempuan: pelanggan?.google_maps_sanding_perempuan || '',
    waze_sanding_perempuan: pelanggan?.waze_sanding_perempuan || '',
    
    // Design
    tema_warna: pelanggan?.tema_warna || '#D4A574',
    font_style: pelanggan?.font_style || 'serif',
    template: pelanggan?.template || 'classic',
    
    // Dress Code
    dress_code: pelanggan?.dress_code || '',
    dress_code_warna: pelanggan?.dress_code_warna || '',
    
    // Money Gift
    enable_money_gift: pelanggan?.enable_money_gift || false,
    nama_bank: pelanggan?.nama_bank || '',
    nombor_akaun: pelanggan?.nombor_akaun || '',
    nama_pemilik_akaun: pelanggan?.nama_pemilik_akaun || '',
    
    // Contact & Extras
    whatsapp_rsvp: pelanggan?.whatsapp_rsvp || '',
    ucapan_alu_aluan: pelanggan?.ucapan_alu_aluan || '',
    hashtag_wedding: pelanggan?.hashtag_wedding || '',
    spotify_playlist: pelanggan?.spotify_playlist || '',
    
    // Status
    status: pelanggan?.status || 'draft',
  })

  function updateField(field: string, value: string | boolean) {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent, saveAsStatus?: 'draft' | 'published') {
    e.preventDefault()
    
    if (!formData.nama_pengantin_lelaki || !formData.nama_pengantin_perempuan) {
      toast.error('Sila masukkan nama pengantin lelaki dan perempuan')
      setActiveTab('pengantin')
      return
    }
    
    setLoading(true)
    const supabase = createClient()
    
    const {
      data: { user },
    } = await supabase.auth.getUser()
    
    if (!user) {
      toast.error('Sesi anda telah tamat. Sila log masuk semula.')
      router.push('/auth/login')
      return
    }

    const dataToSave = {
      ...formData,
      status: saveAsStatus || formData.status,
      creator_id: user.id,
      slug: pelanggan?.slug || generateSlug(formData.nama_pengantin_lelaki, formData.nama_pengantin_perempuan),
    }

    if (pelanggan) {
      // Update existing
      const { error } = await supabase
        .from('pelanggan')
        .update(dataToSave)
        .eq('id', pelanggan.id)

      if (error) {
        toast.error('Gagal mengemaskini maklumat', { description: error.message })
        setLoading(false)
        return
      }

      toast.success('Maklumat berjaya dikemaskini')
    } else {
      // Create new
      const { error } = await supabase
        .from('pelanggan')
        .insert(dataToSave)

      if (error) {
        toast.error('Gagal menyimpan maklumat', { description: error.message })
        setLoading(false)
        return
      }

      toast.success('Pelanggan berjaya ditambah')
    }

    router.push('/dashboard/pelanggan')
    router.refresh()
  }

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" asChild>
          <Link href="/dashboard/pelanggan">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={(e) => handleSubmit(e, 'draft')}
            disabled={loading}
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Simpan Draf
          </Button>
          <Button
            type="button"
            onClick={(e) => handleSubmit(e, 'published')}
            disabled={loading}
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Eye className="mr-2 h-4 w-4" />}
            Terbitkan
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
          <TabsTrigger value="pengantin">Pengantin</TabsTrigger>
          <TabsTrigger value="majlis">Majlis</TabsTrigger>
          <TabsTrigger value="design">Rekaan</TabsTrigger>
          <TabsTrigger value="hadiah">Hadiah</TabsTrigger>
          <TabsTrigger value="lain">Lain-lain</TabsTrigger>
        </TabsList>

        {/* Tab: Pengantin */}
        <TabsContent value="pengantin" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Pengantin Lelaki */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pengantin Lelaki</CardTitle>
                <CardDescription>Maklumat pengantin lelaki</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nama_pengantin_lelaki">Nama Pengantin *</Label>
                  <Input
                    id="nama_pengantin_lelaki"
                    value={formData.nama_pengantin_lelaki}
                    onChange={(e) => updateField('nama_pengantin_lelaki', e.target.value)}
                    placeholder="Contoh: Ahmad bin Abdullah"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nama_bapa_lelaki">Nama Bapa</Label>
                  <Input
                    id="nama_bapa_lelaki"
                    value={formData.nama_bapa_lelaki}
                    onChange={(e) => updateField('nama_bapa_lelaki', e.target.value)}
                    placeholder="Contoh: Abdullah bin Hassan"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nama_ibu_lelaki">Nama Ibu</Label>
                  <Input
                    id="nama_ibu_lelaki"
                    value={formData.nama_ibu_lelaki}
                    onChange={(e) => updateField('nama_ibu_lelaki', e.target.value)}
                    placeholder="Contoh: Fatimah binti Ali"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefon_pengantin_lelaki">No. Telefon</Label>
                  <Input
                    id="telefon_pengantin_lelaki"
                    type="tel"
                    value={formData.telefon_pengantin_lelaki}
                    onChange={(e) => updateField('telefon_pengantin_lelaki', e.target.value)}
                    placeholder="012-3456789"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Pengantin Perempuan */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pengantin Perempuan</CardTitle>
                <CardDescription>Maklumat pengantin perempuan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nama_pengantin_perempuan">Nama Pengantin *</Label>
                  <Input
                    id="nama_pengantin_perempuan"
                    value={formData.nama_pengantin_perempuan}
                    onChange={(e) => updateField('nama_pengantin_perempuan', e.target.value)}
                    placeholder="Contoh: Siti binti Mohd"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nama_bapa_perempuan">Nama Bapa</Label>
                  <Input
                    id="nama_bapa_perempuan"
                    value={formData.nama_bapa_perempuan}
                    onChange={(e) => updateField('nama_bapa_perempuan', e.target.value)}
                    placeholder="Contoh: Mohd bin Ibrahim"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nama_ibu_perempuan">Nama Ibu</Label>
                  <Input
                    id="nama_ibu_perempuan"
                    value={formData.nama_ibu_perempuan}
                    onChange={(e) => updateField('nama_ibu_perempuan', e.target.value)}
                    placeholder="Contoh: Aminah binti Ismail"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefon_pengantin_perempuan">No. Telefon</Label>
                  <Input
                    id="telefon_pengantin_perempuan"
                    type="tel"
                    value={formData.telefon_pengantin_perempuan}
                    onChange={(e) => updateField('telefon_pengantin_perempuan', e.target.value)}
                    placeholder="012-3456789"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab: Majlis */}
        <TabsContent value="majlis" className="space-y-6">
          {/* Majlis Nikah */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Majlis Akad Nikah</CardTitle>
              <CardDescription>Maklumat majlis akad nikah (jika ada)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="tarikh_nikah">Tarikh</Label>
                  <Input
                    id="tarikh_nikah"
                    type="date"
                    value={formData.tarikh_nikah}
                    onChange={(e) => updateField('tarikh_nikah', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="masa_nikah">Masa</Label>
                  <Input
                    id="masa_nikah"
                    type="time"
                    value={formData.masa_nikah}
                    onChange={(e) => updateField('masa_nikah', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lokasi_nikah">Nama Lokasi</Label>
                <Input
                  id="lokasi_nikah"
                  value={formData.lokasi_nikah}
                  onChange={(e) => updateField('lokasi_nikah', e.target.value)}
                  placeholder="Contoh: Masjid Al-Falah"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="alamat_nikah">Alamat Penuh</Label>
                <Textarea
                  id="alamat_nikah"
                  value={formData.alamat_nikah}
                  onChange={(e) => updateField('alamat_nikah', e.target.value)}
                  placeholder="Masukkan alamat penuh lokasi"
                  rows={2}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="google_maps_nikah">Link Google Maps</Label>
                  <Input
                    id="google_maps_nikah"
                    value={formData.google_maps_nikah}
                    onChange={(e) => updateField('google_maps_nikah', e.target.value)}
                    placeholder="https://maps.google.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="waze_nikah">Link Waze</Label>
                  <Input
                    id="waze_nikah"
                    value={formData.waze_nikah}
                    onChange={(e) => updateField('waze_nikah', e.target.value)}
                    placeholder="https://waze.com/..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Majlis Sanding Lelaki */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Majlis Sanding (Pihak Lelaki)</CardTitle>
              <CardDescription>Maklumat majlis sanding pihak lelaki</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="tarikh_sanding_lelaki">Tarikh</Label>
                  <Input
                    id="tarikh_sanding_lelaki"
                    type="date"
                    value={formData.tarikh_sanding_lelaki}
                    onChange={(e) => updateField('tarikh_sanding_lelaki', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="masa_mula_sanding_lelaki">Masa Mula</Label>
                  <Input
                    id="masa_mula_sanding_lelaki"
                    type="time"
                    value={formData.masa_mula_sanding_lelaki}
                    onChange={(e) => updateField('masa_mula_sanding_lelaki', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="masa_tamat_sanding_lelaki">Masa Tamat</Label>
                  <Input
                    id="masa_tamat_sanding_lelaki"
                    type="time"
                    value={formData.masa_tamat_sanding_lelaki}
                    onChange={(e) => updateField('masa_tamat_sanding_lelaki', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lokasi_sanding_lelaki">Nama Lokasi</Label>
                <Input
                  id="lokasi_sanding_lelaki"
                  value={formData.lokasi_sanding_lelaki}
                  onChange={(e) => updateField('lokasi_sanding_lelaki', e.target.value)}
                  placeholder="Contoh: Dewan Serbaguna Taman Melati"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="alamat_sanding_lelaki">Alamat Penuh</Label>
                <Textarea
                  id="alamat_sanding_lelaki"
                  value={formData.alamat_sanding_lelaki}
                  onChange={(e) => updateField('alamat_sanding_lelaki', e.target.value)}
                  placeholder="Masukkan alamat penuh lokasi"
                  rows={2}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="google_maps_sanding_lelaki">Link Google Maps</Label>
                  <Input
                    id="google_maps_sanding_lelaki"
                    value={formData.google_maps_sanding_lelaki}
                    onChange={(e) => updateField('google_maps_sanding_lelaki', e.target.value)}
                    placeholder="https://maps.google.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="waze_sanding_lelaki">Link Waze</Label>
                  <Input
                    id="waze_sanding_lelaki"
                    value={formData.waze_sanding_lelaki}
                    onChange={(e) => updateField('waze_sanding_lelaki', e.target.value)}
                    placeholder="https://waze.com/..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Majlis Sanding Perempuan */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Majlis Sanding (Pihak Perempuan)</CardTitle>
              <CardDescription>Maklumat majlis sanding pihak perempuan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="tarikh_sanding_perempuan">Tarikh</Label>
                  <Input
                    id="tarikh_sanding_perempuan"
                    type="date"
                    value={formData.tarikh_sanding_perempuan}
                    onChange={(e) => updateField('tarikh_sanding_perempuan', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="masa_mula_sanding_perempuan">Masa Mula</Label>
                  <Input
                    id="masa_mula_sanding_perempuan"
                    type="time"
                    value={formData.masa_mula_sanding_perempuan}
                    onChange={(e) => updateField('masa_mula_sanding_perempuan', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="masa_tamat_sanding_perempuan">Masa Tamat</Label>
                  <Input
                    id="masa_tamat_sanding_perempuan"
                    type="time"
                    value={formData.masa_tamat_sanding_perempuan}
                    onChange={(e) => updateField('masa_tamat_sanding_perempuan', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lokasi_sanding_perempuan">Nama Lokasi</Label>
                <Input
                  id="lokasi_sanding_perempuan"
                  value={formData.lokasi_sanding_perempuan}
                  onChange={(e) => updateField('lokasi_sanding_perempuan', e.target.value)}
                  placeholder="Contoh: Dewan Komuniti Taman Sentosa"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="alamat_sanding_perempuan">Alamat Penuh</Label>
                <Textarea
                  id="alamat_sanding_perempuan"
                  value={formData.alamat_sanding_perempuan}
                  onChange={(e) => updateField('alamat_sanding_perempuan', e.target.value)}
                  placeholder="Masukkan alamat penuh lokasi"
                  rows={2}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="google_maps_sanding_perempuan">Link Google Maps</Label>
                  <Input
                    id="google_maps_sanding_perempuan"
                    value={formData.google_maps_sanding_perempuan}
                    onChange={(e) => updateField('google_maps_sanding_perempuan', e.target.value)}
                    placeholder="https://maps.google.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="waze_sanding_perempuan">Link Waze</Label>
                  <Input
                    id="waze_sanding_perempuan"
                    value={formData.waze_sanding_perempuan}
                    onChange={(e) => updateField('waze_sanding_perempuan', e.target.value)}
                    placeholder="https://waze.com/..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Design */}
        <TabsContent value="design" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Rekaan Kad</CardTitle>
              <CardDescription>Pilih tema dan warna kad kahwin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="tema_warna">Warna Tema</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="tema_warna"
                      type="color"
                      value={formData.tema_warna}
                      onChange={(e) => updateField('tema_warna', e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={formData.tema_warna}
                      onChange={(e) => updateField('tema_warna', e.target.value)}
                      placeholder="#D4A574"
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="font_style">Gaya Font</Label>
                  <Select
                    value={formData.font_style}
                    onValueChange={(value) => updateField('font_style', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih gaya font" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="serif">Klasik (Serif)</SelectItem>
                      <SelectItem value="sans">Moden (Sans)</SelectItem>
                      <SelectItem value="script">Skrip (Script)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="template">Template</Label>
                <Select
                  value={formData.template}
                  onValueChange={(value) => updateField('template', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="classic">Klasik</SelectItem>
                    <SelectItem value="modern">Moden</SelectItem>
                    <SelectItem value="elegant">Elegan</SelectItem>
                    <SelectItem value="rustic">Rustic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dress Code</CardTitle>
              <CardDescription>Tetapan kod pakaian untuk tetamu (pilihan)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dress_code">Dress Code</Label>
                <Input
                  id="dress_code"
                  value={formData.dress_code}
                  onChange={(e) => updateField('dress_code', e.target.value)}
                  placeholder="Contoh: Smart Casual / Baju Melayu & Baju Kurung"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dress_code_warna">Warna Dress Code</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="dress_code_warna"
                    type="color"
                    value={formData.dress_code_warna || '#ffffff'}
                    onChange={(e) => updateField('dress_code_warna', e.target.value)}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={formData.dress_code_warna}
                    onChange={(e) => updateField('dress_code_warna', e.target.value)}
                    placeholder="Contoh: Pastel / Dusty Blue"
                    className="flex-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Hadiah */}
        <TabsContent value="hadiah" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Money Gift / Salam Kaut</CardTitle>
              <CardDescription>Maklumat akaun bank untuk tetamu menghantar hadiah wang</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Aktifkan Money Gift</Label>
                  <p className="text-sm text-muted-foreground">
                    Paparkan maklumat akaun bank di kad kahwin
                  </p>
                </div>
                <Switch
                  checked={formData.enable_money_gift}
                  onCheckedChange={(checked) => updateField('enable_money_gift', checked)}
                />
              </div>

              {formData.enable_money_gift && (
                <div className="space-y-4 pt-4 border-t">
                  <div className="space-y-2">
                    <Label htmlFor="nama_bank">Nama Bank</Label>
                    <Select
                      value={formData.nama_bank}
                      onValueChange={(value) => updateField('nama_bank', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih bank" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Maybank">Maybank</SelectItem>
                        <SelectItem value="CIMB">CIMB Bank</SelectItem>
                        <SelectItem value="Public Bank">Public Bank</SelectItem>
                        <SelectItem value="RHB">RHB Bank</SelectItem>
                        <SelectItem value="Hong Leong">Hong Leong Bank</SelectItem>
                        <SelectItem value="AmBank">AmBank</SelectItem>
                        <SelectItem value="Bank Islam">Bank Islam</SelectItem>
                        <SelectItem value="Bank Rakyat">Bank Rakyat</SelectItem>
                        <SelectItem value="BSN">BSN</SelectItem>
                        <SelectItem value="Affin Bank">Affin Bank</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nombor_akaun">Nombor Akaun</Label>
                    <Input
                      id="nombor_akaun"
                      value={formData.nombor_akaun}
                      onChange={(e) => updateField('nombor_akaun', e.target.value)}
                      placeholder="1234567890"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nama_pemilik_akaun">Nama Pemilik Akaun</Label>
                    <Input
                      id="nama_pemilik_akaun"
                      value={formData.nama_pemilik_akaun}
                      onChange={(e) => updateField('nama_pemilik_akaun', e.target.value)}
                      placeholder="Ahmad bin Abdullah"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Lain-lain */}
        <TabsContent value="lain" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Maklumat Tambahan</CardTitle>
              <CardDescription>Ucapan dan maklumat lain</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="whatsapp_rsvp">WhatsApp untuk RSVP</Label>
                <Input
                  id="whatsapp_rsvp"
                  type="tel"
                  value={formData.whatsapp_rsvp}
                  onChange={(e) => updateField('whatsapp_rsvp', e.target.value)}
                  placeholder="60123456789"
                />
                <p className="text-xs text-muted-foreground">
                  Format: Kod negara + nombor (tanpa + atau -)
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ucapan_alu_aluan">Ucapan Alu-aluan</Label>
                <Textarea
                  id="ucapan_alu_aluan"
                  value={formData.ucapan_alu_aluan}
                  onChange={(e) => updateField('ucapan_alu_aluan', e.target.value)}
                  placeholder="Dengan segala hormatnya, kami mempersilakan Dato'/Datin/Tuan/Puan/Encik/Cik..."
                  rows={4}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="hashtag_wedding">Hashtag Perkahwinan</Label>
                  <Input
                    id="hashtag_wedding"
                    value={formData.hashtag_wedding}
                    onChange={(e) => updateField('hashtag_wedding', e.target.value)}
                    placeholder="#AhmadSiti2024"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="spotify_playlist">Link Spotify Playlist</Label>
                  <Input
                    id="spotify_playlist"
                    value={formData.spotify_playlist}
                    onChange={(e) => updateField('spotify_playlist', e.target.value)}
                    placeholder="https://open.spotify.com/playlist/..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  )
}
