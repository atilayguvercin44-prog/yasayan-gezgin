'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { useInView } from '@/hooks/useInView'
import { useState } from 'react'
import { countries } from '@/data/countries'
import { Country } from '@/types'
import { MapPin, X } from 'lucide-react'
import { cn } from '@/lib/utils'

// Dynamically import the actual map to avoid SSR issues
const MapChartInner = dynamic(() => import('./WorldMapInner'), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-[2/1] bg-[var(--bg-tertiary)] rounded-3xl animate-pulse flex items-center justify-center">
      <p className="text-[var(--text-tertiary)] font-sans text-sm">Harita yükleniyor…</p>
    </div>
  ),
})

export default function WorldMap() {
  const { ref, isInView } = useInView<HTMLElement>({ threshold: 0.1 })
  const [selected, setSelected] = useState<Country | null>(null)

  return (
    <section
      id="map"
      ref={ref}
      className="section-pad bg-[var(--bg-secondary)] overflow-hidden"
      aria-label="Dünya Haritası"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-gold" />
            <span className="text-xs font-sans uppercase tracking-[0.3em] text-[var(--text-tertiary)]">
              Atlas
            </span>
            <div className="w-8 h-px bg-gold" />
          </div>
          <h2 className="font-serif text-5xl md:text-6xl font-light leading-[1.1] text-[var(--text-primary)] mb-4">
            Gezdiğimiz<br />
            <em className="text-gradient-gold font-medium">Dünya</em>
          </h2>
          <p className="font-sans text-sm text-[var(--text-secondary)] max-w-md mx-auto">
            Harita üzerindeki noktaları keşfedin. Her nokta bir hikaye.
          </p>
        </motion.div>

        {/* Map container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="relative rounded-3xl overflow-hidden bg-[#0F1923] shadow-strong"
          style={{ minHeight: '420px' }}
        >
          <MapChartInner
            visitedCountryCodes={['GBR', 'NLD', 'FRA', 'ESP', 'DEU', 'TUR', 'USA']}
            onCountryClick={(code) => {
              const countryMap: Record<string, string> = {
                GBR: 'uk', NLD: 'nl', FRA: 'fr', ESP: 'es', DEU: 'de', TUR: 'tr', USA: 'us',
              }
              const found = countries.find((c) => c.id === countryMap[code])
              setSelected(found ?? null)
            }}
          />

          {/* Legend */}
          <div className="absolute bottom-5 left-5 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gold" />
              <span className="text-xs text-white/60 font-sans">Ziyaret Edildi</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-white/20" />
              <span className="text-xs text-white/60 font-sans">Henüz Gidilmedi</span>
            </div>
          </div>

          {/* Country count badge */}
          <div className="absolute top-5 right-5 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 text-center">
            <p className="font-serif text-3xl font-semibold text-white">7</p>
            <p className="text-xs text-white/60 font-sans mt-0.5">Ülke</p>
          </div>
        </motion.div>

        {/* Selected country detail */}
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={cn(
              'mt-6 p-6 rounded-2xl border border-[var(--border)]',
              'bg-[var(--bg-primary)] shadow-soft',
              'flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between'
            )}
          >
            <div className="flex items-start gap-4">
              <span className="text-4xl">{selected.flag}</span>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <MapPin size={12} className="text-gold" />
                  <span className="text-xs text-[var(--text-tertiary)] font-sans">{selected.continent}</span>
                </div>
                <h3 className="font-serif text-2xl font-semibold text-[var(--text-primary)] mb-1">
                  {selected.name}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] font-sans max-w-md">
                  {selected.shortDescription}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {selected.highlights.slice(0, 3).map((h) => (
                    <span key={h} className="text-xs text-[var(--text-tertiary)] bg-[var(--bg-secondary)] rounded-full px-2.5 py-1 font-sans">
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="text-center px-4 py-3 bg-[var(--bg-secondary)] rounded-xl">
                <p className="font-serif text-2xl font-semibold text-[var(--text-primary)]">{selected.cityCount}</p>
                <p className="text-xs text-[var(--text-tertiary)] font-sans">Şehir</p>
              </div>
              <div className="text-center px-4 py-3 bg-[var(--bg-secondary)] rounded-xl">
                <p className="font-serif text-2xl font-semibold text-[var(--text-primary)]">{selected.visitedYear}</p>
                <p className="text-xs text-[var(--text-tertiary)] font-sans">Yıl</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="w-9 h-9 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}

        {/* Country pills */}
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          {countries.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelected(selected?.id === c.id ? null : c)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-sans',
                'transition-all duration-200 border',
                selected?.id === c.id
                  ? 'bg-gold border-gold text-white shadow-gold'
                  : 'bg-[var(--bg-primary)] border-[var(--border)] text-[var(--text-secondary)] hover:border-gold hover:text-gold'
              )}
            >
              <span>{c.flag}</span>
              <span>{c.name}</span>
              <span className="text-xs opacity-60">{c.cityCount} şehir</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
