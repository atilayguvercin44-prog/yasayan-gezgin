'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MapPin, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { Country } from '@/types'
import { cn } from '@/lib/utils'

interface CountryCardProps {
  country: Country
  index?: number
}

export default function CountryCard({ country, index = 0 }: CountryCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={cn(
        'group relative rounded-3xl overflow-hidden cursor-pointer',
        'bg-[var(--bg-secondary)]',
        'transition-shadow duration-500 hover:shadow-strong'
      )}
    >
      <Link href={`/countries/${country.slug}`} className="absolute inset-0 z-10" aria-label={country.name} />
      {/* Image */}
      <div className="relative aspect-[4/3] img-zoom">
        <Image
          src={country.coverImage}
          alt={country.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Flag + continent */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className="text-2xl">{country.flag}</span>
          <span className="text-xs text-white/80 font-sans font-medium bg-black/30 backdrop-blur-sm rounded-full px-3 py-1">
            {country.continent}
          </span>
        </div>

        {/* City count badge */}
        <div className="absolute top-4 right-4 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5">
          <MapPin size={10} className="text-white" />
          <span className="text-white text-xs font-sans font-medium">{country.cityCount} şehir</span>
        </div>

        {/* Bottom text on image */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="font-serif text-2xl font-semibold text-white leading-tight mb-1">
            {country.name}
          </h3>
          <p className="text-white/70 text-xs font-sans line-clamp-2 leading-relaxed">
            {country.shortDescription}
          </p>
        </div>
      </div>

      {/* Bottom info strip */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {country.highlights.slice(0, 2).map((h) => (
            <span
              key={h}
              className="text-xs text-[var(--text-tertiary)] bg-[var(--bg-tertiary)] rounded-full px-2.5 py-1 font-sans"
            >
              {h}
            </span>
          ))}
        </div>
        <div className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
          'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]',
          'group-hover:bg-gold group-hover:text-white',
          'transition-all duration-300'
        )}>
          <ChevronRight size={14} />
        </div>
      </div>
    </motion.article>
  )
}
