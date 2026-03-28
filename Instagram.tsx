'use client'

import { motion } from 'framer-motion'
import { useInView } from '@/hooks/useInView'
import { socialPosts } from '@/data/social'
import { Instagram, Heart, Play, ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import { formatNumber, cn } from '@/lib/utils'

export default function InstagramSection() {
  const { ref, isInView } = useInView<HTMLElement>({ threshold: 0.05 })

  return (
    <section
      id="instagram"
      ref={ref}
      className="section-pad bg-[var(--bg-primary)]"
      aria-label="Instagram"
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
                @yasayangezgin
              </span>
            </div>
            <h2 className="font-serif text-5xl md:text-6xl font-light leading-[1.1] text-[var(--text-primary)]">
              Instagram&apos;dan<br />
              <em className="text-gradient-gold font-medium">Son Kareler</em>
            </h2>
          </div>

          <a
            href="https://instagram.com/yasayangezgin"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'inline-flex items-center gap-3 px-6 py-3 rounded-full',
              'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400',
              'text-white font-sans text-sm font-medium',
              'hover:shadow-strong hover:scale-[1.02]',
              'transition-all duration-300 flex-shrink-0'
            )}
          >
            <Instagram size={15} />
            Takip Et
            <ArrowUpRight size={13} />
          </a>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {/* First item — featured large */}
          {socialPosts.slice(0, 1).map((post) => (
            <motion.a
              key={post.id}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5 }}
              className="col-span-2 row-span-2 group relative rounded-2xl overflow-hidden aspect-square"
            >
              <Image
                src={post.image}
                alt={post.location}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white text-xs font-sans line-clamp-3 leading-relaxed mb-2">
                  {post.caption}
                </p>
                <div className="flex items-center gap-2 text-white/70">
                  <Heart size={12} />
                  <span className="text-xs font-sans">{formatNumber(post.likes)}</span>
                </div>
              </div>
              {/* Location badge */}
              <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1.5">
                <span className="text-white text-xs font-sans">{post.location}</span>
              </div>
            </motion.a>
          ))}

          {/* Rest */}
          {socialPosts.slice(1, 9).map((post, i) => (
            <motion.a
              key={post.id}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="group relative rounded-2xl overflow-hidden aspect-square"
            >
              <Image
                src={post.image}
                alt={post.location}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2">
                {post.isVideo ? (
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Play size={16} className="text-white ml-0.5" fill="white" />
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-white">
                    <Heart size={14} fill="white" />
                    <span className="text-sm font-sans font-medium">{formatNumber(post.likes)}</span>
                  </div>
                )}
                <p className="text-white text-xs font-sans px-3 text-center line-clamp-2 leading-relaxed">
                  {post.location}
                </p>
              </div>

              {/* Video indicator */}
              {post.isVideo && (
                <div className="absolute top-2.5 right-2.5 bg-black/40 backdrop-blur-sm rounded-full p-1.5">
                  <Play size={10} className="text-white" fill="white" />
                </div>
              )}
            </motion.a>
          ))}
        </div>

        {/* Bottom CTA area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)]"
        >
          <div className="flex items-center gap-4">
            <div className={cn(
              'w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0',
              'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400'
            )}>
              <Instagram size={24} className="text-white" />
            </div>
            <div>
              <p className="font-serif text-xl font-semibold text-[var(--text-primary)]">
                @yasayangezgin
              </p>
              <p className="font-sans text-sm text-[var(--text-secondary)]">
                15.000+ kişi bu yolculuğu takip ediyor
              </p>
            </div>
          </div>
          <a
            href="https://instagram.com/yasayangezgin"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'flex items-center gap-2 px-6 py-3 rounded-full',
              'bg-[var(--text-primary)] text-[var(--bg-primary)]',
              'font-sans text-sm font-medium',
              'hover:shadow-strong hover:scale-[1.02]',
              'transition-all duration-300 flex-shrink-0'
            )}
          >
            Instagram&apos;da Daha Fazlası
            <ArrowUpRight size={13} />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
