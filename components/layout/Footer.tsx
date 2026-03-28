'use client'

import { Globe, Instagram, Mail, ArrowUpRight, Send } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const footerLinks = [
  {
    title: 'Keşfet',
    links: [
      { label: 'Ülkeler',  href: '#countries' },
      { label: 'Şehirler', href: '#cities'    },
      { label: 'Rotalar',  href: '#stories'   },
      { label: 'Harita',   href: '#map'       },
    ],
  },
  {
    title: 'Hakkında',
    links: [
      { label: 'Kimim?',    href: '#about'     },
      { label: 'Blog',      href: '#stories'   },
      { label: 'Instagram', href: 'https://instagram.com/yasayangezgin' },
      { label: 'İletişim',  href: 'mailto:hello@yasayangezgin.com' },
    ],
  },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
    }
  }

  return (
    <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-16 lg:py-20">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <Globe size={20} strokeWidth={1.5} className="text-gold" />
              <span className="font-serif text-xl font-semibold text-[var(--text-primary)]">
                Yaşayan<span className="text-gold"> Gezgin</span>
              </span>
            </div>
            <p className="font-serif text-xl italic text-[var(--text-secondary)] leading-relaxed mb-6 max-w-sm">
              "Seyahat etmek yaşamak değil;<br/>seyahat etmek bir yaşam biçimi."
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com/yasayangezgin"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium',
                  'bg-[var(--bg-tertiary)] text-[var(--text-primary)]',
                  'hover:bg-gold hover:text-white transition-all duration-300'
                )}
              >
                <Instagram size={14} />
                @yasayangezgin
              </a>
              <a
                href="mailto:hello@yasayangezgin.com"
                className={cn(
                  'w-9 h-9 rounded-full flex items-center justify-center',
                  'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]',
                  'hover:bg-gold hover:text-white transition-all duration-300'
                )}
              >
                <Mail size={14} />
              </a>
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-sans font-semibold uppercase tracking-widest text-[var(--text-tertiary)] mb-5">
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className={cn(
                        'group flex items-center gap-1.5 text-sm',
                        'text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
                        'transition-colors duration-200'
                      )}
                      {...(link.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      {link.label}
                      {link.href.startsWith('http') && (
                        <ArrowUpRight
                          size={12}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="border-t border-[var(--border)] py-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="font-serif text-lg font-medium text-[var(--text-primary)] mb-1">
                Yeni hikayelerden haberdar ol
              </p>
              <p className="text-sm text-[var(--text-secondary)]">
                Ayda bir, spam yok. Sadece gezi notları.
              </p>
            </div>
            {subscribed ? (
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-sage-pale text-sage text-sm font-medium">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Harika! Görüşürüz.
              </div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="flex items-center gap-2 bg-[var(--bg-primary)] border border-[var(--border)] rounded-full p-1.5 pl-5 w-full sm:w-auto"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@adresin.com"
                  required
                  className="bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none w-48"
                />
                <button
                  type="submit"
                  className="w-9 h-9 rounded-full bg-gold flex items-center justify-center text-white hover:bg-gold-dark transition-colors"
                >
                  <Send size={14} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[var(--border)] py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--text-tertiary)]">
          <span>© 2024 Yaşayan Gezgin. Tüm hakları saklıdır.</span>
          <span className="font-serif italic">Travel is living.</span>
        </div>
      </div>
    </footer>
  )
}
