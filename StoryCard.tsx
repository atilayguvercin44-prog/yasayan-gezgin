'use client'

import Image from 'next/image'
import { Clock, MapPin, ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { Story } from '@/types'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface StoryCardProps {
  story: Story
  index?: number
  layout?: 'horizontal' | 'vertical'
}

export default function StoryCard({ story, index = 0, layout = 'vertical' }: StoryCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={cn(
        'group cursor-pointer',
        layout === 'horizontal'
          ? 'flex gap-5 items-start'
          : 'flex flex-col'
      )}
    >
      {/* Image */}
      <div className={cn(
        'relative rounded-2xl overflow-hidden img-zoom flex-shrink-0',
        layout === 'horizontal' ? 'w-36 h-28' : 'aspect-[16/10] w-full mb-5'
      )}>
        <Image
          src={story.coverImage}
          alt={story.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
        />
        {/* Featured badge */}
        {story.featured && layout === 'vertical' && (
          <div className="absolute top-3 left-3 bg-gold text-white text-xs font-sans font-medium px-2.5 py-1 rounded-full">
            Öne Çıkan
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Meta */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1.5 text-[var(--text-tertiary)]">
            <MapPin size={11} />
            <span className="text-xs font-sans">{story.city}</span>
          </div>
          <span className="text-[var(--border-strong)] text-xs">·</span>
          <div className="flex items-center gap-1.5 text-[var(--text-tertiary)]">
            <Clock size={11} />
            <span className="text-xs font-sans">{story.readTime} dk</span>
          </div>
        </div>

        {/* Title */}
        <h3 className={cn(
          'font-serif font-semibold leading-snug text-[var(--text-primary)] mb-2',
          'group-hover:text-gold transition-colors duration-200',
          layout === 'horizontal' ? 'text-base' : 'text-xl'
        )}>
          {story.title}
        </h3>

        {layout === 'vertical' && (
          <>
            <p className="text-sm font-sans text-[var(--text-secondary)] leading-relaxed mb-4 line-clamp-2">
              {story.summary}
            </p>
            <div className="flex items-center justify-between">
              <time className="text-xs text-[var(--text-tertiary)] font-sans">
                {formatDate(story.publishedAt)}
              </time>
              <div className={cn(
                'flex items-center gap-1.5 text-xs font-sans font-medium',
                'text-[var(--text-secondary)] group-hover:text-gold',
                'transition-colors duration-200'
              )}>
                Oku
                <ArrowUpRight
                  size={12}
                  className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
                />
              </div>
            </div>
          </>
        )}

        {layout === 'horizontal' && (
          <p className="text-xs font-sans text-[var(--text-tertiary)] mt-1">
            {formatDate(story.publishedAt)}
          </p>
        )}
      </div>
    </motion.article>
  )
}
