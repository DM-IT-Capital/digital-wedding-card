'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Heart, 
  MapPin, 
  Calendar, 
  Clock, 
  Navigation, 
  MessageCircle, 
  Gift, 
  Music, 
  ChevronDown,
  Share2,
  Copy,
  ExternalLink
} from 'lucide-react'
import type { Pelanggan, Media, Tetapan } from '@/lib/types'
import { format, differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns'
import { ms } from 'date-fns/locale'
import Image from 'next/image'
import { toast } from 'sonner'
import { isCustomDesignValue } from '@/lib/design'

interface WeddingCardProps {
  pelanggan: Pelanggan
  media: Media[]
  tetapan: Tetapan | null
}

function Countdown({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const days = differenceInDays(targetDate, now)
      const hours = differenceInHours(targetDate, now) % 24
      const minutes = differenceInMinutes(targetDate, now) % 60
      const seconds = differenceInSeconds(targetDate, now) % 60

      if (days < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      } else {
        setTimeLeft({ days, hours, minutes, seconds })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-md mx-auto">
      {[
        { value: timeLeft.days, label: 'Hari' },
        { value: timeLeft.hours, label: 'Jam' },
        { value: timeLeft.minutes, label: 'Minit' },
        { value: timeLeft.seconds, label: 'Saat' },
      ].map((item) => (
        <div key={item.label} className="text-center">
          <div className="bg-white/80 backdrop-blur rounded-lg p-2 sm:p-4 shadow-sm">
            <span className="text-2xl sm:text-4xl font-serif font-bold text-primary">
              {String(item.value).padStart(2, '0')}
            </span>
          </div>
          <p className="text-xs sm:text-sm mt-1 text-foreground/70">{item.label}</p>
        </div>
      ))}
    </div>
  )
}

export function WeddingCard({ pelanggan, media, tetapan }: WeddingCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)

  const couplePhoto = media.find(m => m.jenis === 'foto_pengantin')
  const galleryPhotos = media.filter(m => m.jenis === 'foto_galeri')
  const qrDuitnow = media.find(m => m.jenis === 'qr_duitnow')
  const customDesignUrl = isCustomDesignValue(pelanggan.template) ? pelanggan.template : null

  // Get the main event date for countdown
  const mainEventDate = pelanggan.tarikh_sanding_perempuan || pelanggan.tarikh_sanding_lelaki || pelanggan.tarikh_nikah
  const countdownDate = mainEventDate ? new Date(mainEventDate) : null

  // Format date function
  function formatMalayDate(dateStr: string | null) {
    if (!dateStr) return null
    const date = new Date(dateStr)
    return format(date, "EEEE, d MMMM yyyy", { locale: ms })
  }

  // Format time function
  function formatTime(timeStr: string | null) {
    if (!timeStr) return null
    const [hours, minutes] = timeStr.split(':')
    return `${hours}:${minutes}`
  }

  async function handleShare() {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${pelanggan.nama_pengantin_lelaki} & ${pelanggan.nama_pengantin_perempuan}`,
          text: `Jemputan ke majlis perkahwinan kami`,
          url,
        })
      } catch {
        // User cancelled
      }
    } else {
      navigator.clipboard.writeText(url)
      toast.success('Pautan berjaya disalin!')
    }
  }

  if (!isOpen) {
    return (
      <div 
        className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-primary/10 via-background to-primary/5"
        style={{ 
          '--primary-color': pelanggan.tema_warna,
        } as React.CSSProperties}
      >
        <div className="text-center space-y-6 max-w-md">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
            <div className="relative">
              {customDesignUrl ? (
                <div className="mb-6 overflow-hidden rounded-3xl border border-primary/10 bg-white shadow-xl">
                  <img
                    src={customDesignUrl}
                    alt={`Rekaan ${pelanggan.nama_pengantin_lelaki} dan ${pelanggan.nama_pengantin_perempuan}`}
                    className="max-h-[70vh] w-full object-contain"
                  />
                </div>
              ) : null}
              <Heart className="h-16 w-16 mx-auto text-primary mb-4" />
              <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-2">
                Walimatul Urus
              </p>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
                {pelanggan.nama_pengantin_lelaki}
              </h1>
              <p className="text-2xl sm:text-3xl font-serif text-primary my-2">&</p>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
                {pelanggan.nama_pengantin_perempuan}
              </h1>
            </div>
          </div>

          {countdownDate && (
            <div className="pt-4">
              <p className="text-sm text-muted-foreground mb-4">
                {formatMalayDate(mainEventDate)}
              </p>
            </div>
          )}

          <Button
            size="lg"
            onClick={() => setIsOpen(true)}
            className="gap-2 animate-bounce"
          >
            Buka Jemputan
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-primary/10"
      style={{ 
        '--primary-color': pelanggan.tema_warna,
      } as React.CSSProperties}
    >
      {customDesignUrl ? (
        <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
          <div className="overflow-hidden rounded-3xl border bg-white shadow-xl">
            <img
              src={customDesignUrl}
              alt={`Rekaan ${pelanggan.nama_pengantin_lelaki} dan ${pelanggan.nama_pengantin_perempuan}`}
              className="w-full object-contain"
            />
          </div>

          <div className="mx-auto mt-8 max-w-xl space-y-4 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
              {pelanggan.nama_pengantin_lelaki} & {pelanggan.nama_pengantin_perempuan}
            </p>

            {pelanggan.whatsapp_rsvp ? (
              <Button size="lg" asChild>
                <a
                  href={`https://wa.me/${pelanggan.whatsapp_rsvp.replace(/\D/g, '')}?text=${encodeURIComponent(`Assalamualaikum, saya ingin mengesahkan kehadiran ke majlis perkahwinan ${pelanggan.nama_pengantin_lelaki} & ${pelanggan.nama_pengantin_perempuan}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  RSVP melalui WhatsApp
                </a>
              </Button>
            ) : null}

            <div>
              <Button variant="outline" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                Kongsi Jemputan
              </Button>
            </div>

            {tetapan ? (
              <p className="text-xs text-muted-foreground">
                Dikuasakan oleh {tetapan.nama_perniagaan}
              </p>
            ) : null}
          </div>
        </div>
      ) : (
      <>
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border border-primary/30 rounded-full" />
          <div className="absolute bottom-20 right-10 w-48 h-48 border border-primary/20 rounded-full" />
          <div className="absolute top-1/2 left-1/4 w-24 h-24 border border-primary/20 rounded-full" />
        </div>

        <div className="text-center space-y-6 max-w-lg relative z-10">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
            Walimatul Urus
          </p>

          {couplePhoto && (
            <div className="relative w-48 h-48 sm:w-64 sm:h-64 mx-auto rounded-full overflow-hidden border-4 border-primary/20 shadow-xl">
              <Image
                src={couplePhoto.url}
                alt="Foto Pengantin"
                fill
                className="object-cover"
              />
            </div>
          )}

          <div>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-foreground">
              {pelanggan.nama_pengantin_lelaki}
            </h1>
            <Heart className="h-8 w-8 mx-auto text-primary my-3 fill-primary/30" />
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-foreground">
              {pelanggan.nama_pengantin_perempuan}
            </h1>
          </div>

          {pelanggan.ucapan_alu_aluan && (
            <p className="text-muted-foreground italic max-w-md mx-auto">
              {`"${pelanggan.ucapan_alu_aluan}"`}
            </p>
          )}

          {countdownDate && countdownDate > new Date() && (
            <div className="pt-6">
              <p className="text-sm text-muted-foreground mb-4">Menghitung Hari</p>
              <Countdown targetDate={countdownDate} />
            </div>
          )}

          <ChevronDown className="h-6 w-6 mx-auto text-muted-foreground animate-bounce mt-8" />
        </div>
      </section>

      {/* Parents Section */}
      <section className="py-16 px-4 bg-card/50">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm uppercase tracking-wider text-muted-foreground mb-8">
            Dengan penuh kesyukuran, kami menjemput anda ke majlis perkahwinan putera dan puteri kami
          </p>
          
          <div className="grid sm:grid-cols-2 gap-8">
            {/* Groom's Parents */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Putera kepada</p>
              <p className="font-serif text-lg">{pelanggan.nama_bapa_lelaki || '-'}</p>
              <p className="text-muted-foreground">&</p>
              <p className="font-serif text-lg">{pelanggan.nama_ibu_lelaki || '-'}</p>
            </div>

            {/* Bride's Parents */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Puteri kepada</p>
              <p className="font-serif text-lg">{pelanggan.nama_bapa_perempuan || '-'}</p>
              <p className="text-muted-foreground">&</p>
              <p className="font-serif text-lg">{pelanggan.nama_ibu_perempuan || '-'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-serif font-bold text-center mb-8">Aturcara Majlis</h2>
          
          <div className="space-y-6">
            {/* Nikah */}
            {pelanggan.tarikh_nikah && (
              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Heart className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-serif font-semibold">Majlis Akad Nikah</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatMalayDate(pelanggan.tarikh_nikah)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    {pelanggan.masa_nikah && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{formatTime(pelanggan.masa_nikah)}</span>
                      </div>
                    )}
                    {pelanggan.lokasi_nikah && (
                      <div className="flex items-start gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4 mt-0.5" />
                        <div>
                          <p className="font-medium text-foreground">{pelanggan.lokasi_nikah}</p>
                          {pelanggan.alamat_nikah && <p>{pelanggan.alamat_nikah}</p>}
                        </div>
                      </div>
                    )}
                  </div>

                  {(pelanggan.google_maps_nikah || pelanggan.waze_nikah) && (
                    <div className="flex gap-2 mt-4">
                      {pelanggan.google_maps_nikah && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={pelanggan.google_maps_nikah} target="_blank" rel="noopener noreferrer">
                            <Navigation className="h-4 w-4 mr-2" />
                            Google Maps
                          </a>
                        </Button>
                      )}
                      {pelanggan.waze_nikah && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={pelanggan.waze_nikah} target="_blank" rel="noopener noreferrer">
                            <Navigation className="h-4 w-4 mr-2" />
                            Waze
                          </a>
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Sanding Lelaki */}
            {pelanggan.tarikh_sanding_lelaki && (
              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-serif font-semibold">Majlis Resepsi (Pihak Lelaki)</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatMalayDate(pelanggan.tarikh_sanding_lelaki)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    {(pelanggan.masa_mula_sanding_lelaki || pelanggan.masa_tamat_sanding_lelaki) && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>
                          {formatTime(pelanggan.masa_mula_sanding_lelaki)}
                          {pelanggan.masa_tamat_sanding_lelaki && ` - ${formatTime(pelanggan.masa_tamat_sanding_lelaki)}`}
                        </span>
                      </div>
                    )}
                    {pelanggan.lokasi_sanding_lelaki && (
                      <div className="flex items-start gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4 mt-0.5" />
                        <div>
                          <p className="font-medium text-foreground">{pelanggan.lokasi_sanding_lelaki}</p>
                          {pelanggan.alamat_sanding_lelaki && <p>{pelanggan.alamat_sanding_lelaki}</p>}
                        </div>
                      </div>
                    )}
                  </div>

                  {(pelanggan.google_maps_sanding_lelaki || pelanggan.waze_sanding_lelaki) && (
                    <div className="flex gap-2 mt-4">
                      {pelanggan.google_maps_sanding_lelaki && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={pelanggan.google_maps_sanding_lelaki} target="_blank" rel="noopener noreferrer">
                            <Navigation className="h-4 w-4 mr-2" />
                            Google Maps
                          </a>
                        </Button>
                      )}
                      {pelanggan.waze_sanding_lelaki && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={pelanggan.waze_sanding_lelaki} target="_blank" rel="noopener noreferrer">
                            <Navigation className="h-4 w-4 mr-2" />
                            Waze
                          </a>
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Sanding Perempuan */}
            {pelanggan.tarikh_sanding_perempuan && (
              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-serif font-semibold">Majlis Resepsi (Pihak Perempuan)</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatMalayDate(pelanggan.tarikh_sanding_perempuan)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    {(pelanggan.masa_mula_sanding_perempuan || pelanggan.masa_tamat_sanding_perempuan) && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>
                          {formatTime(pelanggan.masa_mula_sanding_perempuan)}
                          {pelanggan.masa_tamat_sanding_perempuan && ` - ${formatTime(pelanggan.masa_tamat_sanding_perempuan)}`}
                        </span>
                      </div>
                    )}
                    {pelanggan.lokasi_sanding_perempuan && (
                      <div className="flex items-start gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4 mt-0.5" />
                        <div>
                          <p className="font-medium text-foreground">{pelanggan.lokasi_sanding_perempuan}</p>
                          {pelanggan.alamat_sanding_perempuan && <p>{pelanggan.alamat_sanding_perempuan}</p>}
                        </div>
                      </div>
                    )}
                  </div>

                  {(pelanggan.google_maps_sanding_perempuan || pelanggan.waze_sanding_perempuan) && (
                    <div className="flex gap-2 mt-4">
                      {pelanggan.google_maps_sanding_perempuan && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={pelanggan.google_maps_sanding_perempuan} target="_blank" rel="noopener noreferrer">
                            <Navigation className="h-4 w-4 mr-2" />
                            Google Maps
                          </a>
                        </Button>
                      )}
                      {pelanggan.waze_sanding_perempuan && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={pelanggan.waze_sanding_perempuan} target="_blank" rel="noopener noreferrer">
                            <Navigation className="h-4 w-4 mr-2" />
                            Waze
                          </a>
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Dress Code Section */}
      {pelanggan.dress_code && (
        <section className="py-12 px-4 bg-card/50">
          <div className="max-w-md mx-auto text-center">
            <h2 className="text-xl font-serif font-bold mb-4">Dress Code</h2>
            <p className="text-muted-foreground mb-2">{pelanggan.dress_code}</p>
            {pelanggan.dress_code_warna && (
              <div className="flex items-center justify-center gap-2">
                <div 
                  className="w-8 h-8 rounded-full border-2 border-foreground/20"
                  style={{ backgroundColor: pelanggan.dress_code_warna }}
                />
                <span className="text-sm text-muted-foreground">{pelanggan.dress_code_warna}</span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Gallery Section */}
      {galleryPhotos.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-serif font-bold text-center mb-8">Galeri</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryPhotos.map((photo) => (
                <div key={photo.id} className="aspect-square relative rounded-lg overflow-hidden shadow-md">
                  <Image
                    src={photo.url}
                    alt={photo.caption || 'Foto galeri'}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Money Gift Section */}
      {pelanggan.enable_money_gift && (pelanggan.nama_bank || qrDuitnow) && (
        <section className="py-16 px-4 bg-card/50">
          <div className="max-w-md mx-auto text-center">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Gift className="h-7 w-7 text-primary" />
            </div>
            <h2 className="text-2xl font-serif font-bold mb-2">Hadiah Tunai</h2>
            <p className="text-muted-foreground mb-6">
              Sekiranya tuan/puan ingin memberikan sumbangan ikhlas
            </p>

            {pelanggan.nama_bank && (
              <Card className="mb-4">
                <CardContent className="p-6 text-left">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bank</span>
                      <span className="font-medium">{pelanggan.nama_bank}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">No. Akaun</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium font-mono">{pelanggan.nombor_akaun}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => {
                            navigator.clipboard.writeText(pelanggan.nombor_akaun || '')
                            toast.success('No. akaun berjaya disalin!')
                          }}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Nama</span>
                      <span className="font-medium">{pelanggan.nama_pemilik_akaun}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {qrDuitnow && (
              <div className="bg-white p-4 rounded-lg inline-block">
                <Image
                  src={qrDuitnow.url}
                  alt="QR DuitNow"
                  width={200}
                  height={200}
                  className="mx-auto"
                />
                <p className="text-xs text-muted-foreground mt-2">Imbas untuk DuitNow</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* RSVP Section */}
      <section className="py-16 px-4">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-serif font-bold mb-4">Sahkan Kehadiran</h2>
          <p className="text-muted-foreground mb-6">
            Sila sahkan kehadiran anda melalui WhatsApp
          </p>

          {pelanggan.whatsapp_rsvp && (
            <Button size="lg" asChild>
              <a 
                href={`https://wa.me/${pelanggan.whatsapp_rsvp.replace(/\D/g, '')}?text=${encodeURIComponent(`Assalamualaikum, saya ingin mengesahkan kehadiran ke majlis perkahwinan ${pelanggan.nama_pengantin_lelaki} & ${pelanggan.nama_pengantin_perempuan}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                RSVP melalui WhatsApp
              </a>
            </Button>
          )}

          {!pelanggan.whatsapp_rsvp && (pelanggan.telefon_pengantin_lelaki || pelanggan.telefon_pengantin_perempuan) && (
            <div className="space-y-2">
              {pelanggan.telefon_pengantin_lelaki && (
                <Button variant="outline" asChild>
                  <a 
                    href={`https://wa.me/${pelanggan.telefon_pengantin_lelaki.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Hubungi Pengantin Lelaki
                  </a>
                </Button>
              )}
              {pelanggan.telefon_pengantin_perempuan && (
                <Button variant="outline" asChild>
                  <a 
                    href={`https://wa.me/${pelanggan.telefon_pengantin_perempuan.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Hubungi Pengantin Perempuan
                  </a>
                </Button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Spotify Playlist */}
      {pelanggan.spotify_playlist && (
        <section className="py-12 px-4 bg-card/50">
          <div className="max-w-md mx-auto text-center">
            <Music className="h-8 w-8 mx-auto text-primary mb-4" />
            <h2 className="text-xl font-serif font-bold mb-4">Playlist Kami</h2>
            <Button variant="outline" asChild>
              <a href={pelanggan.spotify_playlist} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Dengar di Spotify
              </a>
            </Button>
          </div>
        </section>
      )}

      {/* Hashtag */}
      {pelanggan.hashtag_wedding && (
        <section className="py-12 px-4">
          <div className="text-center">
            <p className="text-muted-foreground mb-2">Kongsi momen bersama kami</p>
            <p className="text-2xl font-serif font-bold text-primary">
              #{pelanggan.hashtag_wedding}
            </p>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 px-4 bg-primary/5">
        <div className="max-w-md mx-auto text-center">
          <Heart className="h-8 w-8 mx-auto text-primary mb-4 fill-primary/30" />
          <p className="font-serif text-xl mb-4">
            {pelanggan.nama_pengantin_lelaki} & {pelanggan.nama_pengantin_perempuan}
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Kami menanti kehadiran anda dengan penuh rasa kesyukuran
          </p>
          
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Kongsi Jemputan
          </Button>

          {tetapan && (
            <p className="text-xs text-muted-foreground mt-8">
              Dikuasakan oleh {tetapan.nama_perniagaan}
            </p>
          )}
        </div>
      </footer>
      </>
      )}
    </div>
  )
}
