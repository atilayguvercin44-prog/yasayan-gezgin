'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Globe, Map, Building2, LayoutDashboard, ExternalLink, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin',           label: 'Dashboard',  icon: LayoutDashboard, exact: true },
  { href: '/admin/countries', label: 'Ülkeler',    icon: Map              },
  { href: '/admin/cities',    label: 'Şehirler',   icon: Building2        },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router   = useRouter()

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <aside className="fixed top-0 left-0 h-screen w-60 bg-[#1C1C1C] flex flex-col z-40">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <Globe size={18} strokeWidth={1.5} className="text-[#C4956A]" />
          <span className="font-serif text-lg font-semibold text-white">
            YG <span className="text-[#C4956A]">Admin</span>
          </span>
        </div>
        <p className="text-xs text-white/30 font-sans mt-1">Yönetim Paneli</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="text-xs text-white/20 uppercase tracking-widest font-sans px-3 mb-3">
          İçerik
        </p>
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const Icon   = item.icon
            const active = isActive(item.href, item.exact)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-sans font-medium',
                    'transition-all duration-200',
                    active
                      ? 'bg-[#C4956A] text-white'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  )}
                >
                  <Icon size={16} strokeWidth={1.5} />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Bottom actions */}
      <div className="px-3 py-4 border-t border-white/5 space-y-1">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-sans text-white/40 hover:text-white hover:bg-white/5 transition-all duration-200"
        >
          <ExternalLink size={15} strokeWidth={1.5} />
          Siteyi Görüntüle
        </a>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-sans text-white/40 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200"
        >
          <LogOut size={15} strokeWidth={1.5} />
          Çıkış Yap
        </button>
      </div>
    </aside>
  )
}
