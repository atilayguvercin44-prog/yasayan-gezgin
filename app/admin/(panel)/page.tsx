'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Map, Building2, CheckCircle, FileEdit, Plus, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Stats {
  totalCountries: number
  totalCities: number
  publishedCountries: number
  draftCountries: number
  publishedCities: number
  draftCities: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    async function load() {
      const [countriesRes, citiesRes] = await Promise.all([
        fetch('/api/admin/countries'),
        fetch('/api/admin/cities'),
      ])
      const countries = await countriesRes.json()
      const cities    = await citiesRes.json()

      if (!Array.isArray(countries) || !Array.isArray(cities)) return

      setStats({
        totalCountries:    countries.length,
        totalCities:       cities.length,
        publishedCountries: countries.filter((c: { published: boolean }) => c.published).length,
        draftCountries:     countries.filter((c: { published: boolean }) => !c.published).length,
        publishedCities:    cities.filter((c: { published: boolean }) => c.published).length,
        draftCities:        cities.filter((c: { published: boolean }) => !c.published).length,
      })
    }
    load()
  }, [])

  const statCards = [
    { label: 'Toplam Ülke',     value: stats?.totalCountries,    icon: Map,         color: 'bg-blue-50 text-blue-600'   },
    { label: 'Toplam Şehir',    value: stats?.totalCities,       icon: Building2,   color: 'bg-purple-50 text-purple-600'},
    { label: 'Yayında',         value: stats ? stats.publishedCountries + stats.publishedCities : null, icon: CheckCircle, color: 'bg-green-50 text-green-600' },
    { label: 'Taslak',          value: stats ? stats.draftCountries + stats.draftCities : null,         icon: FileEdit,    color: 'bg-orange-50 text-orange-600'},
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-serif text-4xl font-semibold text-[#1C1C1C] mb-1">Dashboard</h1>
        <p className="text-sm text-[#9A9A9A] font-sans">Yaşayan Gezgin — İçerik Yönetimi</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.label} className="bg-white rounded-2xl p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-4', card.color)}>
                <Icon size={18} strokeWidth={1.5} />
              </div>
              <div className="font-serif text-3xl font-semibold text-[#1C1C1C] mb-1">
                {stats === null ? (
                  <div className="w-10 h-7 bg-[#F0EBE3] rounded animate-pulse" />
                ) : card.value}
              </div>
              <div className="text-xs text-[#9A9A9A] font-sans">{card.label}</div>
            </div>
          )
        })}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[
          {
            title: 'Ülkeler',
            desc: 'Ülkeleri listele, ekle veya düzenle',
            href: '/admin/countries',
            newHref: '/admin/countries/new',
            icon: Map,
          },
          {
            title: 'Şehirler',
            desc: 'Şehirleri listele, ekle veya düzenle',
            href: '/admin/cities',
            newHref: '/admin/cities/new',
            icon: Building2,
          },
        ].map((section) => {
          const Icon = section.icon
          return (
            <div key={section.title} className="bg-white rounded-2xl p-6 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#FAF7F2] rounded-xl flex items-center justify-center">
                  <Icon size={18} strokeWidth={1.5} className="text-[#C4956A]" />
                </div>
                <div>
                  <h2 className="font-serif text-xl font-semibold text-[#1C1C1C]">{section.title}</h2>
                  <p className="text-xs text-[#9A9A9A] font-sans">{section.desc}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Link
                  href={section.href}
                  className="flex items-center gap-1.5 text-sm font-sans font-medium text-[#6B6B6B] hover:text-[#1C1C1C] transition-colors"
                >
                  Listeye Git <ArrowRight size={13} />
                </Link>
                <span className="text-[#E8E2DA]">|</span>
                <Link
                  href={section.newHref}
                  className="flex items-center gap-1.5 text-sm font-sans font-medium text-[#C4956A] hover:text-[#A67952] transition-colors"
                >
                  <Plus size={13} /> Yeni Ekle
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
