'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Plus, Search, Pencil, Trash2, Globe, CheckCircle, XCircle } from 'lucide-react'
import { Country } from '@/types/db'
import { cn } from '@/lib/utils'

type Filter = 'all' | 'published' | 'draft'

export default function AdminCountriesPage() {
  const [countries, setCountries] = useState<Country[]>([])
  const [search, setSearch]       = useState('')
  const [filter, setFilter]       = useState<Filter>('all')
  const [loading, setLoading]     = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (filter !== 'all') params.set('published', filter === 'published' ? 'true' : 'false')

    const res  = await fetch(`/api/admin/countries?${params}`)
    const data = await res.json()
    if (Array.isArray(data)) setCountries(data)
    setLoading(false)
  }, [search, filter])

  useEffect(() => { load() }, [load])

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" silinecek. Bağlı tüm şehirler de silinir. Devam etmek istiyor musunuz?`)) return

    const res = await fetch(`/api/admin/countries/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setCountries((prev) => prev.filter((c) => c.id !== id))
    }
  }

  const filters: { label: string; value: Filter }[] = [
    { label: 'Tümü',   value: 'all'       },
    { label: 'Yayında', value: 'published' },
    { label: 'Taslak',  value: 'draft'     },
  ]

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-4xl font-semibold text-[#1C1C1C]">Ülkeler</h1>
          <p className="text-sm text-[#9A9A9A] font-sans mt-1">{countries.length} kayıt</p>
        </div>
        <Link
          href="/admin/countries/new"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1C1C1C] text-white text-sm font-sans font-medium hover:bg-[#C4956A] transition-colors"
        >
          <Plus size={15} /> Yeni Ülke
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A9A9A]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ülke ara…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#E8E2DA] bg-white text-sm font-sans focus:border-[#C4956A] focus:outline-none"
          />
        </div>
        <div className="flex gap-2">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                'px-4 py-2.5 rounded-xl text-sm font-sans font-medium transition-colors',
                filter === f.value
                  ? 'bg-[#1C1C1C] text-white'
                  : 'bg-white border border-[#E8E2DA] text-[#6B6B6B] hover:border-[#C4956A]'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-[#E8E2DA] border-t-[#C4956A] rounded-full animate-spin" />
          </div>
        ) : countries.length === 0 ? (
          <div className="text-center py-20">
            <Globe size={32} className="text-[#E8E2DA] mx-auto mb-3" />
            <p className="text-[#9A9A9A] font-sans text-sm">Kayıt bulunamadı</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#F0EBE3]">
                <th className="text-left px-6 py-4 text-xs font-medium text-[#9A9A9A] uppercase tracking-wider font-sans">Ülke</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-[#9A9A9A] uppercase tracking-wider font-sans">Slug</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-[#9A9A9A] uppercase tracking-wider font-sans">Durum</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EBE3]">
              {countries.map((country) => (
                <tr key={country.id} className="hover:bg-[#FAF7F2] transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-sans text-sm font-medium text-[#1C1C1C]">{country.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-xs bg-[#F0EBE3] text-[#6B6B6B] px-2 py-1 rounded-lg">{country.slug}</code>
                  </td>
                  <td className="px-6 py-4">
                    {country.published ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
                        <CheckCircle size={11} /> Yayında
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-orange-700 bg-orange-50 px-2.5 py-1 rounded-full">
                        <XCircle size={11} /> Taslak
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/countries/${country.id}/edit`}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-[#9A9A9A] hover:text-[#C4956A] hover:bg-[#F0EBE3] transition-all"
                      >
                        <Pencil size={14} />
                      </Link>
                      <button
                        onClick={() => handleDelete(country.id, country.name)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-[#9A9A9A] hover:text-red-500 hover:bg-red-50 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
