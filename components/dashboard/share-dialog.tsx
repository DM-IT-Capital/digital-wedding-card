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
import { Share2, Copy, ExternalLink, MessageCircle, QrCode } from 'lucide-react'
import { toast } from 'sonner'
import type { Pelanggan } from '@/lib/types'
import QRCode from 'react-qr-code'

interface ShareDialogProps {
  pelanggan: Pelanggan
}

export function ShareDialog({ pelanggan }: ShareDialogProps) {
  const [open, setOpen] = useState(false)
  
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const cardUrl = `${baseUrl}/kad/${pelanggan.slug}`

  const whatsappMessage = encodeURIComponent(
    `Assalamualaikum dan Salam Sejahtera,\n\nKami dengan sukacitanya menjemput tuan/puan ke majlis perkahwinan kami.\n\nSila klik pautan di bawah untuk melihat jemputan:\n${cardUrl}\n\nDaripada,\n${pelanggan.nama_pengantin_lelaki} & ${pelanggan.nama_pengantin_perempuan}`
  )

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(cardUrl)
      toast.success('Pautan berjaya disalin!')
    } catch {
      toast.error('Gagal menyalin pautan')
    }
  }

  async function copyWhatsAppMessage() {
    const message = `Assalamualaikum dan Salam Sejahtera,\n\nKami dengan sukacitanya menjemput tuan/puan ke majlis perkahwinan kami.\n\nSila klik pautan di bawah untuk melihat jemputan:\n${cardUrl}\n\nDaripada,\n${pelanggan.nama_pengantin_lelaki} & ${pelanggan.nama_pengantin_perempuan}`
    try {
      await navigator.clipboard.writeText(message)
      toast.success('Mesej berjaya disalin!')
    } catch {
      toast.error('Gagal menyalin mesej')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Kongsi
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif">Kongsi Kad Kahwin</DialogTitle>
          <DialogDescription>
            Kongsi jemputan kepada tetamu melalui pelbagai cara
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Card Link */}
          <div className="space-y-2">
            <Label>Pautan Kad Kahwin</Label>
            <div className="flex gap-2">
              <Input 
                value={cardUrl} 
                readOnly 
                className="font-mono text-sm"
              />
              <Button variant="outline" size="icon" onClick={copyToClipboard}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" asChild>
                <a href={cardUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          {/* QR Code */}
          <div className="space-y-2">
            <Label>Kod QR</Label>
            <div className="bg-white p-4 rounded-lg inline-block">
              <QRCode value={cardUrl} size={150} />
            </div>
            <p className="text-xs text-muted-foreground">
              Imbas kod QR untuk membuka kad kahwin
            </p>
          </div>

          {/* Share Options */}
          <div className="space-y-2">
            <Label>Kongsi Melalui</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                className="justify-start"
                asChild
              >
                <a 
                  href={`https://wa.me/?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp
                </a>
              </Button>
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={copyWhatsAppMessage}
              >
                <Copy className="h-4 w-4 mr-2" />
                Salin Mesej
              </Button>
            </div>
          </div>

          {/* Preview Message */}
          <div className="space-y-2">
            <Label>Contoh Mesej</Label>
            <div className="p-3 rounded-lg bg-muted text-sm whitespace-pre-wrap">
              {`Assalamualaikum dan Salam Sejahtera,

Kami dengan sukacitanya menjemput tuan/puan ke majlis perkahwinan kami.

Sila klik pautan di bawah untuk melihat jemputan:
${cardUrl}

Daripada,
${pelanggan.nama_pengantin_lelaki} & ${pelanggan.nama_pengantin_perempuan}`}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
