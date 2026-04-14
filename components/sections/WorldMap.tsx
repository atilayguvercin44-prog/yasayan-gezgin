'use client'

import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from '@/hooks/useInView'
import { useState } from 'react'
import { countries } from '@/data/countries'
import { Country } from '@/types'
import { MapPin, ArrowRight, X, Globe2, Calendar, Building2, MousePointer2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'

const MapChart = dynamic(() => import('./WorldMapInner'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-[#0D1B2A] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
        <span className="text-white/40 font-sans text-xs tracking-widest uppercase">Harita yükleniyor</span>
      </div>
    </div>
  ),
})

// ISO alpha-3 → site country id
const CODE_TO_ID: Record<string, string> = {
  GBR: 'uk', AZE: 'az', ROU: 'ro', EGY: 'eg', CZE: 'cz', AUT: 'at',
  SVK: 'sk', TUR: 'tr', CHE: 'ch', ITA: 'it', LIE: 'li', BHR: 'bh',
  NLD: 'nl', BEL: 'be', DEU: 'de', ESP: 'es', SWE: 'se', DNK: 'dk',
  GRC: 'gr', BGR: 'bg', MKD: 'mk', SRB: 'rs', BIH: 'ba', HRV: 'hr',
  MNE: 'me', ALB: 'al',
}

const ID_TO_CODE: Record<string, string> = Object.fromEntries(
  Object.entries(CODE_TO_ID).map(([k, v]) => [v, k])
)

const ALL_CODES = Object.keys(CODE_TO_ID)
const TOTAL_CITIES = countries.reduce((acc, c) => acc + c.cityCount, 0)

export default function WorldMap() {
  const { ref, isInView } = useInView<HTMLElement>({ threshold: 0.08 })
  const [selected, setSelected] = useState<Country | null>(null)

  const handleCountryClick = (code: string) => {
    const country = countries.find((c) => c.id === CODE_TO_ID[code])
    if (!country) return
    setSelected((prev) => (prev?.id === country.id ? null : country))
  }

  const selectedCode = selected ? (ID_TO_CODE[selected.id] ?? null) : null

  return (
    <section
      id="map"
      ref={ref}
      className="section-pad bg-[var(--bg-secondary)] overflow-hidden"
      aria-label="Dünya Haritası"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Header row */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8"
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-px bg-gold" />
              <span className="text-xs font-sans uppercase tracking-[0.3em] text-[var(--text-tertiary)]">
                Dünya Atlası
              </span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-light leading-[1.1] text-[var(--text-primary)]">
              Haritadan<br />
              <em className="text-gradient-gold font-medium">Keşfet</em>
            </h2>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-[var(--text-tertiary)] font-sans text-xs pb-1">
            <Globe2 size={12} className="text-gold" />
            <span>{countries.length} ülke · {TOTAL_CITIES}+ şehir · Tıkla ve keşfet</span>
          </div>
        </motion.div>

        {/* Map card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="relative rounded-3xl overflow-hidden shadow-strong"
          style={{ height: 'clamp(440px, 62vh, 660px)', background: '#0D1B2A' }}
        >
          {/* Map layer */}
          <MapChart
            visitedCountryCodes={ALL_CODES}
            selectedCode={selectedCode}
            onCountryClick={handleCountryClick}
          />

          {/* Legend — top left */}
          <div className="absolute top-5 left-5 z-20 flex flex-col gap-1.5 pointer-events-none">
            <div className="bg-black/50 backdrop-blur-sm rounded-xl px-3 py-2 flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-gold flex-shrink-0" />
              <span className="text-[11px] text-white/70 font-sans">Gezilen ülke</span>
            </div>
            <div className="bg-black/50 backdrop-blur-sm rounded-xl px-3 py-2 flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#2A3F52] flex-shrink-0" />
              <span className="text-[11px] text-white/70 font-sans">Gezilmedi</span>
            </div>
          </div>

          {/* Stats — top right (hide when panel open on mobile) */}
          <motion.div
            className="absolute top-5 right-5 z-20 flex gap-2"
            animate={{ opacity: selected ? 0 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-black/50 backdrop-blur-sm rounded-xl px-4 py-2.5 text-center">
              <p className="font-serif text-2xl font-semibold text-white leading-none">{countries.length}</p>
              <p className="text-[10px] text-white/50 font-sans uppercase tracking-wider mt-0.5">Ülke</p>
            </div>
            <div className="bg-black/50 backdrop-blur-sm rounded-xl px-4 py-2.5 text-center">
              <p className="font-serif text-2xl font-semibold text-white leading-none">{TOTAL_CITIES}+</p>
              <p className="text-[10px] text-white/50 font-sans uppercase tracking-wider mt-0.5">Şehir</p>
            </div>
          </motion.div>

          {/* Bottom hint */}
          <AnimatePresence>
            {!selected && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ delay: 0.6 }}
                className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
              >
                <div className="bg-black/55 backdrop-blur-sm rounded-full px-5 py-2.5 flex items-center gap-2.5">
                  <MousePointer2 size={13} className="text-gold" />
                  <span className="text-xs text-white/70 font-sans whitespace-nowrap">
                    Altın noktalara tıklayarak ülkeleri keşfet
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Slide-in country panel ── */}
          <AnimatePresence>
            {selected && (
              <motion.aside
                key={selected.id}
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 240 }}
                className={cn(
                  'absolute top-0 right-0 h-full z-30 overflow-y-auto',
                  'w-full sm:w-[340px] md:w-[360px]',
                  'bg-[var(--bg-primary)]/96 backdrop-blur-md',
                  'flex flex-col'
                )}
              >
                {/* Hero image */}
                <div className="relative w-full flex-shrink-0" style={{ height: '200px' }}>
                  <Image
                    src={selected.coverImage}
                    alt={selected.name}
                    fill
                    className="object-cover"
                    sizes="360px"
                  />
                  {/* gradient fade */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-black/20 to-transparent" />

                  {/* Close */}
                  <button
                    onClick={() => setSelected(null)}
                    className={cn(
                      'absolute top-3 right-3 w-8 h-8 rounded-full',
                      'bg-black/50 backdrop-blur-sm flex items-center justify-center',
                      'text-white/80 hover:text-white hover:bg-black/70',
                      'transition-colors duration-200'
                    )}
                    aria-label="Kapat"
                  >
                    <X size={14} />
                  </button>

                  {/* Flag + continent pill */}
                  <div className="absolute bottom-3 left-4 flex items-center gap-2">
                    <span className="text-3xl leading-none">{selected.flag}</span>
                    <span className="text-[11px] font-sans font-medium tracking-[0.15em] uppercase text-white/70 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-1">
                      {selected.continent}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="flex-1 px-5 pt-4 pb-6 flex flex-col gap-4">

                  {/* Title */}
                  <h3 className="font-serif text-[1.6rem] font-semibold leading-tight text-[var(--text-primary)]">
                    {selected.name}
                  </h3>

                  {/* Meta pills */}
                  <div className="flex gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-full px-3 py-1.5">
                      <Building2 size={11} className="text-gold" />
                      <span className="text-xs font-sans text-[var(--text-secondary)]">
                        {selected.cityCount} şehir
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-full px-3 py-1.5">
                      <Calendar size={11} className="text-gold" />
                      <span className="text-xs font-sans text-[var(--text-secondary)]">
                        {selected.visitedYear}'de gezdik
                      </span>
                    </div>
                  </div>

                  {/* Short description */}
                  <p className="font-sans text-sm leading-relaxed text-[var(--text-secondary)]">
                    {selected.shortDescription}
                  </p>

                  {/* Highlights */}
                  <div>
                    <p className="text-[10px] font-sans uppercase tracking-[0.2em] text-[var(--text-tertiary)] mb-2">
                      Öne Çıkanlar
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {selected.highlights.slice(0, 5).map((h) => (
                        <span
                          key={h}
                          className={cn(
                            'text-[11px] font-sans px-2.5 py-1 rounded-full',
                            'bg-gold/10 text-gold border border-gold/20'
                          )}
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="w-full h-px bg-[var(--border)]" />

                  {/* CTA */}
                  <Link
                    href={`/countries/${selected.slug}`}
                    className={cn(
                      'group flex items-center justify-between',
                      'w-full px-5 py-4 rounded-2xl',
                      'bg-[var(--text-primary)] text-[var(--bg-primary)]',
                      'font-sans text-sm font-medium tracking-wide',
                      'hover:shadow-gold transition-all duration-300',
                      'hover:scale-[1.02] active:scale-[0.98]'
                    )}
                  >
                    <span>Ülkeyi Keşfet</span>
                    <ArrowRight
                      size={16}
                      strokeWidth={2}
                      className="group-hover:translate-x-1 transition-transform duration-200"
                    />
                  </Link>

                  {/* All countries link */}
                  <p className="text-center text-xs text-[var(--text-tertiary)] font-sans">
                    veya{' '}
                    <button
                      onClick={() => setSelected(null)}
                      className="text-gold underline underline-offset-2 hover:no-underline"
                    >
                      haritaya dön
                    </button>
                  </p>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Country quick-select strip below map */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-5 flex flex-wrap gap-2 justify-center"
        >
          {countries.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelected((prev) => (prev?.id === c.id ? null : c))}
              className={cn(
                'flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-sans',
                'transition-all duration-200 border',
                selected?.id === c.id
                  ? 'bg-gold border-gold text-white shadow-gold'
                  : 'bg-[var(--bg-primary)] border-[var(--border)] text-[var(--text-secondary)] hover:border-gold/60 hover:text-gold'
              )}
            >
              <span className="text-sm leading-none">{c.flag}</span>
              <span>{c.name}</span>
            </button>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
