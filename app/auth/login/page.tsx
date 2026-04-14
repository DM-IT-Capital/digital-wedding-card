'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Heart, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // This is important - include cookies
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error('Gagal log masuk', {
          description: data.error || 'Berlaku ralat'
        })
        setLoading(false)
        return
      }

      toast.success('Berjaya log masuk!')
      // Full page navigation to ensure middleware processes cookies
      window.location.href = '/dashboard'
    } catch (err) {
      toast.error('Ralat', {
        description: err instanceof Error ? err.message : 'Berlaku ralat nilai tidak terduga'
      })
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Heart className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl font-serif">Portal Kad Kahwin</CardTitle>
            <CardDescription className="mt-2">
              Log masuk untuk mengurus kad kahwin digital anda
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
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
              <Label htmlFor="password">Kata Laluan</Label>
              <Input
                id="password"
                type="password"
                placeholder="Masukkan kata laluan"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sedang log masuk...
                </>
              ) : (
                'Log Masuk'
              )}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-muted-foreground hover:text-primary underline underline-offset-4">
              Kembali ke laman utama
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
