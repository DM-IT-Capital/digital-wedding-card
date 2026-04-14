import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { UserPlus, User, Mail, Phone, Shield } from 'lucide-react'
import { AddStaffDialog } from '@/components/dashboard/add-staff-dialog'
import type { Creator } from '@/lib/types'

export default async function StaffPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Check if current user is boss
  const { data: currentCreator } = await supabase
    .from('creators')
    .select('*')
    .eq('id', user?.id)
    .single() as { data: Creator | null }

  if (!currentCreator || currentCreator.peranan !== 'boss') {
    redirect('/dashboard')
  }

  // Get all creators
  const { data: staffList } = await supabase
    .from('creators')
    .select('*')
    .order('created_at', { ascending: false }) as { data: Creator[] | null }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold">Pengurusan Staff</h1>
          <p className="text-muted-foreground">
            Urus akaun staff yang boleh mengakses portal
          </p>
        </div>
        <AddStaffDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Senarai Staff</CardTitle>
          <CardDescription>
            {staffList?.length || 0} pengguna dalam sistem
          </CardDescription>
        </CardHeader>
        <CardContent>
          {staffList && staffList.length > 0 ? (
            <div className="space-y-4">
              {staffList.map((staff) => (
                <div
                  key={staff.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{staff.nama}</span>
                        <Badge 
                          variant={staff.peranan === 'boss' ? 'default' : 'secondary'}
                          className={staff.peranan === 'boss' ? 'bg-primary' : ''}
                        >
                          {staff.peranan === 'boss' ? (
                            <>
                              <Shield className="h-3 w-3 mr-1" />
                              Pentadbir
                            </>
                          ) : (
                            'Staff'
                          )}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3.5 w-3.5" />
                          {staff.email}
                        </span>
                        {staff.telefon && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3.5 w-3.5" />
                            {staff.telefon}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {staff.id === currentCreator.id && (
                    <span className="text-xs text-muted-foreground">(Anda)</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <UserPlus className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium mb-2">Tiada staff lain</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Tambah staff untuk membantu mengurus kad kahwin
              </p>
              <AddStaffDialog />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Panduan Peranan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5">
            <Shield className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium">Pentadbir (Boss)</p>
              <p className="text-sm text-muted-foreground">
                Boleh mengurus semua pelanggan, staff, tetapan perniagaan dan melihat semua pertanyaan
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <User className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Staff</p>
              <p className="text-sm text-muted-foreground">
                Boleh menambah dan mengurus pelanggan sendiri sahaja, serta melihat pertanyaan
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
