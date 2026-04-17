import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, Mail, Phone, Clock } from 'lucide-react'
import { PertanyaanActions } from '@/components/dashboard/pertanyaan-actions'
import type { Pertanyaan } from '@/lib/types'
import { formatDistanceToNow } from 'date-fns'
import { ms } from 'date-fns/locale'

export default async function PertanyaanPage() {
  const supabase = await createClient()

  const { data: pertanyaanList } = await supabase
    .from('pertanyaan')
    .select('*')
    .order('created_at', { ascending: false }) as { data: Pertanyaan[] | null }

  const baruCount = pertanyaanList?.filter(p => p.status === 'baru').length || 0
  const dibacaCount = pertanyaanList?.filter(p => p.status === 'dibaca').length || 0
  const selesaiCount = pertanyaanList?.filter(p => p.status === 'selesai').length || 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold">Pertanyaan</h1>
        <p className="text-muted-foreground">
          Urus pertanyaan daripada bakal pelanggan
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Baru</p>
                <p className="text-2xl font-bold text-yellow-600">{baruCount}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Dibaca</p>
                <p className="text-2xl font-bold text-blue-600">{dibacaCount}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Selesai</p>
                <p className="text-2xl font-bold text-green-600">{selesaiCount}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Semua Pertanyaan</CardTitle>
          <CardDescription>
            {pertanyaanList?.length || 0} pertanyaan dalam sistem
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pertanyaanList && pertanyaanList.length > 0 ? (
            <div className="space-y-4">
              {pertanyaanList.map((pertanyaan) => (
                <div
                  key={pertanyaan.id}
                  className={`p-4 rounded-lg border transition-colors ${
                    pertanyaan.status === 'baru' 
                      ? 'bg-yellow-50/50 border-yellow-200' 
                      : 'bg-card'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">{pertanyaan.nama}</span>
                        <Badge
                          variant={
                            pertanyaan.status === 'baru' 
                              ? 'default' 
                              : pertanyaan.status === 'dibaca' 
                              ? 'secondary' 
                              : 'outline'
                          }
                          className={
                            pertanyaan.status === 'baru'
                              ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
                              : pertanyaan.status === 'dibaca'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-green-100 text-green-700'
                          }
                        >
                          {pertanyaan.status === 'baru' ? 'Baru' : 
                           pertanyaan.status === 'dibaca' ? 'Dibaca' : 'Selesai'}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-foreground mb-3 whitespace-pre-wrap">
                        {pertanyaan.mesej}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        {pertanyaan.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="h-3.5 w-3.5" />
                            {pertanyaan.email}
                          </span>
                        )}
                        {pertanyaan.telefon && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3.5 w-3.5" />
                            {pertanyaan.telefon}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {formatDistanceToNow(new Date(pertanyaan.created_at), { 
                            addSuffix: true,
                            locale: ms 
                          })}
                        </span>
                      </div>
                    </div>
                    
                    <PertanyaanActions pertanyaan={pertanyaan} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium mb-2">Tiada pertanyaan</h3>
              <p className="text-sm text-muted-foreground">
                Pertanyaan daripada bakal pelanggan akan dipaparkan di sini
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
