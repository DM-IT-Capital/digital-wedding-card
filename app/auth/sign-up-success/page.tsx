import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, Mail, CheckCircle } from 'lucide-react'

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <CardTitle className="text-2xl font-serif">Pendaftaran Berjaya!</CardTitle>
            <CardDescription className="mt-2">
              Akaun anda telah berjaya didaftarkan
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-center gap-2 text-primary">
              <Mail className="w-5 h-5" />
              <span className="font-medium">Semak Emel Anda</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Kami telah menghantar emel pengesahan ke alamat emel anda. 
              Sila klik pautan dalam emel tersebut untuk mengaktifkan akaun anda.
            </p>
          </div>
          
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Selepas mengesahkan emel, anda boleh log masuk ke portal.
            </p>
            <Button asChild className="w-full">
              <Link href="/auth/login">
                <Heart className="mr-2 h-4 w-4" />
                Pergi ke Log Masuk
              </Link>
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground">
            Tidak menerima emel? Semak folder spam anda atau cuba daftar semula.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
