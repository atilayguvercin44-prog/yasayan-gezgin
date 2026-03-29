import { supabase } from '@/lib/supabase'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { MapPin, ChevronLeft, Instagram } from 'lucide-react'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ countrySlug: string; citySlug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { citySlug } = await params
  const { data } = await supabase
    .from('cities')
    .select('name, description')
    .eq('slug', citySlug)
    .eq('published', true)
    .single()

  if (!data) return { title: 'Bulunamadı' }
  return {
    title: `${data.name} | Yaşayan Gezgin`,
    description: data.description ?? `${data.name} seyahat notları`,
  }
}

export default async function CityPage({ params }: Props) {
  const { countrySlug, citySlug } = await params

  // Şehiri ülkesiyle birlikte getir
  const { data: city } = await supabase
    .from('cities')
    .select('*, countries(id, name, slug)')
    .eq('slug', citySlug)
    .eq('published', true)
    .single()

  if (!city) notFound()

  const country = city.countries as { id: string; name: string; slug: string } | null

  // Güvenlik: URL'deki ülke slug'ı, şehirin ülkesiyle eşleşmeli
  if (country && country.slug !== countrySlug) notFound()

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--bg-primary)] pt-24">
        {/* Hero */}
        <section className="relative h-80 md:h-[480px] overflow-hidden">
          {city.cover_image ? (
            <Image
              src={city.cover_image}
              alt={city.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#1C1C1C] to-[#3D3D3D]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-14 max-w-5xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <Link
                href="/"
                className="text-white/50 hover:text-white text-sm font-sans transition-colors"
              >
                Ana Sayfa
              </Link>
              <span className="text-white/30 text-sm">/</span>
              <Link
                href={`/countries/${countrySlug}`}
                className="text-white/50 hover:text-white text-sm font-sans transition-colors"
              >
                {country?.name}
              </Link>
            </div>
            <h1 className="font-serif text-5xl md:text-7xl font-light text-white leading-tight">
              {city.name}
            </h1>
            {country && (
              <p className="text-white/60 font-sans text-sm mt-3 flex items-center gap-1.5">
                <MapPin size={13} /> {country.name}
              </p>
            )}
          </div>
        </section>

        {/* Content */}
        <section className="max-w-4xl mx-auto px-6 py-16">
          {city.description ? (
            <div className="prose prose-lg max-w-none">
              <p className="font-serif text-xl md:text-2xl font-light text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
                {city.description}
              </p>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="font-serif text-xl italic text-[var(--text-secondary)]">
                Bu şehir için henüz içerik yazılmamış. Yakında eklenecek.
              </p>
            </div>
          )}

          {/* Instagram Highlight */}
          {city.instagram_highlight_name && (
            <div className="mt-14 p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-between gap-4">
              <div>
                <p className="font-sans text-xs uppercase tracking-widest text-[var(--text-tertiary)] mb-1">
                  Instagram Highlight
                </p>
                <p className="font-serif text-xl font-medium text-[var(--text-primary)]">
                  {city.instagram_highlight_name}
                </p>
              </div>
              <a
                href="https://instagram.com/yasayangezgin"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1C1C1C] text-white text-sm font-sans hover:bg-[#C4956A] transition-colors flex-shrink-0"
              >
                <Instagram size={14} />
                Instagram
              </a>
            </div>
          )}

          {/* Back link */}
          <div className="mt-14 pt-8 border-t border-[var(--border)]">
            <Link
              href={`/countries/${countrySlug}`}
              className="inline-flex items-center gap-2 text-sm font-sans text-[var(--text-secondary)] hover:text-[#C4956A] transition-colors"
            >
              <ChevronLeft size={15} />
              {country?.name} şehirlerine dön
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
