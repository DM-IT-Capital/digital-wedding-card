'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Check, Eye, Trash2, MessageCircle, Phone } from 'lucide-react'
import { toast } from 'sonner'
import type { Pertanyaan } from '@/lib/types'

interface PertanyaanActionsProps {
  pertanyaan: Pertanyaan
}

export function PertanyaanActions({ pertanyaan }: PertanyaanActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function updateStatus(status: 'baru' | 'dibaca' | 'selesai') {
    setLoading(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('pertanyaan')
      .update({ status })
      .eq('id', pertanyaan.id)

    if (error) {
      toast.error('Gagal mengemaskini status')
      setLoading(false)
      return
    }

    toast.success(`Status dikemaskini kepada "${status}"`)
    router.refresh()
    setLoading(false)
  }

  async function handleDelete() {
    if (!confirm('Adakah anda pasti mahu memadamkan pertanyaan ini?')) return
    
    setLoading(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('pertanyaan')
      .delete()
      .eq('id', pertanyaan.id)

    if (error) {
      toast.error('Gagal memadamkan pertanyaan')
      setLoading(false)
      return
    }

    toast.success('Pertanyaan berjaya dipadam')
    router.refresh()
    setLoading(false)
  }

  const whatsappUrl = pertanyaan.telefon
    ? `https://wa.me/${pertanyaan.telefon.replace(/\D/g, '')}?text=Salam%20${encodeURIComponent(pertanyaan.nama)},%20terima%20kasih%20kerana%20menghubungi%20kami%20berkenaan%20kad%20kahwin%20digital.`
    : null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" disabled={loading}>
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Tindakan</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {pertanyaan.status !== 'dibaca' && (
          <DropdownMenuItem onClick={() => updateStatus('dibaca')}>
            <Eye className="mr-2 h-4 w-4" />
            Tandakan Dibaca
          </DropdownMenuItem>
        )}
        {pertanyaan.status !== 'selesai' && (
          <DropdownMenuItem onClick={() => updateStatus('selesai')}>
            <Check className="mr-2 h-4 w-4" />
            Tandakan Selesai
          </DropdownMenuItem>
        )}
        {pertanyaan.status !== 'baru' && (
          <DropdownMenuItem onClick={() => updateStatus('baru')}>
            <MessageCircle className="mr-2 h-4 w-4" />
            Tandakan Baru
          </DropdownMenuItem>
        )}
        {whatsappUrl && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <Phone className="mr-2 h-4 w-4" />
                Hubungi via WhatsApp
              </a>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleDelete}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Padam
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
