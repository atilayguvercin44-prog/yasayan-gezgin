'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Instagram, ChevronDown, Map, Compass } from 'lucide-react'
import { cn } from '@/lib/utils'

const TAGLINES = [
  'Rotaları Keşfet',
  'Şehirleri Yaşa',
  'Hikayeleri Oku',
  'Dünyayı Gör',
]

export default function Hero() {
  const [taglineIdx, setTaglineIdx] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    setLoaded(true)
    const id = setInterval(() => setTaglineIdx((i) => (i + 1) % TAGLINES.length), 3200)
    return () => clearInterval(id)
  }, [])

  const scrollDown = () => {
    document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToSection = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden grain-overlay"
      aria-label="Hero Bölümü"
    >
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        {/* Primary gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)] via-[var(--bg-primary)]/80 to-[var(--bg-primary)] z-10" />
        {/* Decorative circles */}
        <div className="absolute top-1/4 -right-40 w-[600px] h-[600px] rounded-full bg-gold/5 blur-[100px]" />
        <div className="absolute bottom-1/4 -left-40 w-[500px] h-[500px] rounded-full bg-sage/5 blur-[100px]" />
        {/* Grid dots pattern */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'radial-gradient(circle, var(--text-primary) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-5xl mx-auto px-6 lg:px-10 text-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2.5 mb-8"
        >
          <div className="w-8 h-px bg-gold" />
          <span className="text-xs font-sans font-medium uppercase tracking-[0.3em] text-[var(--text-tertiary)]">
            Travel is living
          </span>
          <div className="w-8 h-px bg-gold" />
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.4 }}
          className="font-serif text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-light leading-[0.95] tracking-tight text-[var(--text-primary)] mb-6"
        >
          Dünya Seninle<br />
          <span className="text-gradient-gold font-medium italic">
            Anlam Kazanır
          </span>
        </motion.h1>

        {/* Animated tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="h-10 flex items-center justify-center mb-10"
        >
          <motion.p
            key={taglineIdx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5 }}
            className="font-sans text-base sm:text-lg font-light text-[var(--text-secondary)] tracking-wide"
          >
            {TAGLINES[taglineIdx]}
          </motion.p>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="font-sans text-sm sm:text-base text-[var(--text-secondary)] max-w-xl mx-auto leading-relaxed mb-12"
        >
          Her şehirde bir hikaye, her yolda bir keşif. Ailecek gezdik, hissettik, yazdık.
          Bu bir gezi blogu değil — bir yaşam biçimi.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={() => scrollToSection('#countries')}
            className={cn(
              'group flex items-center gap-3 px-7 py-3.5 rounded-full',
              'bg-[var(--text-primary)] text-[var(--bg-primary)]',
              'font-sans text-sm font-medium tracking-wide',
              'hover:shadow-gold transition-all duration-300',
              'hover:scale-[1.02] active:scale-[0.98]'
            )}
          >
            <Map size={16} strokeWidth={1.5} />
            Rotaları Keşfet
          </button>

          <button
            onClick={() => scrollToSection('#cities')}
            className={cn(
              'group flex items-center gap-3 px-7 py-3.5 rounded-full',
              'border border-[var(--border)] text-[var(--text-primary)]',
              'font-sans text-sm font-medium tracking-wide',
              'hover:border-gold hover:text-gold',
              'transition-all duration-300'
            )}
          >
            <Compass size={16} strokeWidth={1.5} />
            Şehirleri Gör
          </button>

          <a
            href="https://instagram.com/yasayangezgin"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'group flex items-center gap-2.5 px-7 py-3.5 rounded-full',
              'text-[var(--text-secondary)] hover:text-[var(--accent-gold)]',
              'font-sans text-sm font-medium tracking-wide',
              'transition-colors duration-200'
            )}
          >
            <Instagram size={16} strokeWidth={1.5} />
            Instagram
          </a>
        </motion.div>

        {/* Stats preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="flex items-center justify-center gap-10 mt-16 pt-10 border-t border-[var(--border)]"
        >
          {[
            { number: '7+', label: 'Ülke' },
            { number: '20+', label: 'Şehir' },
            { number: '50+', label: 'Hikaye' },
            { number: '∞', label: 'Anı' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-serif text-2xl font-semibold text-[var(--text-primary)]">
                {stat.number}
              </div>
              <div className="font-sans text-xs text-[var(--text-tertiary)] uppercase tracking-widest mt-0.5">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollDown}
        initial={{ opacity: 0 }}
        animate={loaded ? { opacity: 1 } : {}}
        transition={{ delay: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-[var(--text-tertiary)] hover:text-gold transition-colors duration-200"
        aria-label="Aşağı kaydır"
      >
        <span className="text-xs font-sans tracking-widest uppercase">Keşfet</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={18} strokeWidth={1.5} />
        </motion.div>
      </motion.button>
    </section>
  )
}
