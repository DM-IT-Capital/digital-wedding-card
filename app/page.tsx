import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Heart, Sparkles, Share2, Palette, MessageCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { EnquiryDialog } from '@/components/enquiry-dialog'

export default async function HomePage() {
  const supabase = await createClient()
  
  // Get business settings
  const { data: tetapan } = await supabase
    .from('tetapan')
    .select('*')
    .single()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-primary" />
            <span className="font-serif text-xl font-semibold">
              {tetapan?.nama_perniagaan || 'Kad Kahwin Digital'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <EnquiryDialog tetapan={tetapan} />
            <Button asChild variant="outline">
              <Link href="/auth/login">Log Masuk</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container mx-auto px-4 text-center relative">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Kad Kahwin Digital Moden</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-6 text-balance">
            Cipta Kad Kahwin Digital yang Menawan
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 text-pretty">
            Kongsi kebahagiaan hari istimewa anda dengan kad kahwin digital yang cantik, 
            mudah dikongsi dan mesra alam.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <EnquiryDialog tetapan={tetapan} variant="default" size="lg" />
            <Button variant="outline" size="lg" asChild>
              <Link href="/auth/login">Portal Kreator</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Kenapa Pilih Kami?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Kami menyediakan perkhidmatan kad kahwin digital yang lengkap dan berkualiti
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Palette className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Rekaan Menarik</h3>
                <p className="text-muted-foreground text-sm">
                  Pelbagai tema dan warna yang boleh disesuaikan mengikut citarasa anda
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Share2 className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Mudah Dikongsi</h3>
                <p className="text-muted-foreground text-sm">
                  Kongsi melalui WhatsApp, media sosial atau pautan terus kepada tetamu
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">RSVP WhatsApp</h3>
                <p className="text-muted-foreground text-sm">
                  Tetamu boleh mengesahkan kehadiran terus melalui WhatsApp
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-primary/5 rounded-3xl p-8 md:p-12 max-w-3xl mx-auto">
            <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4">
              Bersedia untuk Majlis Anda?
            </h2>
            <p className="text-muted-foreground mb-6">
              Hubungi kami sekarang untuk mendapatkan kad kahwin digital impian anda
            </p>
            <EnquiryDialog tetapan={tetapan} variant="default" size="lg" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-card">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              <span className="font-serif font-semibold">
                {tetapan?.nama_perniagaan || 'Kad Kahwin Digital'}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {tetapan?.whatsapp_perniagaan && (
                <a 
                  href={`https://wa.me/${tetapan.whatsapp_perniagaan.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  WhatsApp
                </a>
              )}
              {tetapan?.instagram_url && (
                <a 
                  href={tetapan.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  Instagram
                </a>
              )}
              {tetapan?.facebook_url && (
                <a 
                  href={tetapan.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  Facebook
                </a>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Hak Cipta Terpelihara
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
