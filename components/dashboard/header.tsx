'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Heart, Menu, User, LogOut, LayoutDashboard, Users, Settings, MessageSquare, UserCog, Palette } from 'lucide-react'
import { toast } from 'sonner'
import type { Creator } from '@/lib/types'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

interface DashboardHeaderProps {
  creator: Creator
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Pelanggan', href: '/dashboard/pelanggan', icon: Users },
  { name: 'Rekaan', href: '/dashboard/rekaan', icon: Palette },
  { name: 'Pertanyaan', href: '/dashboard/pertanyaan', icon: MessageSquare },
]

const bossNavigation = [
  { name: 'Pengurusan Staff', href: '/dashboard/staff', icon: UserCog },
  { name: 'Tetapan', href: '/dashboard/tetapan', icon: Settings },
]

export function DashboardHeader({ creator }: DashboardHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast.success('Berjaya log keluar')
    router.push('/')
    router.refresh()
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="flex h-full items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-4">
          {/* Mobile menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Buka menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="flex h-full flex-col">
                <div className="flex items-center gap-2 border-b p-4">
                  <Heart className="h-6 w-6 text-primary" />
                  <span className="font-serif font-semibold">Portal Kad Kahwin</span>
                </div>
                <nav className="flex-1 space-y-1 p-4">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 mb-2">
                    Menu Utama
                  </p>
                  {navigation.map((item) => {
                    const isActive = pathname === item.href || 
                      (item.href !== '/dashboard' && pathname.startsWith(item.href))
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-accent text-accent-foreground'
                            : 'text-foreground hover:bg-accent/50'
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.name}
                      </Link>
                    )
                  })}
                  
                  {creator.peranan === 'boss' && (
                    <>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 mb-2 mt-4">
                        Pengurusan
                      </p>
                      {bossNavigation.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href)
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={cn(
                              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                              isActive
                                ? 'bg-accent text-accent-foreground'
                                : 'text-foreground hover:bg-accent/50'
                            )}
                          >
                            <item.icon className="h-5 w-5" />
                            {item.name}
                          </Link>
                        )
                      })}
                    </>
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/dashboard" className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="font-serif font-semibold hidden sm:inline">Portal Kad Kahwin</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <span className="hidden sm:inline">{creator.nama}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>{creator.nama}</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    {creator.peranan === 'boss' ? 'Pentadbir' : 'Staff'}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profil">
                  <User className="mr-2 h-4 w-4" />
                  Profil Saya
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Log Keluar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
