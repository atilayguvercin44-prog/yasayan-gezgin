'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from '@/hooks/useInView'
import StoryCard from '@/components/ui/StoryCard'
import { stories } from '@/data/stories'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'

export default function Stories() {
  const { ref, isInView } = useInView<HTMLElement>({ threshold: 0.05 })
  const [activeTag, setActiveTag] = useState('Tümü')

  const allTags = ['Tümü', ...Array.from(new Set(stories.flatMap((s) => s.tags)))]

  const filtered = activeTag === 'Tümü'
    ? stories
    : stories.filter((s) => s.tags.includes(activeTag))

  const featured = filtered.find((s) => s.featured) ?? filtered[0]
  const rest = filtered.filter((s) => s.id !== featured?.id).slice(0, 4)

  return (
    <section
      id="stories"
      ref={ref}
      className="section-pad bg-[var(--bg-secondary)]"
      aria-label="Seyahat Hikayeleri"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-gold" />
              <span className="text-xs font-sans uppercase tracking-[0.3em] text-[var(--text-tertiary)]">
                Seyahat Günlüğü
              </span>
            </div>
            <h2 className="font-serif text-5xl md:text-6xl font-light leading-[1.1] text-[var(--text-primary)]">
              Anlatan<br />
              <em className="text-gradient-gold font-medium">Hikayeler</em>
            </h2>
          </div>
          <div className="scroll-x flex gap-2 pb-1">
            {allTags.slice(0, 8).map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={cn(
                  'whitespace-nowrap px-4 py-2 rounded-full text-sm font-sans font-medium flex-shrink-0',
                  'transition-all duration-200',
                  activeTag === tag
                    ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
                    : 'bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-secondary)] hover:border-gold hover:text-gold'
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Editorial grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Featured story — large left panel */}
          {featured && (
            <motion.article
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-2 group cursor-pointer"
            >
              <div className="relative aspect-[16/10] rounded-3xl overflow-hidden img-zoom shadow-medium mb-5">
                <Image
                  src={featured.coverImage}
                  alt={featured.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                {/* Featured badge */}
                <div className="absolute top-5 left-5 bg-gold text-white text-xs font-sans font-semibold px-3 py-1.5 rounded-full">
                  Öne Çıkan Hikaye
                </div>

                {/* Bottom overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-7">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-white/60 text-xs font-sans">{featured.city}</span>
                    <span className="text-white/30">·</span>
                    <span className="text-white/60 text-xs font-sans">{featured.readTime} dk okuma</span>
                  </div>
                  <h3 className="font-serif text-3xl md:text-4xl font-semibold text-white leading-tight mb-2 group-hover:text-gold-light transition-colors duration-200">
                    {featured.title}
                  </h3>
                  <p className="text-white/70 text-sm font-sans line-clamp-2 leading-relaxed">
                    {featured.summary}
                  </p>
                </div>
              </div>
            </motion.article>
          )}

          {/* Right column — 4 smaller stories */}
          <div className="flex flex-col gap-6">
            {rest.map((story, i) => (
              <StoryCard key={story.id} story={story} index={i} layout="horizontal" />
            ))}
          </div>
        </div>

        {/* All stories grid */}
        {filtered.length > 5 && (
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.slice(5).map((story, i) => (
              <StoryCard key={story.id} story={story} index={i} layout="vertical" />
            ))}
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-14 flex items-center justify-center"
        >
          <button className={cn(
            'group flex items-center gap-3 px-7 py-3.5 rounded-full',
            'border border-[var(--border)] text-[var(--text-secondary)]',
            'font-sans text-sm font-medium',
            'hover:border-gold hover:text-gold',
            'transition-all duration-300'
          )}>
            Tüm Hikayeleri Gör
            <ArrowRight
              size={14}
              className="group-hover:translate-x-1 transition-transform duration-200"
            />
          </button>
        </motion.div>
      </div>
    </section>
  )
}
