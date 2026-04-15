'use client'

import { useState } from 'react'
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
import { Textarea } from '@/components/ui/textarea'
import { MessageCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import type { Tetapan } from '@/lib/types'

interface EnquiryDialogProps {
  tetapan: Tetapan | null
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
}

export function EnquiryDialog({ tetapan, variant = 'outline', size = 'default' }: EnquiryDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    telefon: '',
    mesej: '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.from('pertanyaan').insert({
      nama: formData.nama,
      email: formData.email || null,
      telefon: formData.telefon || null,
      mesej: formData.mesej,
    })

    if (error) {
      toast.error('Gagal menghantar pertanyaan', {
        description: 'Sila cuba lagi kemudian'
      })
      setLoading(false)
      return
    }

    toast.success('Pertanyaan berjaya dihantar!', {
      description: 'Kami akan menghubungi anda secepat mungkin'
    })
    setFormData({ nama: '', email: '', telefon: '', mesej: '' })
    setOpen(false)
    setLoading(false)
  }

  // If WhatsApp is available, redirect to WhatsApp
  if (tetapan?.whatsapp_perniagaan) {
    const whatsappNumber = tetapan.whatsapp_perniagaan.replace(/\D/g, '')
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Salam,%20saya%20berminat%20untuk%20mendapatkan%20kad%20kahwin%20digital.`

    return (
      <Button variant={variant} size={size} asChild>
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
          <MessageCircle className="w-4 h-4 mr-2" />
          Hubungi Kami
        </a>
      </Button>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size}>
          <MessageCircle className="w-4 h-4 mr-2" />
          Hubungi Kami
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif">Hubungi Kami</DialogTitle>
          <DialogDescription>
            Isi borang di bawah dan kami akan menghubungi anda secepat mungkin
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nama">Nama *</Label>
            <Input
              id="nama"
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              placeholder="Nama penuh anda"
              required
              disabled={loading}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Emel</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="nama@contoh.com"
                disabled={loading}
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
          </div>
          <div className="space-y-2">
            <Label htmlFor="mesej">Mesej *</Label>
            <Textarea
              id="mesej"
              value={formData.mesej}
              onChange={(e) => setFormData({ ...formData, mesej: e.target.value })}
              placeholder="Saya berminat untuk mendapatkan kad kahwin digital..."
              rows={4}
              required
              disabled={loading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sedang menghantar...
              </>
            ) : (
              'Hantar Pertanyaan'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
