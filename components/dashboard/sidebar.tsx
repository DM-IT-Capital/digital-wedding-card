'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Heart, LayoutDashboard, Users, Settings, MessageSquare, UserCog, Palette } from 'lucide-react'
import type { Creator } from '@/lib/types'

interface DashboardSidebarProps {
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

export function DashboardSidebar({ creator }: DashboardSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r bg-sidebar hidden lg:block">
      <div className="flex h-full flex-col">
        <nav className="flex-1 space-y-1 p-4">
          <div className="mb-4">
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
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </div>

          {creator.peranan === 'boss' && (
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 mb-2">
                Pengurusan
              </p>
              {bossNavigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          )}
        </nav>

        <div className="border-t p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Heart className="h-4 w-4 text-primary" />
            <span>Kad Kahwin Digital</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
