'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Heart, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function SignUpPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nama, setNama] = useState('')
  const [telefon, setTelefon] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    
    // Check if this is the first user (will be boss)
    const { count } = await supabase
      .from('creators')
      .select('*', { count: 'exact', head: true })
    
    const isFirstUser = count === 0
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? 
          `${window.location.origin}/auth/callback`,
        data: {
          nama: nama,
          peranan: isFirstUser ? 'boss' : 'staff',
          telefon: telefon || null,
        },
      },
    })

    if (error) {
      toast.error('Gagal mendaftar', {
        description: error.message === 'User already registered' 
          ? 'Emel ini sudah didaftarkan' 
          : error.message
      })
      setLoading(false)
      return
    }

    toast.success('Berjaya mendaftar!', {
      description: 'Sila semak emel anda untuk pengesahan akaun.'
    })
    router.push('/auth/sign-up-success')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Heart className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl font-serif">Daftar Akaun Baru</CardTitle>
            <CardDescription className="mt-2">
              Cipta akaun untuk mengurus kad kahwin digital
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nama">Nama Penuh</Label>
              <Input
                id="nama"
                type="text"
                placeholder="Nama anda"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Emel</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@contoh.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefon">No. Telefon (Pilihan)</Label>
              <Input
                id="telefon"
                type="tel"
                placeholder="012-3456789"
                value={telefon}
                onChange={(e) => setTelefon(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Kata Laluan</Label>
              <Input
                id="password"
                type="password"
                placeholder="Minimum 6 aksara"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sedang mendaftar...
                </>
              ) : (
                'Daftar Sekarang'
              )}
            </Button>
          </form>
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Sudah ada akaun?{' '}
              <Link href="/auth/login" className="text-primary hover:underline underline-offset-4">
                Log masuk di sini
              </Link>
            </p>
            <Link href="/" className="text-sm text-muted-foreground hover:text-primary underline underline-offset-4">
              Kembali ke laman utama
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
