'use client'

import { motion } from 'framer-motion'
import { useInView } from '@/hooks/useInView'
import { Instagram, Heart, MapPin } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

const traits = [
  { icon: '✈️', label: '7 Ülke Gezdik' },
  { icon: '👨‍👩‍👧', label: 'Ailecek Seyahat' },
  { icon: '📸', label: 'Her Anı Kaydettik' },
  { icon: '📍', label: '20+ Şehir Keşfettik' },
]

export default function About() {
  const { ref, isInView } = useInView<HTMLElement>({ threshold: 0.15 })

  return (
    <section
      id="about"
      ref={ref}
      className="section-pad bg-[var(--bg-primary)] overflow-hidden"
      aria-label="Hakkında"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative"
          >
            {/* Main image */}
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden img-zoom shadow-strong">
              <Image
                src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80"
                alt="Yaşayan Gezgin — Paris"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              {/* Location badge */}
              <div className="absolute bottom-6 left-6 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-soft">
                <MapPin size={12} className="text-gold" />
                <span className="text-xs font-sans font-medium text-charcoal-800">
                  Paris, Fransa
                </span>
              </div>
            </div>

            {/* Floating accent card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.4, duration: 0.6 }}
              className={cn(
                'absolute -right-6 top-1/3 -translate-y-1/2',
                'bg-[var(--bg-primary)] border border-[var(--border)]',
                'rounded-2xl p-5 shadow-medium',
                'hidden md:block'
              )}
            >
              <Heart size={20} className="text-gold mb-3" strokeWidth={1.5} />
              <p className="font-serif text-2xl font-semibold text-[var(--text-primary)]">50+</p>
              <p className="font-sans text-xs text-[var(--text-tertiary)] mt-0.5">Paylaşılan Hikaye</p>
            </motion.div>

            {/* Decorative element */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-gold/10 blur-2xl -z-10" />
          </motion.div>

          {/* Text Side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Section label */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-gold" />
              <span className="text-xs font-sans uppercase tracking-[0.3em] text-[var(--text-tertiary)]">
                Kimiz
              </span>
            </div>

            {/* Headline */}
            <h2 className="font-serif text-5xl md:text-6xl font-light leading-[1.1] text-[var(--text-primary)] mb-6">
              Seyahat etmek<br />
              <em className="text-gradient-gold font-medium">bir yaşam biçimi</em>
            </h2>

            {/* Pull quote */}
            <blockquote className="border-l-2 border-gold pl-5 mb-8">
              <p className="font-serif text-xl italic font-light text-[var(--text-secondary)] leading-relaxed">
                "Bir ülke sadece harita üzerindeki bir nokta değil; insanları, kokuları, sesleri, renkleri ve hikayeleriyle size bir şeyler söyleyen bir varlık."
              </p>
            </blockquote>

            {/* Body text */}
            <div className="space-y-4 font-sans text-sm leading-relaxed text-[var(--text-secondary)] mb-8">
              <p>
                Ben Yaşayan Gezgin. Ailecek yola çıktık; çocuklarımızla birlikte dünyanın dört bir yanını gördük, hissettik, tattık. Her şehirde bir hikaye bıraktık, her ülkede bir parçamızı unuttuk.
              </p>
              <p>
                Bu site bir gezi blogu değil. Anılarımızın dijital evi. Şehirlere dair yazılar, rotalar, gezi notları ve her gezinin bize kattığı o tarif edilemez his.
              </p>
              <p>
                Sizi de bu keşfe davet ediyoruz.
              </p>
            </div>

            {/* Trait chips */}
            <div className="flex flex-wrap gap-3 mb-10">
              {traits.map((t) => (
                <div
                  key={t.label}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-sans',
                    'bg-[var(--bg-secondary)] text-[var(--text-secondary)]',
                    'border border-[var(--border)]'
                  )}
                >
                  <span>{t.icon}</span>
                  <span>{t.label}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <a
              href="https://instagram.com/yasayangezgin"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'inline-flex items-center gap-3 px-7 py-3.5 rounded-full',
                'bg-[var(--text-primary)] text-[var(--bg-primary)]',
                'font-sans text-sm font-medium tracking-wide',
                'hover:shadow-strong transition-all duration-300',
                'hover:scale-[1.02] active:scale-[0.98]'
              )}
            >
              <Instagram size={16} strokeWidth={1.5} />
              Instagram&apos;da Takip Et
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
