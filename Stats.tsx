'use client'

import { motion } from 'framer-motion'
import { useInView } from '@/hooks/useInView'
import { useCountUp } from '@/hooks/useCountUp'

const stats = [
  {
    value: 7,
    suffix: '+',
    label: 'Ülke',
    description: 'Dört kıtada seyahat',
    delay: 0,
  },
  {
    value: 20,
    suffix: '+',
    label: 'Şehir',
    description: 'Sokak sokak keşfedildi',
    delay: 0.1,
  },
  {
    value: 50,
    suffix: '+',
    label: 'Hikaye',
    description: 'Yazıldı, paylaşıldı',
    delay: 0.2,
  },
  {
    value: 15000,
    suffix: '+',
    label: 'Takipçi',
    description: 'Instagram topluluğu',
    delay: 0.3,
  },
  {
    value: 3,
    suffix: ' yıl',
    label: 'Yolculuk',
    description: 'Devam eden macera',
    delay: 0.4,
  },
  {
    value: 100,
    suffix: '+',
    label: 'Anı',
    description: 'Bize kalan en değerli şey',
    delay: 0.5,
  },
]

function StatItem({
  value,
  suffix,
  label,
  description,
  delay,
  start,
}: (typeof stats)[0] & { start: boolean }) {
  const count = useCountUp(value, 2000, start)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.6, delay }}
      className="text-center group"
    >
      <div className="font-serif text-6xl md:text-7xl font-light text-[var(--text-primary)] leading-none mb-2 group-hover:text-gold transition-colors duration-300">
        {count.toLocaleString('tr-TR')}
        <span className="text-gold text-4xl md:text-5xl">{suffix}</span>
      </div>
      <div className="font-sans text-sm font-semibold uppercase tracking-widest text-[var(--text-primary)] mb-1">
        {label}
      </div>
      <div className="font-sans text-xs text-[var(--text-tertiary)]">
        {description}
      </div>
    </motion.div>
  )
}

export default function Stats() {
  const { ref, isInView } = useInView<HTMLElement>({ threshold: 0.2 })

  return (
    <section
      ref={ref}
      className="section-pad bg-[var(--bg-primary)] border-y border-[var(--border)]"
      aria-label="İstatistikler"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-gold" />
            <span className="text-xs font-sans uppercase tracking-[0.3em] text-[var(--text-tertiary)]">
              Rakamlarla
            </span>
            <div className="w-8 h-px bg-gold" />
          </div>
          <h2 className="font-serif text-5xl md:text-6xl font-light leading-[1.1] text-[var(--text-primary)]">
            Yolculuğun<br />
            <em className="text-gradient-gold font-medium">İzleri</em>
          </h2>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10 lg:gap-6">
          {stats.map((stat) => (
            <StatItem key={stat.label} {...stat} start={isInView} />
          ))}
        </div>

        {/* Divider with quote */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-20 text-center"
        >
          <div className="w-px h-12 bg-[var(--border)] mx-auto mb-6" />
          <blockquote className="font-serif text-2xl md:text-3xl font-light italic text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
            "Seyahat etmek, hayatı erken ölmekten kurtarmanın en güzel yolu."
          </blockquote>
          <p className="font-sans text-xs text-[var(--text-tertiary)] mt-4 uppercase tracking-widest">
            — Yaşayan Gezgin
          </p>
        </motion.div>
      </div>
    </section>
  )
}
