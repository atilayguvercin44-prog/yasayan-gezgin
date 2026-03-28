'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from '@/hooks/useInView'
import CityCard from '@/components/ui/CityCard'
import { cities } from '@/data/cities'
import { countries } from '@/data/countries'
import { cn } from '@/lib/utils'

export default function FeaturedCities() {
  const { ref, isInView } = useInView<HTMLElement>({ threshold: 0.05 })
  const [activeCountry, setActiveCountry] = useState('all')

  const countryOptions = [
    { id: 'all', name: 'Tümü' },
    ...countries.filter((c) => cities.some((ci) => ci.countryId === c.id)),
  ]

  const filtered = activeCountry === 'all'
    ? cities
    : cities.filter((c) => c.countryId === activeCountry)

  const featured = filtered[0]
  const rest = filtered.slice(1, 5)

  return (
    <section
      id="cities"
      ref={ref}
      className="section-pad bg-[var(--bg-primary)] overflow-hidden"
      aria-label="Şehirler"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-px bg-gold" />
                <span className="text-xs font-sans uppercase tracking-[0.3em] text-[var(--text-tertiary)]">
                  Keşfedilen Şehirler
                </span>
              </div>
              <h2 className="font-serif text-5xl md:text-6xl font-light leading-[1.1] text-[var(--text-primary)]">
                Her Şehir Ayrı<br />
                <em className="text-gradient-gold font-medium">Bir His</em>
              </h2>
            </div>

            {/* Country filter — scrollable on mobile */}
            <div className="scroll-x flex gap-2 pb-1">
              {countryOptions.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveCountry(c.id)}
                  className={cn(
                    'whitespace-nowrap px-4 py-2 rounded-full text-sm font-sans font-medium flex-shrink-0',
                    'transition-all duration-200',
                    activeCountry === c.id
                      ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
                      : 'bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)] hover:border-gold hover:text-gold'
                  )}
                >
                  {'flag' in c ? `${(c as { flag: string }).flag} ` : ''}{c.name}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Asymmetric Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Featured — span 2 rows on large */}
            {featured && (
              <div className="lg:row-span-2">
                <CityCard city={featured} index={0} variant="featured" />
              </div>
            )}
            {/* Rest */}
            {rest.map((city, i) => (
              <CityCard key={city.id} city={city} index={i + 1} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="font-serif text-xl text-[var(--text-secondary)]">
              Bu ülke için henüz şehir eklenmedi.
            </p>
          </div>
        )}

        {/* Horizontal scroll city names bar */}
        <div className="mt-14 border-t border-[var(--border)] pt-8">
          <div className="scroll-x flex gap-6">
            {cities.map((city) => (
              <button
                key={city.id}
                onClick={() => setActiveCountry(city.countryId)}
                className={cn(
                  'flex-shrink-0 flex flex-col items-center gap-1 group',
                  'pb-2 relative'
                )}
              >
                <span className={cn(
                  'font-serif text-2xl font-light transition-colors duration-200',
                  activeCountry === city.countryId || activeCountry === 'all'
                    ? 'text-[var(--text-primary)]'
                    : 'text-[var(--text-tertiary)]',
                  'group-hover:text-gold'
                )}>
                  {city.name}
                </span>
                <span className="text-xs text-[var(--text-tertiary)] font-sans">
                  {city.countryName}
                </span>
                <div className={cn(
                  'absolute bottom-0 left-0 right-0 h-px bg-gold transition-opacity duration-200',
                  activeCountry === city.countryId ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
                )} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
