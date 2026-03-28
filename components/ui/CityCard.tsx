'use client'

import Image from 'next/image'
import { Clock, MapPin, ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { City } from '@/types'
import { cn } from '@/lib/utils'

interface CityCardProps {
  city: City
  index?: number
  variant?: 'default' | 'featured'
}

export default function CityCard({ city, index = 0, variant = 'default' }: CityCardProps) {
  const isFeatured = variant === 'featured'

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className={cn(
        'group relative rounded-3xl overflow-hidden cursor-pointer',
        'transition-all duration-500 hover:shadow-strong',
        isFeatured ? 'aspect-[3/4]' : 'aspect-square'
      )}
    >
      {/* Image */}
      <div className="absolute inset-0 img-zoom">
        <Image
          src={city.heroImage}
          alt={city.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Country badge */}
      <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1">
        <MapPin size={10} className="text-white/80" />
        <span className="text-white/80 text-xs font-sans">{city.countryName}</span>
      </div>

      {/* Tags */}
      <div className="absolute top-4 right-4 flex flex-col gap-1.5 items-end">
        {city.tags.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className="text-xs text-white/70 bg-white/10 backdrop-blur-sm rounded-full px-2.5 py-0.5 font-sans"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className={cn(
          'font-serif font-semibold text-white leading-tight mb-2',
          isFeatured ? 'text-3xl' : 'text-xl'
        )}>
          {city.name}
        </h3>
        <p className={cn(
          'text-white/70 font-sans leading-relaxed mb-4',
          isFeatured ? 'text-sm line-clamp-3' : 'text-xs line-clamp-2'
        )}>
          {city.excerpt}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-white/60">
            <Clock size={11} />
            <span className="text-xs font-sans">{city.visitDuration}</span>
          </div>
          <div className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center',
            'bg-white/10 backdrop-blur-sm text-white',
            'group-hover:bg-gold group-hover:scale-110',
            'transition-all duration-300'
          )}>
            <ArrowUpRight size={14} />
          </div>
        </div>
      </div>
    </motion.article>
  )
}
