'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, X, Globe, Instagram } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { label: 'Ülkeler',  href: '#countries' },
  { label: 'Şehirler', href: '#cities'    },
  { label: 'Rotalar',  href: '#stories'   },
  { label: 'Harita',   href: '#map'       },
  { label: 'Hakkında', href: '#about'     },
]

export default function Header() {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const [theme, setTheme]         = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null
    const initial = saved ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    setTheme(initial)
    document.documentElement.setAttribute('data-theme', initial)
  }, [])

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    localStorage.setItem('theme', next)
    document.documentElement.setAttribute('data-theme', next)
  }

  const handleNav = (href: string) => {
    setMenuOpen(false)
    const el = document.querySelector(href)
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled
            ? 'bg-[var(--bg-primary)]/95 backdrop-blur-xl shadow-soft border-b border-[var(--border)]'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link
              href="/"
              className="group flex items-center gap-2.5"
              aria-label="Yaşayan Gezgin Ana Sayfa"
            >
              <Globe
                size={22}
                className="text-gold transition-transform duration-500 group-hover:rotate-180"
                strokeWidth={1.5}
              />
              <span
                className={cn(
                  'font-serif font-semibold text-xl tracking-tight',
                  'text-[var(--text-primary)] transition-colors duration-300'
                )}
              >
                Yaşayan<span className="text-gold"> Gezgin</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNav(link.href)}
                  className={cn(
                    'hover-underline text-sm font-sans font-medium tracking-wide',
                    'text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
                    'transition-colors duration-200'
                  )}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                aria-label="Tema değiştir"
                className={cn(
                  'w-9 h-9 rounded-full flex items-center justify-center',
                  'text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
                  'hover:bg-[var(--bg-secondary)] transition-all duration-200'
                )}
              >
                {theme === 'light' ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="5"/>
                    <line x1="12" y1="1" x2="12" y2="3"/>
                    <line x1="12" y1="21" x2="12" y2="23"/>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                    <line x1="1" y1="12" x2="3" y2="12"/>
                    <line x1="21" y1="12" x2="23" y2="12"/>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                  </svg>
                )}
              </button>

              {/* Instagram */}
              <a
                href="https://instagram.com/yasayangezgin"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className={cn(
                  'hidden sm:flex w-9 h-9 rounded-full items-center justify-center',
                  'text-[var(--text-secondary)] hover:text-[var(--accent-gold)]',
                  'hover:bg-[var(--bg-secondary)] transition-all duration-200'
                )}
              >
                <Instagram size={16} strokeWidth={1.5} />
              </a>

              {/* Mobile menu */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
                className={cn(
                  'lg:hidden w-9 h-9 rounded-full flex items-center justify-center',
                  'text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
                  'hover:bg-[var(--bg-secondary)] transition-all duration-200'
                )}
              >
                {menuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-40 bg-[var(--bg-primary)] lg:hidden flex flex-col"
          >
            <div className="flex-1 flex flex-col justify-center items-center gap-2 p-10">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 + 0.1 }}
                  onClick={() => handleNav(link.href)}
                  className={cn(
                    'font-serif text-4xl font-light tracking-tight py-2',
                    'text-[var(--text-primary)] hover:text-[var(--accent-gold)]',
                    'transition-colors duration-200'
                  )}
                >
                  {link.label}
                </motion.button>
              ))}
              <motion.a
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.08 + 0.2 }}
                href="https://instagram.com/yasayangezgin"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 flex items-center gap-2 text-[var(--accent-gold)] font-sans text-sm font-medium"
              >
                <Instagram size={16} />
                @yasayangezgin
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
