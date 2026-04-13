import { countries as staticCountries } from '@/data/countries'
import { cities as staticCities }       from '@/data/cities'
import { supabase } from '@/lib/supabase'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { MapPin, ArrowRight, ChevronLeft } from 'lucide-react'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ countrySlug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { countrySlug } = await params
  const country = staticCountries.find((c) => c.slug === countrySlug)
  if (!country) return { title: 'Bulunamadı' }
  return {
    title: `${country.name} | Yaşayan Gezgin`,
    description: country.shortDescription,
  }
}

export default async function CountryPage({ params }: Props) {
  const { countrySlug } = await params

  // 1. Supabase'den al (published olanlar)
  const { data: dbCountry } = await supabase
    .from('countries')
    .select('*')
    .eq('slug', countrySlug)
    .eq('published', true)
    .maybeSingle()

  const { data: dbCities } = dbCountry
    ? await supabase
        .from('cities')
        .select('*')
        .eq('country_id', dbCountry.id)
        .eq('published', true)
        .order('name')
    : { data: null }

  // 2. Statik veriye fallback
  const staticCountry = staticCountries.find((c) => c.slug === countrySlug)
  if (!dbCountry && !staticCountry) notFound()

  const country = {
    name:            dbCountry?.name            ?? staticCountry!.name,
    slug:            dbCountry?.slug            ?? staticCountry!.slug,
    flag:            dbCountry?.flag            ?? staticCountry!.flag,
    coverImage:      dbCountry?.cover_image     ?? staticCountry!.coverImage,
    continent:       dbCountry?.continent       ?? staticCountry!.continent,
    longDescription: dbCountry?.description     ?? staticCountry!.longDescription,
  }

  // Şehirler: Supabase'deyse Supabase'den, yoksa statikten
  const countryCities = dbCities?.length
    ? dbCities.map((c) => ({
        id:         c.id,
        slug:       c.slug,
        name:       c.name,
        heroImage:  c.hero_image ?? c.cover_image ?? '',
        excerpt:    c.excerpt    ?? c.description  ?? '',
      }))
    : staticCities
        .filter((c) => c.countryId === staticCountry?.id)
        .map((c) => ({
          id:        c.id,
          slug:      c.slug,
          name:      c.name,
          heroImage: c.heroImage,
          excerpt:   c.excerpt,
        }))

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--bg-primary)] pt-24">
        {/* Hero */}
        <section className="relative h-72 md:h-96 overflow-hidden">
          <Image
            src={country.coverImage}
            alt={country.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-14 max-w-6xl mx-auto">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm font-sans mb-4 transition-colors"
            >
              <ChevronLeft size={14} /> Ana Sayfa
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">{country.flag}</span>
              <h1 className="font-serif text-5xl md:text-7xl font-light text-white leading-tight">
                {country.name}
              </h1>
            </div>
            <p className="text-white/60 font-sans text-sm flex items-center gap-1.5">
              <MapPin size={13} /> {countryCities.length} şehir · {country.continent}
            </p>
          </div>
        </section>

        {/* Description */}
        <section className="max-w-4xl mx-auto px-6 py-14">
          <p className="font-serif text-xl md:text-2xl font-light text-[var(--text-secondary)] leading-relaxed">
            {country.longDescription}
          </p>
        </section>

        {/* Cities */}
        <section className="max-w-6xl mx-auto px-6 pb-24">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-px bg-[#C4956A]" />
            <span className="text-xs font-sans uppercase tracking-[0.3em] text-[var(--text-tertiary)]">Şehirler</span>
          </div>

          {countryCities.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-serif text-xl text-[var(--text-secondary)]">Henüz şehir eklenmemiş.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {countryCities.map((city) => (
                <Link
                  key={city.id}
                  href={`/countries/${countrySlug}/${city.slug}`}
                  className="group relative rounded-3xl overflow-hidden aspect-[4/3] block"
                >
                  <Image
                    src={city.heroImage}
                    alt={city.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between">
                    <div>
                      <h2 className="font-serif text-2xl font-semibold text-white">{city.name}</h2>
                      <p className="text-white/60 text-xs font-sans mt-1 line-clamp-2">{city.excerpt}</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-[#C4956A] transition-colors duration-300 flex-shrink-0 ml-3">
                      <ArrowRight size={15} className="text-white" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}
