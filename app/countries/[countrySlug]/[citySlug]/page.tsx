import { countries as staticCountries } from '@/data/countries'
import { cities    as staticCities }    from '@/data/cities'
import { supabase } from '@/lib/supabase'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { MapPin, ChevronLeft, Clock, Instagram } from 'lucide-react'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ countrySlug: string; citySlug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { citySlug } = await params
  const city = staticCities.find((c) => c.slug === citySlug)
  if (!city) return { title: 'Bulunamadı' }
  return {
    title: `${city.name} | Yaşayan Gezgin`,
    description: city.excerpt,
  }
}

export default async function CityPage({ params }: Props) {
  const { countrySlug, citySlug } = await params

  // 1. Ülkeyi bul
  const { data: dbCountry } = await supabase
    .from('countries')
    .select('id, name, slug, flag, cover_image')
    .eq('slug', countrySlug)
    .maybeSingle()

  const staticCountry = staticCountries.find((c) => c.slug === countrySlug)
  if (!dbCountry && !staticCountry) notFound()

  const countryId = dbCountry?.id
  const countryName = dbCountry?.name ?? staticCountry!.name
  const countryFlag = dbCountry?.flag ?? staticCountry!.flag

  // 2. Şehri Supabase'den al (published)
  let dbCity = null
  if (countryId) {
    const { data } = await supabase
      .from('cities')
      .select('*')
      .eq('slug', citySlug)
      .eq('country_id', countryId)
      .eq('published', true)
      .maybeSingle()
    dbCity = data
  }

  // 3. Statik veriye fallback
  const staticCity = staticCities.find(
    (c) => c.slug === citySlug && c.countryId === staticCountry?.id
  )

  if (!dbCity && !staticCity) notFound()

  // 4. Birleştir: Supabase öncelikli
  const city = {
    name:            dbCity?.name            ?? staticCity!.name,
    heroImage:       dbCity?.hero_image      ?? dbCity?.cover_image ?? staticCity!.heroImage,
    excerpt:         dbCity?.excerpt         ?? staticCity!.excerpt,
    fullDescription: dbCity?.full_description ?? dbCity?.description ?? staticCity!.fullDescription,
    visitDuration:   dbCity?.visit_duration  ?? staticCity!.visitDuration,
    tags:            (dbCity?.tags           ?? staticCity!.tags)    as string[],
    highlights:      (dbCity?.highlights     ?? staticCity!.highlights) as string[],
    tips:            (dbCity?.tips           ?? staticCity!.tips)    as string[],
    gallery:         (dbCity?.gallery        ?? staticCity!.gallery) as string[],
    mustSee:         (dbCity?.must_see       ?? staticCity!.mustSee) as { name: string; description: string }[],
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--bg-primary)] pt-24">
        {/* Hero */}
        <section className="relative h-80 md:h-[480px] overflow-hidden">
          <Image
            src={city.heroImage}
            alt={city.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-14 max-w-5xl mx-auto">
            <div className="flex items-center gap-2 mb-4 text-sm font-sans">
              <Link href="/" className="text-white/50 hover:text-white transition-colors">Ana Sayfa</Link>
              <span className="text-white/30">/</span>
              <Link href={`/countries/${countrySlug}`} className="text-white/50 hover:text-white transition-colors">
                {countryFlag} {countryName}
              </Link>
            </div>
            <h1 className="font-serif text-5xl md:text-7xl font-light text-white leading-tight">
              {city.name}
            </h1>
            <div className="flex items-center gap-4 mt-3 flex-wrap">
              <p className="text-white/60 font-sans text-sm flex items-center gap-1.5">
                <MapPin size={13} /> {countryName}
              </p>
              {city.visitDuration && (
                <p className="text-white/60 font-sans text-sm flex items-center gap-1.5">
                  <Clock size={13} /> {city.visitDuration}
                </p>
              )}
              <div className="flex gap-2 flex-wrap">
                {city.tags?.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-xs text-white/60 bg-white/10 backdrop-blur-sm rounded-full px-2.5 py-1 font-sans">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="max-w-4xl mx-auto px-6 py-16">
          {/* Excerpt */}
          <p className="font-serif text-2xl md:text-3xl font-light italic text-[var(--text-secondary)] leading-relaxed mb-10 border-l-2 border-[#C4956A] pl-6">
            &ldquo;{city.excerpt}&rdquo;
          </p>

          {/* Full description */}
          <p className="font-sans text-base text-[var(--text-secondary)] leading-relaxed mb-14">
            {city.fullDescription}
          </p>

          {/* Must See */}
          {city.mustSee?.length > 0 && (
            <div className="mb-14">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-px bg-[#C4956A]" />
                <span className="text-xs font-sans uppercase tracking-[0.3em] text-[var(--text-tertiary)]">
                  Mutlaka Görülmeli
                </span>
              </div>
              <div className="space-y-4">
                {city.mustSee.map((item, i) => (
                  <div key={i} className="flex gap-4 p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)]">
                    <div className="w-8 h-8 rounded-full bg-[#C4956A] text-white flex items-center justify-center text-sm font-sans font-semibold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-semibold text-[var(--text-primary)] mb-1">{item.name}</h3>
                      <p className="text-sm text-[var(--text-secondary)] font-sans">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          {city.tips?.length > 0 && (
            <div className="mb-14">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-px bg-[#C4956A]" />
                <span className="text-xs font-sans uppercase tracking-[0.3em] text-[var(--text-tertiary)]">
                  Gezi Notları
                </span>
              </div>
              <ul className="space-y-3">
                {city.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm font-sans text-[var(--text-secondary)]">
                    <span className="text-[#C4956A] mt-0.5 flex-shrink-0">→</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Gallery */}
          {city.gallery?.length > 0 && (
            <div className="mb-14">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-px bg-[#C4956A]" />
                <span className="text-xs font-sans uppercase tracking-[0.3em] text-[var(--text-tertiary)]">
                  Galeri
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {city.gallery.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-2xl overflow-hidden">
                    <Image
                      src={img}
                      alt={`${city.name} - ${i + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instagram CTA */}
          <div className="p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-between gap-4">
            <div>
              <p className="font-sans text-xs uppercase tracking-widest text-[var(--text-tertiary)] mb-1">
                Instagram&apos;da Daha Fazlası
              </p>
              <p className="font-serif text-xl font-medium text-[var(--text-primary)]">
                @yasayangezgin
              </p>
            </div>
            <a
              href="https://instagram.com/yasayangezgin"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1C1C1C] text-white text-sm font-sans hover:bg-[#C4956A] transition-colors flex-shrink-0"
            >
              <Instagram size={14} />
              Takip Et
            </a>
          </div>

          {/* Back */}
          <div className="mt-12 pt-8 border-t border-[var(--border)]">
            <Link
              href={`/countries/${countrySlug}`}
              className="inline-flex items-center gap-2 text-sm font-sans text-[var(--text-secondary)] hover:text-[#C4956A] transition-colors"
            >
              <ChevronLeft size={15} />
              {countryName} şehirlerine dön
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
