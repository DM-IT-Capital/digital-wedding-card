'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { UserPlus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export function AddStaffDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nama: '',
    telefon: '',
    peranan: 'staff' as 'staff' | 'boss',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!formData.email || !formData.password || !formData.nama) {
      toast.error('Sila lengkapkan semua maklumat yang diperlukan')
      return
    }

    if (formData.password.length < 6) {
      toast.error('Kata laluan mestilah sekurang-kurangnya 6 aksara')
      return
    }

    setLoading(true)
    const supabase = createClient()

    // Create the user with metadata
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? `${window.location.origin}/auth/callback`,
        data: {
          nama: formData.nama,
          peranan: formData.peranan,
          telefon: formData.telefon || null,
        },
      },
    })

    if (error) {
      toast.error('Gagal menambah staff', {
        description: error.message,
      })
      setLoading(false)
      return
    }

    toast.success('Staff berjaya ditambah!', {
      description: 'Emel pengesahan telah dihantar',
    })
    
    setFormData({
      email: '',
      password: '',
      nama: '',
      telefon: '',
      peranan: 'staff',
    })
    setOpen(false)
    setLoading(false)
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Tambah Staff
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif">Tambah Staff Baru</DialogTitle>
          <DialogDescription>
            Cipta akaun baru untuk staff. Mereka akan menerima emel untuk mengesahkan akaun.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nama">Nama *</Label>
            <Input
              id="nama"
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              placeholder="Nama penuh staff"
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Emel *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="staff@contoh.com"
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Kata Laluan *</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Minimum 6 aksara"
              required
              disabled={loading}
              minLength={6}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telefon">No. Telefon</Label>
            <Input
              id="telefon"
              type="tel"
              value={formData.telefon}
              onChange={(e) => setFormData({ ...formData, telefon: e.target.value })}
              placeholder="012-3456789"
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="peranan">Peranan *</Label>
            <Select
              value={formData.peranan}
              onValueChange={(value: 'staff' | 'boss') => 
                setFormData({ ...formData, peranan: value })
              }
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih peranan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="boss">Pentadbir (Boss)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sedang menambah...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Tambah Staff
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
