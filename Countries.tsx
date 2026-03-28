'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from '@/hooks/useInView'
import CountryCard from '@/components/ui/CountryCard'
import { countries } from '@/data/countries'
import { cn } from '@/lib/utils'

const continents = ['Tümü', ...Array.from(new Set(countries.map((c) => c.continent)))]

export default function Countries() {
  const { ref, isInView } = useInView<HTMLElement>({ threshold: 0.05 })
  const [activeContinent, setActiveContinent] = useState('Tümü')

  const filtered = activeContinent === 'Tümü'
    ? countries
    : countries.filter((c) => c.continent === activeContinent)

  return (
    <section
      id="countries"
      ref={ref}
      className="section-pad bg-[var(--bg-secondary)]"
      aria-label="Ülkeler"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-gold" />
              <span className="text-xs font-sans uppercase tracking-[0.3em] text-[var(--text-tertiary)]">
                Dünyadan
              </span>
            </div>
            <h2 className="font-serif text-5xl md:text-6xl font-light leading-[1.1] text-[var(--text-primary)]">
              Gezilen<br />
              <em className="text-gradient-gold font-medium">Ülkeler</em>
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {continents.map((continent) => (
              <button
                key={continent}
                onClick={() => setActiveContinent(continent)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-sans font-medium',
                  'transition-all duration-200',
                  activeContinent === continent
                    ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
                    : 'bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-secondary)] hover:border-gold hover:text-gold'
                )}
              >
                {continent}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((country, i) => (
            <CountryCard key={country.id} country={country} index={i} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-14 text-center"
        >
          <p className="font-serif text-lg italic text-[var(--text-secondary)] mb-4">
            Her yıl yeni ülkeler ekleniyor…
          </p>
          <button
            onClick={() => document.querySelector('#map')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center gap-2 text-sm font-sans font-medium text-gold hover-underline"
          >
            Haritada Gör →
          </button>
        </motion.div>
      </div>
    </section>
  )
}
